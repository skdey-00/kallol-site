import { PageHeader } from "@/components/kallol/page-header"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Facilities & Hall Booking | Kallol, Goregaon West",
  description: "Book Kallol's air-conditioned conference hall and campus for family functions, seminars and events in Goregaon West, Mumbai.",
}

export default function FacilitiesPage() {
  return (
    <main className="min-h-screen pb-16 bg-ivory">
      <PageHeader
        eyebrow="Community"
        title="Facilities & Services"
      />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-6 mb-12">
          <p className="text-gray-700 leading-relaxed text-lg text-justify">
            Kallol has a large campus and supporting facilities to organize any family event, other functions or even
            small conference (conference hall) with seating capacity for ~35 people. These facilities are available for
            booking at moderate charges for specific periods or for specific days. The donation paid for such booking
            goes to temple maintenance &amp; other social activities.
          </p>
          <p className="text-gray-700 leading-relaxed text-justify">
            For booking enquiry and T&amp;C for usage, please contact <strong>+91-8655852917</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-gray-200 overflow-hidden">
            <div className="relative h-56">
              <img src="/assets/Conference-Hall-6ce31122.jpg" alt="Kallol Conference Hall" className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-[#44233b] mb-4">Kallol Conference Hall</h3>
              <p className="text-gray-700 leading-relaxed">
                Air-conditioned conference hall with the capacity of up to 35 people. Suitable for conferences, seminars,
                events, family functions, etc. Kallol charges a moderate donation based on the duration of booking.
              </p>
              <p className="text-gray-600 mt-4 text-sm">
                For more details contact us on <strong>info@kallolmumbai.com</strong> or on the contact number mentioned.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 overflow-hidden">
            <div className="relative h-56">
              <img src="/assets/Kallol-Facility-2-a121bd7f.png" alt="Kallol Campus" className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-[#44233b] mb-4">Kallol Campus</h3>
              <p className="text-gray-700 leading-relaxed">
                Kallol has a large campus and offers its campus on rent for functions, seminars, events, etc. The campus
                is available for booking at moderate charges.
              </p>
              <p className="text-gray-600 mt-4 text-sm">
                For more details and T&amp;C, please contact us at <strong>+91-8655852917</strong>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
