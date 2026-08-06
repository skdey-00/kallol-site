import { PageBanner } from "@/components/page-banner"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DurgaPujaPage() {
  return (
    <main className="min-h-screen pb-16 bg-gray-50">
      <PageBanner title="Durga Puja 2025" subtitle="Dhunuchi Naach in Goregaon" />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
            <img src="/assets/image-7-279fa7e2.png" alt="Durga Puja 2025" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#44233b]">The Pinnacle of Bengali Celebration</h2>
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
            <h3 className="text-xl font-bold text-[#44233b] mb-6">Key Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-700 leading-relaxed mb-3">
                  For those unable to attend in person, Kallol extends its reach through a live telecast of the Durga
                  Puja events on its official website. Contributions to the Puja may be made online, where one may also
                  book specific rituals to be performed in their name and Gotra.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Special bhog packets can be collected from the Kallol campus between 1:00 PM and 3:00 PM.
                </p>
              </div>
              <div className="bg-kallol-50 rounded-lg p-6 border border-kallol-100">
                <h4 className="font-bold text-kallol-700 mb-3">Puja Schedule 2025</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Oct 1, 2025 (Wed):</strong> Maha Navami - Kumari Puja</p>
                  <p><strong>Oct 2, 2025 (Thu):</strong> Vijaya Dashami - Darpan Visarjan &amp; Sindur Utsav</p>
                </div>
                <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white mt-4 rounded-full text-sm">
                  <Link href="/donate">Book Puja Offerings</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-gradient-to-r from-kallol-50 to-gray-50">
          <CardContent className="p-8">
            <p className="text-center text-gray-700 text-lg italic">
              Kallol cordially invites you with your family and friends to participate in 2025 Durga Puja.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
