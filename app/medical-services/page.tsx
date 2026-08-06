import { PageBanner } from "@/components/page-banner"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function MedicalPage() {
  return (
    <main className="min-h-screen pb-16 bg-gray-50">
      <PageBanner title="Medical Services" subtitle="Charitable Homeopathic Dispensary" />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-8">
          <div className="grid grid-cols-2 gap-4">
            <Image src="/assets/Medical-a397b286.webp" alt="Medical Services" fill className="w-full h-48 object-cover rounded-lg shadow-md" priority />
            <Image src="/assets/Medical2-08d303d4.webp" alt="Medical Services" fill className="w-full h-48 object-cover rounded-lg shadow-md" priority />
            <Image src="/assets/Medical3-6563eaf4.webp" alt="Medical Services" fill className="w-full h-48 object-cover rounded-lg shadow-md" priority />
            <Image src="/assets/PHOTO-2025-08-04-21-57-53-20108055.png" alt="Medical Camp" fill className="w-full h-48 object-cover rounded-lg shadow-md" priority />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Homeopathic Dispensary</h2>
            <p className="text-gray-700 leading-relaxed text-justify mb-4">
              Kallol also continues to serve the community through its charitable homeopathic dispensary, which operates
              three days a week, on Tuesdays, Thursdays, and Saturdays. Open to all, the dispensary provides free
              consultations and affordable medicines, guided by experienced practitioners committed to holistic healing.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              It remains a vital resource for many local residents seeking gentle, time-tested care in a trusted
              environment.
            </p>
            <div className="mt-6 bg-kallol-50 rounded-lg p-4 border border-kallol-100">
              <h4 className="font-semibold text-kallol-700 mb-2">Dispensary Hours</h4>
              <p className="text-gray-700 text-sm">Tuesdays, Thursdays &amp; Saturdays</p>
              <p className="text-gray-700 text-sm">Free consultations for all</p>
            </div>
          </div>
        </div>

        <Card className="border-gray-200">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Medical Camp at Kallol - March 2025</h3>
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
