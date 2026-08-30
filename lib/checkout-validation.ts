/**
 * Shared checkout/donation form helpers used by both actions/donations.ts and
 * actions/orders.ts. Kept in a plain lib module because "use server" files may
 * only export async functions.
 */

/** Normalizes an Indian phone number to 10 digits (strips +91 / 0 / separators). */
export function normalizePhoneNumber(raw: string): string | null {
  const digits = raw.replace(/[\s\-().]/g, "")
  const stripped = digits.replace(/^(\+91|91|0)/, "")
  return /^\d{10}$/.test(stripped) ? stripped : null
}

/** Public site URL used to build the Instamojo redirect/webhook URLs. */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002").replace(/\/+$/, "")
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
