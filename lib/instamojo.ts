import { createHmac, timingSafeEqual } from "crypto"

/**
 * Instamojo Payments API v2 client (server-side only).
 *
 * Docs: https://docs.instamojo.com/ (v2, Application Based Authentication)
 * - Live base:    https://www.instamojo.com
 * - Sandbox base: https://test.instamojo.com
 *
 * Env vars:
 * - INSTAMOJO_CLIENT_ID / INSTAMOJO_CLIENT_SECRET — App ID + secret from
 *   instamojo.com → Dashboard → API & Plugins (used for the OAuth token).
 * - INSTAMOJO_SALT — private salt, used for MAC verification of redirects/webhooks.
 * - INSTAMOJO_ENDPOINT — base URL override (set to https://test.instamojo.com for sandbox).
 */

const BASE_URL = (process.env.INSTAMOJO_ENDPOINT || "https://www.instamojo.com").replace(/\/+$/, "")

/** Returns true when all credentials needed for online payments are present. */
export function isInstamojoConfigured(): boolean {
  return !!(process.env.INSTAMOJO_CLIENT_ID && process.env.INSTAMOJO_CLIENT_SECRET && process.env.INSTAMOJO_SALT)
}

// --- OAuth token (client credentials grant), cached in module scope ---

let cachedToken: string | null = null
let tokenExpiresAt = 0

export async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken
  }

  const clientId = process.env.INSTAMOJO_CLIENT_ID
  const clientSecret = process.env.INSTAMOJO_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error("Instamojo credentials are not configured")
  }

  const response = await fetch(`${BASE_URL}/oauth2/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
    cache: "no-store",
  })

  if (!response.ok) {
    const text = await response.text().catch(() => "")
    throw new Error(`Instamojo token request failed (${response.status}): ${text}`)
  }

  const data = (await response.json()) as { access_token: string; expires_in: number }
  cachedToken = data.access_token
  // Refresh a minute early to avoid clock skew at the boundary.
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000
  return cachedToken
}

// --- Payment requests ---

export interface CreatePaymentRequestOptions {
  amount: number
  buyerName: string
  phone: string
  email?: string
  purpose: string
  redirectUrl: string
  webhookUrl: string
  transactionId: string
}

export interface PaymentRequest {
  id: string
  longurl: string
  status: string
  amount: string
  payments?: PaymentInfo[]
}

export interface PaymentInfo {
  payment_id: string
  status: string
}

export async function createPaymentRequest(opts: CreatePaymentRequestOptions): Promise<PaymentRequest> {
  const token = await getAccessToken()

  const body: Record<string, string> = {
    purpose: opts.purpose,
    amount: opts.amount.toFixed(2),
    buyer_name: opts.buyerName,
    phone: opts.phone,
    redirect_url: opts.redirectUrl,
    webhook: opts.webhookUrl,
    allow_repeated_payments: "false",
    transaction_id: opts.transactionId,
  }
  if (opts.email) {
    body.email = opts.email
  }

  const response = await fetch(`${BASE_URL}/v2/payment_requests/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body),
    cache: "no-store",
  })

  if (!response.ok) {
    const text = await response.text().catch(() => "")
    throw new Error(`Instamojo payment request failed (${response.status}): ${text}`)
  }

  return (await response.json()) as PaymentRequest
}

/** Fetches a payment request from Instamojo for server-side status reconciliation. */
export async function fetchPaymentRequest(paymentRequestId: string): Promise<PaymentRequest> {
  const token = await getAccessToken()

  const response = await fetch(`${BASE_URL}/v2/payment_requests/${paymentRequestId}/`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })

  if (!response.ok) {
    const text = await response.text().catch(() => "")
    throw new Error(`Instamojo fetch payment request failed (${response.status}): ${text}`)
  }

  return (await response.json()) as PaymentRequest
}

// --- MAC verification (webhook + redirect) ---
// Official algorithm (instamojo/Instamojo-snippets/mac_validation.php):
// remove the `mac` key, sort remaining keys case-insensitively as strings,
// join the VALUES with "|", HMAC-SHA1 the result with the private salt.

export function verifyMac(params: Record<string, string>, salt: string, mac: string): boolean {
  if (!salt || !mac) return false

  const values = Object.keys(params)
    .filter((key) => key !== "mac")
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map((key) => params[key])

  const expected = createHmac("sha1", salt).update(values.join("|")).digest("hex")

  const a = Buffer.from(expected)
  const b = Buffer.from(mac)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}
