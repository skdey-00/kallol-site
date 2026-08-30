import Link from "next/link"
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ArrowRight,
  Landmark,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getDonationById } from "@/actions/donations"
import { ReceiptDownload } from "@/app/donate/thank-you/ReceiptDownload"

interface ThankYouPageProps {
  searchParams: Promise<{ id?: string; error?: string }>
}

/**
 * Order-received page for the Puja Offerings checkout. Shares the donations
 * storage/finalize pipeline, so orders land here via the same Instamojo return
 * redirect (checkout_kind = 'shop') or directly after a counter order.
 */
export default async function CheckoutThankYouPage({ searchParams }: ThankYouPageProps) {
  const { id, error } = await searchParams
  const order = id ? await getDonationById(id) : null

  if (!order) {
    return (
      <main className="min-h-screen pt-20 pb-16 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-lg">
          <Card className="border-gray-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
              <p className="text-gray-700 mb-6">
                We couldn&apos;t find this order. If you just made a payment, please check your email or try again in a
                moment.
              </p>
              <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white">
                <Link href="/shop">Back to Shop</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  const isCounter = order.paymentMethod === "counter"
  const isPending = order.status === "pending"
  const isFailure = order.status === "failure"

  return (
    <main className="min-h-screen pt-20 pb-16 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-lg">
        <Card className="border-gray-200 shadow-lg">
          <CardContent className="p-8 text-center">
            {isPending && isCounter ? (
              <>
                <Landmark className="h-16 w-16 mx-auto mb-4 text-kallol-700" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Received!</h1>
                <p className="text-gray-700 mb-2">
                  Thank you, {order.firstName}! Your order has been recorded. Please pay{" "}
                  <span className="font-bold text-kallol-700">
                    ₹{Number.parseFloat(order.totalAmount).toLocaleString("en-IN")}
                  </span>{" "}
                  at the Kallol counter to confirm it.
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  Quote your order ID <code className="font-mono">{order.id}</code> at the counter.
                </p>
                <Button asChild variant="outline" className="border-kallol-700 text-kallol-700 hover:bg-kallol-50">
                  <Link href="/shop">Back to Shop</Link>
                </Button>
              </>
            ) : isPending ? (
              <>
                <Clock className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Being Confirmed</h1>
                <p className="text-gray-700 mb-2">
                  {error === "verification"
                    ? "We couldn't verify your payment just now, but it may still have gone through."
                    : "We've received your order and are confirming your payment."}
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  This page updates once the payment is confirmed — try refreshing in a few moments. A receipt will be
                  available here after confirmation.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white">
                    <Link href={`/checkout/thank-you?id=${order.id}`}>Refresh Status</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-kallol-700 text-kallol-700 hover:bg-kallol-50">
                    <Link href="/shop">Back to Shop</Link>
                  </Button>
                </div>
              </>
            ) : isFailure ? (
              <>
                <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Unsuccessful</h1>
                <p className="text-gray-700 mb-6">
                  Unfortunately your online payment did not go through. No amount has been charged. You can try again or
                  choose to pay at the counter.
                </p>
                <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white">
                  <Link href="/shop">
                    Try Again
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-600" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You, {order.firstName}!</h1>
                <p className="text-lg text-gray-700 mb-6">
                  Your order of{" "}
                  <span className="font-bold text-kallol-700">
                    ₹{Number.parseFloat(order.totalAmount).toLocaleString("en-IN")}
                  </span>{" "}
                  was received successfully.
                </p>

                <div className="bg-green-50 border border-green-200 rounded-md p-4 text-left text-sm text-gray-700 mb-6 space-y-1">
                  <p>
                    <span className="font-medium">Name:</span> {order.firstName} {order.lastName}
                  </p>
                  <p>
                    <span className="font-medium">Payment Method:</span> {order.paymentMethod.toUpperCase()}
                  </p>
                  <p>
                    <span className="font-medium">Order ID:</span> <code className="font-mono">{order.id}</code>
                  </p>
                  {order.donationItems?.length > 0 && (
                    <p>
                      <span className="font-medium">Items:</span>{" "}
                      {order.donationItems
                        .map((item) => `${item.purpose}${item.quantity ? ` × ${item.quantity}` : ""}`)
                        .join(", ")}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-center gap-4">
                  <ReceiptDownload donationId={order.id} />
                  <Button asChild variant="outline" className="border-kallol-700 text-kallol-700 hover:bg-kallol-50">
                    <Link href="/">Return Home</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
