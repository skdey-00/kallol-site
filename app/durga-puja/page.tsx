import { PageHeader } from "@/components/kallol/page-header"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Durga Puja in Goregaon West — Maha Sashti to Vijaya Dashami | Kallol",
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
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
            <img src="/assets/image-7-279fa7e2.webp" alt="Durga Puja at Kallol" className="w-full h-full object-cover" />
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
                  Special bhog may be collected from the Kallol grounds between 1:00 PM and 3:00 PM.
                </p>
              </div>
              <div className="bg-kallol-50 rounded-lg p-6 border border-kallol-100">
                <h4 className="font-bold text-kallol-700 mb-1">Puja Schedule 2026</h4>
                <p className="text-xs text-kallol-700 italic mb-4">Durgotsab 2026 — Debir Ghotoke Agaman, Debir Noukaye Gaman</p>
                <div className="space-y-4 text-sm text-gray-700">
                  <div>
                    <p className="font-bold text-[#44233b]">Sri Sri Durga Shashti — Friday, 16th Oct 2026 (28th Ashwin)</p>
                    <p>Kalparambh &amp; Shashti Puja 10:00 AM · Bodhon, Amantran &amp; Adhibash 6:00 PM · Agomoni Sangeet 8:00 PM</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#44233b]">Saptami — Saturday, 17th Oct 2026 (29th Ashwin)</p>
                    <p>Nabapatrika Prabesh 7:00 AM · Saptami Puja 8:00 AM · Pushpanjali 10:30 AM · Bhog Nibedan &amp; Aarti 11:30 AM · Bhog Prasad 1:00 PM · Sandhya Aarti 8:00 PM</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#44233b]">Maha Ashtami — Sunday, 18th Oct 2026 (30th Ashwin)</p>
                    <p>Ashtami Puja 9:00 AM · Pushpanjali 10:30 AM · Bhog Nibedan &amp; Aarti 11:30 AM · Bhog Prasad 1:00 PM · Sandhya Aarti 8:00 PM</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#44233b]">Maha Ashtami (Adhik Diba) — Monday, 19th Oct 2026 (1st Kartik)</p>
                    <p>Sandhi Puja 7:26 AM – 8:14 AM · Ashtami Adhik Puja 9:00 AM · Pushpanjali 10:30 AM · Bhog Nibedan &amp; Aarti 11:30 AM · Bhog Prasad 1:00 PM · Sandhya Aarti 8:00 PM</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#44233b]">Maha Nabami — Tuesday, 20th Oct 2026 (2nd Kartik)</p>
                    <p>Nabami Puja 7:00 AM · Kumari Puja 8:00 AM · Pushpanjali 9:00 AM · Bhog Nibedan &amp; Aarti 9:30 AM · Bhog Prasad 1:00 PM · Hom 2:00 PM · Sandhya Aarti 8:00 PM</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#44233b]">Dashami — Wednesday, 21st Oct 2026 (3rd Kartik)</p>
                    <p>Dashami Puja 9:00 AM · Pushpanjali 10:00 AM · Darpan Bisarjan 10:30 AM · Sindoor Utsab 11:45 AM · Kanakanjali 4:00 PM · Bisarjan Procession 5:00 PM · Shantijal &amp; Bijoya Sammelan 10:00 PM</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  As per the Calendar of Events, Bengali Year (Bangabda) 1433.
                </p>
                <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white mt-4 rounded-full text-sm">
                  <Link href="/donate/durga-puja">Book Puja Offerings</Link>
                </Button>
              </div>
            </div>
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
