import { PageBanner } from "@/components/page-banner"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function KaliPujaPage() {
  return (
    <main className="min-h-screen pb-16 bg-gray-50">
      <PageBanner title="Kali Puja 2025" subtitle="Divine Mother Who Destroys Evil" />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
            <Image src="/assets/Frame-150-9cd8eeb5.png" alt="Kali Puja 2025" fill className="w-full h-full object-cover" priority />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Mahakali Puja: Invoking the Fierce Divine Mother</h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              The Mahakali Puja, held annually with deep reverence and grandeur, is a powerful celebration of Maa Kali,
              the fierce and compassionate manifestation of the Divine Mother who destroys evil and protects her
              devotees. The ritual is marked by intricate offerings, intense spiritual energy, and collective devotion.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              The temple resonates with the sacred chants, rhythms of the dhaak, and the fragrance of incense, creating
              an atmosphere that is both transformative and deeply grounding. Devotees participate in special Puja
              rituals, offer Anna Bhog, and engage in Aarti, seeking protection, liberation from fear, and inner
              strength from the Divine Mother.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              The celebration is open to all, with facilities for online booking of special offerings and rituals.
            </p>
          </div>
        </div>

        <Card className="border-gray-200 mb-8">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Mahakali Puja Schedule</h3>
            <div className="bg-kallol-50 rounded-lg p-6 border border-kallol-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-kallol-200">
                    <th className="text-left py-2 text-kallol-700">Date</th>
                    <th className="text-left py-2 text-kallol-700">Day</th>
                    <th className="text-left py-2 text-kallol-700">Events &amp; Timings</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-100">
                    <td className="py-3">Oct 20, 2025</td>
                    <td className="py-3">Monday</td>
                    <td className="py-3">
                      <div>Maha Kali Puja - 11:00 PM</div>
                      <div>Bhog Nivedan and Aarti - 01:00 AM</div>
                      <div>Pushpanjali - 01:30 AM</div>
                      <div>Bhog Prasad distribution - 01:30 AM</div>
                      <div>Hom - 02:00 AM</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white mt-6 rounded-full">
              <Link href="/donate">Book Puja Offerings</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-gradient-to-r from-kallol-50 to-gray-50">
          <CardContent className="p-8">
            <p className="text-center text-gray-700 text-lg italic">
              Kallol cordially invites you with your family and friends to participate in 2025 Mahakali Puja.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
