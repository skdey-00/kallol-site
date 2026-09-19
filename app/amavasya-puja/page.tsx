import { PageHeader } from "@/components/kallol/page-header"
import { NextAmavasyaDate } from "@/components/kallol/next-amavasya-date"
import { nextAmavasyaEvent } from "@/components/kallol/event-view"
import { getEvents } from "@/actions/events"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Amavasya Puja — Monthly New Moon Puja | Kallol Kali Mandir",
  description:
    "Monthly Amavasya Puja at Kallol Kali Mandir, Bangur Nagar — every new moon night, with Khichdi Bhog. See the date of the next Amavasya Puja.",
}

export default async function AmavasyaPujaPage() {
  const events = await getEvents()
  const next = nextAmavasyaEvent(events)

  return (
    <main className="min-h-screen pb-16 bg-ivory">
      <PageHeader
        eyebrow="Puja & Events"
        title="Amavasya Puja"
        intro="New Moon Devotion & Khichdi Bhog"
        crumbs={[{ label: "Puja & Events", href: "/upcoming-events" }]}
      />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
            <img src="/assets/Amabasya_Puja-80fa0792.png" alt="Amavasya Puja at Kallol Kali Mandir" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#44233b]">Amavasya Puja - A Divine Gathering</h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              One of the temple's most significant observances is the monthly Amavasya Puja, held on every new moon
              night. This sacred evening draws large congregations of devotees who come to offer their prayers,
              experience the divine aarti, and partake in the traditional Khichdi Bhog served with love and reverence.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              The atmosphere is charged with devotion, chants, incense, and the quiet strength of collective faith. The
              Amavasya Puja is a deeply spiritual experience that connects devotees to the Divine Mother in a profound
              and personal way.
            </p>
            <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white rounded-full">
              <Link href="/donate">View Puja Offerings</Link>
            </Button>
          </div>
        </div>

        <NextAmavasyaDate target={next} variant="band" className="mb-12" />

        <Card className="border-gray-200 bg-gradient-to-r from-kallol-50 to-gray-50">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-[#44233b] mb-6 text-center">What Makes Amavasya Puja Special</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Monthly observance on every new moon night",
                "Traditional Khichdi Bhog distribution",
                "Large congregation of devotees",
                "Divine aarti and sacred chants",
                "Open to all faith-seekers",
                "Online booking for special offerings",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-kallol-700 text-xl mt-0.5">&#10022;</span>
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
