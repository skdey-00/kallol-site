import { PageHeader } from "@/components/kallol/page-header"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Lakshmi Puja — Kojagari Purnima | Kallol Kali Mandir",
  description: "Kojagari Purnima Lakshmi Puja at Kallol Kali Mandir, Goregaon West — the full-moon worship of Maa Lakshmi.",
}

export default function LakshmiPujaPage() {
  return (
    <main className="min-h-screen pb-16 bg-ivory">
      <PageHeader
        eyebrow="Puja"
        title="Lakshmi Puja"
        intro="Illumination & Prosperity Unfold"
        crumbs={[{ label: "Puja", href: "/upcoming-events" }]}
      />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
            <img src="/assets/lakshmipuja-473705d3.webp" alt="Lakshmi Puja at Kallol" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#44233b]">Invoking the Goddess of Prosperity</h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              As twilight descends and homes are lit with shimmering lamps, the spirit of Lakshmi Puja graces Kallol
              with devotion, light, and serenity. Celebrated with reverence and grandeur, Lakshmi Puja at Kallol is an
              integral part of the festive calendar, drawing devotees to honour Maa Lakshmi, the goddess of wealth,
              wisdom, and well-being.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              Observed during the sacred night of Kojagari Purnima or Diwali, the Puja is performed to seek blessings
              for abundance, harmony, and spiritual prosperity in both home and heart. At Kallol, the evening becomes a
              luminous convergence of tradition and togetherness.
            </p>
          </div>
        </div>

        <Card className="border-gray-200 mb-8">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-[#44233b] mb-6">Kojagari Lakshmi Puja Schedule</h3>
            <div className="bg-kallol-50 rounded-lg p-6 border border-kallol-100">
              <p className="text-gray-700 text-sm mb-4">
                <strong>Upcoming:</strong> Sunday, October 25, 2026 (Kojagari Purnima, 7 Kartik)
              </p>
              <table className="w-full text-sm">
                <caption className="text-left text-xs text-gray-500 pb-2">
                  Ritual timings as observed on Kojagari Purnima (subject to confirmation on the day)
                </caption>
                <thead>
                  <tr className="border-b border-kallol-200">
                    <th className="text-left py-2 text-kallol-700">Day</th>
                    <th className="text-left py-2 text-kallol-700">Events &amp; Timings</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr>
                    <td className="py-3">Sunday</td>
                    <td className="py-3">
                      <div>Lakshmi Puja - 08:00 PM</div>
                      <div>Pushpanjali - 09:00 PM</div>
                      <div>Bhog Nibedan and Aarti - 09:30 PM</div>
                      <div>Bhog Prasad distribution - 10:00 PM</div>
                      <div>Hom - 10:30 PM</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white mt-6 rounded-full">
              <Link href="/donate/lakshmi-puja">Book Puja Offerings</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="border-gray-200">
            <CardContent className="p-8">
              <h3 className="text-lg font-bold text-[#44233b] mb-4">What Makes Lakshmi Puja at Kallol Unique</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2"><span className="text-kallol-700 mt-1">&#10022;</span> Rituals steeped in Bengali tradition, conducted with purity and precision</li>
                <li className="flex items-start gap-2"><span className="text-kallol-700 mt-1">&#10022;</span> A beautifully adorned altar radiating divine grace and serenity</li>
                <li className="flex items-start gap-2"><span className="text-kallol-700 mt-1">&#10022;</span> Collective chanting, aarti, and offerings that invoke spiritual abundance</li>
                <li className="flex items-start gap-2"><span className="text-kallol-700 mt-1">&#10022;</span> Participation by families and children, keeping age-old traditions alive</li>
                <li className="flex items-start gap-2"><span className="text-kallol-700 mt-1">&#10022;</span> Traditional bhog distributed among devotees with love and gratitude</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-8">
              <h3 className="text-lg font-bold text-[#44233b] mb-4">Be a Part of the Celebration</h3>
              <ul className="space-y-2 text-gray-700 text-sm mb-4">
                <li className="flex items-start gap-2"><span className="text-kallol-700 mt-1">&#10022;</span> Book special Lakshmi Puja offerings online</li>
                <li className="flex items-start gap-2"><span className="text-kallol-700 mt-1">&#10022;</span> Offer bhog or Anna Seva in their name and Gotra</li>
                <li className="flex items-start gap-2"><span className="text-kallol-700 mt-1">&#10022;</span> Join the community celebration at the Kallol campus</li>
                <li className="flex items-start gap-2"><span className="text-kallol-700 mt-1">&#10022;</span> Watch the live telecast from the comfort of home</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="border-gray-200 bg-gradient-to-r from-kallol-50 to-gray-50">
          <CardContent className="p-8 text-center">
            <p className="text-gray-700 text-lg italic">
              May Maa Lakshmi bless you with light, love, and prosperity. Join us this Lakshmi Puja at Kallol, where
              devotion meets divinity.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
