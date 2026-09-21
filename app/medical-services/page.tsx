import Link from "next/link"
import { PageHeader } from "@/components/kallol/page-header"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Homeopathy Dispensary, Free Medical Services | Kallol",
  description: "Free consultations and affordable homeopathic medicines three days a week at Kallol's charitable dispensary in Goregaon West, Mumbai.",
}

export default function MedicalPage() {
  return (
    <main className="min-h-screen pb-16 bg-ivory">
      <PageHeader
        eyebrow="Community"
        title="Medical Services"
        intro="Charitable Homeopathic Dispensary"
        crumbs={[{ label: "Community", href: "/facilities-services" }]}
      />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-8">
          <div className="grid grid-cols-2 gap-4">
            <img src="/assets/Medical-a397b286.webp" alt="Medical Services" className="w-full h-48 object-cover rounded-lg shadow-md" />
            <img src="/assets/Medical2-08d303d4.webp" alt="Medical Services" className="w-full h-48 object-cover rounded-lg shadow-md" />
            <img src="/assets/Medical3-6563eaf4.webp" alt="Medical Services" className="w-full h-48 object-cover rounded-lg shadow-md" />
            <img src="/assets/PHOTO-2025-08-04-21-57-53-20108055.webp" alt="Medical Camp" className="w-full h-48 object-cover rounded-lg shadow-md" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-kallol-800 mb-6">Homeopathic Dispensary</h2>
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
            <h3 className="text-xl font-bold text-kallol-800 mb-4">Medical Camp at Kallol, Past Initiative (Archive)</h3>
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

        <p className="text-gray-700 mt-8 text-sm">
          Also part of Kallol&apos;s community services:{" "}
          <Link href="/library-services" className="text-kallol-700 font-medium hover:underline">
            Library
          </Link>
          {" · "}
          <Link href="/facilities-services" className="text-kallol-700 font-medium hover:underline">
            Facilities &amp; Services
          </Link>
          {" · "}
          <Link href="/medical-camp" className="text-kallol-700 font-medium hover:underline">
            Medical Camp 2025 (archive)
          </Link>
        </p>
      </div>
    </main>
  )
}
