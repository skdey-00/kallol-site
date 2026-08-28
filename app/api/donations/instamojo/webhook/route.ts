import { NextRequest, NextResponse } from "next/server"
import { handleInstamojoWebhook } from "@/actions/donations"

/**
 * Instamojo webhook target (configured as `webhook` on the payment request).
 * Instamojo POSTs form-urlencoded payment details here — never JSON.
 * Non-2xx responses make Instamojo retry, which is desirable on transient errors;
 * our finalizer is idempotent so duplicate webhooks are harmless.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const fields: Record<string, string> = {}
    formData.forEach((value, key) => {
      if (typeof value === "string") {
        fields[key] = value
      }
    })

    if (!fields.payment_request_id) {
      console.error("Instamojo webhook: missing payment_request_id")
      return NextResponse.json({ error: "Missing payment_request_id" }, { status: 400 })
    }

    const accepted = await handleInstamojoWebhook(fields)
    if (!accepted) {
      // Bad MAC or unknown payment request — 400 so Instamojo retries while we investigate.
      console.error("Instamojo webhook rejected for payment request:", fields.payment_request_id)
      return NextResponse.json({ error: "Verification failed" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Instamojo webhook handler error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
