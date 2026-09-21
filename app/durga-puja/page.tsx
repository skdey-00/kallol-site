import { PageHeader } from "@/components/kallol/page-header"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Durga Puja in Goregaon West, Maha Sashti to Vijaya Dashami | Kallol",
  description: "Kallol's Durga Puja: six days of dhaak, dhunuchi naach, Sandhi Puja and Khichdi Bhog at Bangur Nagar, Goregaon West, Mumbai.",
}

export default function DurgaPujaPage() {
  return (
    <main className="min-h-screen pb-16 bg-ivory">
      <PageHeader
        eyebrow="Puja"
        title="Durga Puja"
        intro="Dhunuchi Naach in Goregaon"
        crumbs={[{ label: "Puja", href: "/upcoming-events" }]}
      />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
          <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ aspectRatio: "637 / 741" }}>
            <img
              src="/assets/durgotsab-2026-schedule.webp"
              alt="Durgotsab 2026 — the full six-day programme, Friday 16 to Wednesday 21 October 2026"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-kallol-800">The Pinnacle of Bengali Celebration</h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              Durga Puja marks the pinnacle of spiritual and cultural celebration for the Bengali community, a radiant
              festival that epitomizes the triumph of good over evil and ushers in a season of joy and unity. The
              evocative rhythm of the dhaak, the sacred resonance of the shankha and ghanta, and the heady aroma of
              dhunuchi incense herald the arrival of Maa Durga, drawing the community together in reverence and
              festivity, no matter how far they may be.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              Kallol's annual Durga Puja celebration is held with great devotion and splendor at its campus, creating a
              sacred space for prayer, reflection, and togetherness. Devotees are invited to offer their Puja, relish
              the traditional Khichdi Bhog, mingle with loved ones amidst a vibrant array of food stalls, and witness
              the enchanting Dhunuchi Naach performed daily during the festivities.
            </p>
          </div>
        </div>

        <Card className="border-gray-200 mb-8">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-kallol-800 mb-6">Key Information</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              For those unable to attend in person, Kallol extends its reach through a live telecast of the Durga
              Puja events on its official website. Contributions to the Puja may be made online, where one may also
              book specific rituals to be performed in their name and Gotra.
            </p>
            <p className="text-gray-700 leading-relaxed mb-5">
              Special bhog may be collected from the Kallol grounds between 1:00 PM and 3:00 PM. The full day-by-day
              programme is on the <Link href="/calendar" className="link-editorial text-kallol-700">Puja Calendar</Link>.
            </p>
            <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white rounded-full text-sm">
              <Link href="/donate/durga-puja">Book Puja Offerings</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-gradient-to-r from-kallol-50 to-gray-50">
          <CardContent className="p-8">
            <p className="text-center text-gray-700 text-lg italic">
              Kallol cordially invites you with your family and friends to participate in the annual Durga Puja
              celebrations from October 16 to October 21.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
