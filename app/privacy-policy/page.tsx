import { PageHeader } from "@/components/kallol/page-header"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Privacy Policy | Kallol",
  description: "How Kallol Kali Mandir collects, uses and protects your information across donations, bookings and this website.",
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen pb-16 bg-ivory">
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
      />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border-gray-200">
            <CardContent className="p-8 md:p-12 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-kallol-800 mb-3">Welcome</h2>
                <p className="text-gray-700 leading-relaxed text-justify">
                  Thank you for visiting our website. Your privacy is of utmost importance to us. To better protect
                  your privacy we provide this notice explaining our online information practices and the choices you
                  can make about the way your information is collected and used in our site.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-kallol-800 mb-3">Information Collection</h2>
                <p className="text-gray-700 leading-relaxed text-justify">
                  We, Kallol Mumbai, as a Charitable Trust shall be under no liability whatsoever in respect of any loss
                  or damage arising directly or indirectly out of the decline of authorization for any transaction, howsoever
                  caused. We collect only the information necessary to process your donations, puja bookings, and inquiries.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-kallol-800 mb-3">Use of Information</h2>
                <p className="text-gray-700 leading-relaxed text-justify">
                  The information you provide is used solely for the purpose of processing your requests, maintaining
                  records of donations and puja bookings, and communicating with you about our events and activities. We
                  do not sell, rent, or share your personal information with any third parties.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-kallol-800 mb-3">Data Security</h2>
                <p className="text-gray-700 leading-relaxed text-justify">
                  We are committed to ensuring that your information is secure. We use suitable physical, electronic, and
                  managerial procedures to safeguard and secure the information we collect online.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-kallol-800 mb-3">Contact Us</h2>
                <p className="text-gray-700 leading-relaxed text-justify">
                  If you have any questions about the security at our website, you can send an e-mail to
                  <strong> admin@kallolmumbai.com</strong> or <strong>info@kallolmumbai.com</strong>.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-gray-500 text-sm">This policy is effective as on date: 20.08.2025</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
