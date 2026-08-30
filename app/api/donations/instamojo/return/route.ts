import { NextRequest, NextResponse } from "next/server"
import { handleInstamojoReturn } from "@/actions/donations"

/**
 * Instamojo redirect target after payment (configured as `redirect_url`).
 * The browser lands here with `payment_request_id`, `payment_id`, `payment_status`
 * and `mac` query params. We verify, reconcile server-side, then redirect the
 * buyer to the thank-you page — shop checkout orders (checkout_kind = 'shop')
 * go to /checkout/thank-you, donations to /donate/thank-you.
 */
export async function GET(request: NextRequest) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin).replace(/\/+$/, "")

  try {
    const params = request.nextUrl.searchParams
    const paymentRequestId = params.get("payment_request_id")
    const paymentId = params.get("payment_id")
    const statusParam = params.get("payment_status")
    const macProvided = params.get("mac")

    if (!paymentRequestId) {
      console.error("Instamojo return: missing payment_request_id")
      return NextResponse.redirect(`${siteUrl}/donate`)
    }

    const { donationId, verified, checkoutKind } = await handleInstamojoReturn({
      paymentRequestId,
      paymentId,
      statusParam,
      macProvided,
    })

    if (!donationId) {
      console.error("Instamojo return: no donation found for payment request", paymentRequestId)
      return NextResponse.redirect(`${siteUrl}/donate`)
    }

    const thankYouPath = checkoutKind === "shop" ? "/checkout/thank-you" : "/donate/thank-you"
    const thankYouUrl = new URL(`${siteUrl}${thankYouPath}`)
    thankYouUrl.searchParams.set("id", donationId)
    if (!verified) {
      thankYouUrl.searchParams.set("error", "verification")
    }
    return NextResponse.redirect(thankYouUrl.toString())
  } catch (error) {
    console.error("Instamojo return handler error:", error)
    return NextResponse.redirect(`${siteUrl}/donate`)
  }
}
