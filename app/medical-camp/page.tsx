import { PageBanner } from "@/components/page-banner"
import { Card, CardContent } from "@/components/ui/card"

export default function MedicalCampPage() {
  return (
    <main className="min-h-screen pb-16 bg-gray-50">
      <PageBanner title="Medical Camp" subtitle="Community Health Initiative (Archive)" />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <img src="/assets/PHOTO-2025-08-04-21-57-53-20108055.png" alt="Medical Camp" className="w-full rounded-lg shadow-lg" />
          <img src="/assets/PHOTO-2025-08-04-21-57-53-1-1-b22ff382.png" alt="Medical Camp" className="w-full rounded-lg shadow-lg" />
        </div>

        <Card className="border-gray-200">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-[#44233b] mb-6">Medical Camp at Kallol - March 2025</h2>
            <p className="text-gray-700 leading-relaxed text-justify mb-4">
              In line with its commitment to community well-being, Kallol organized a successful Medical Camp in March
              2025 at its premises in Goregaon. The camp provided free health check-ups, consultations, and basic
              diagnostics for individuals of all age groups.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              Staffed by a team of experienced doctors and healthcare professionals, the initiative was warmly received
              by the local community, benefiting hundreds of attendees. From blood pressure and blood sugar screenings to
              general wellness advice and preventive care, the camp reflected Kallol's holistic approach to social
              service, where culture, spirituality, and health go hand in hand.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
