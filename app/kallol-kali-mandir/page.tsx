import { PageHeader } from "@/components/kallol/page-header"
import { NextAmavasyaDate } from "@/components/kallol/next-amavasya-date"
import { nextAmavasyaEvent } from "@/components/kallol/event-view"
import { getEvents } from "@/actions/events"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Kallol Kali Mandir — Timings, Offerings & Online Puja Booking | Kallol",
  description: "Daily darshan timings, aarti schedule, offering rates and online puja booking for the Kallol Kali Mandir, Bangur Nagar, Goregaon West, Mumbai.",
}

export default async function KaliMandirPage() {
  const events = await getEvents()
  const nextAmavasya = nextAmavasyaEvent(events)

  return (
    <main className="min-h-screen pb-16 bg-ivory">
      <PageHeader
        eyebrow="About"
        title="Kallol Kali Mandir"
        intro="A Sacred Abode of Shakti in the Heart of Goregaon"
        crumbs={[{ label: "About", href: "/about" }]}
      />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
            <img src="/assets/5B8A0782-1-2a544d2e.webp" alt="Kallol Kali Mandir" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#44233b]">A Sacred Abode of Shakti</h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              At the soul of Kallol lies its most revered sanctum, the Kallol Kali Mandir. Dedicated to Maa Kali, the
              divine embodiment of strength, transformation, and protection, this temple is a spiritual nucleus for the
              Bengali and Hindu community in and around Goregaon. Established with the collective devotion of Kallol's
              founding members, the temple has grown into a space of unwavering faith, soulful worship, and community
              bonding.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              Every week, thousands of devotees gather here to seek the blessings of Maa Kali, drawn by the sanctity of
              the space and the powerful spiritual energy that resides within its walls.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="border-gray-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-[#44233b] mb-4">Amavasya Puja - A Divine Gathering</h3>
              <p className="text-gray-700 leading-relaxed">
                One of the temple's most significant observances is the monthly Amavasya Puja, held on every new moon
                night. This sacred evening draws large congregations of devotees who come to offer their prayers,
                experience the divine aarti, and partake in the traditional Khichdi Bhog served with love and reverence.
                The atmosphere is charged with devotion, chants, incense, and the quiet strength of collective faith.
              </p>
              <div className="mt-6">
                <NextAmavasyaDate target={nextAmavasya} variant="panel" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-[#44233b] mb-4">Daily Offerings &amp; Online Puja Booking</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Kali Mandir remains open for worship throughout the week. Devotees can:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start gap-2"><span className="text-kallol-700 mt-1">&#10022;</span> Offer daily special Puja in their name and Gotra</li>
                <li className="flex items-start gap-2"><span className="text-kallol-700 mt-1">&#10022;</span> Contribute Anna Bhog for the community</li>
                <li className="flex items-start gap-2"><span className="text-kallol-700 mt-1">&#10022;</span> Book rituals online via our website from anywhere in the world</li>
              </ul>
              <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white mt-6 rounded-full">
                <Link href="/donate">Donate Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-gray-200 mb-12">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-[#44233b] mb-6">Mandir Timings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-kallol-50 rounded-lg p-6 border border-kallol-100">
                <h4 className="font-bold text-kallol-700 mb-3">Morning</h4>
                <p className="text-gray-700 text-sm">6:00 AM to 12:30 PM</p>
                <p className="text-gray-500 text-xs mt-1">(Mon, Wed, Thu &amp; Fri)</p>
                <p className="text-gray-700 text-sm mt-3">6:00 AM to 1:00 PM</p>
                <p className="text-gray-500 text-xs mt-1">(Tue, Sat &amp; Sun)</p>
              </div>
              <div className="bg-kallol-50 rounded-lg p-6 border border-kallol-100">
                <h4 className="font-bold text-kallol-700 mb-3">Evening</h4>
                <p className="text-gray-700 text-sm">5:00 PM to 9:00 PM</p>
                <p className="text-gray-500 text-xs mt-1">(Mon, Wed, Thu &amp; Fri)</p>
                <p className="text-gray-700 text-sm mt-3">5:00 PM to 9:30 PM</p>
                <p className="text-gray-500 text-xs mt-1">(Tue, Sat &amp; Sun)</p>
              </div>
              <div className="bg-kallol-50 rounded-lg p-6 border border-kallol-100">
                <h4 className="font-bold text-kallol-700 mb-3">Aarti</h4>
                <p className="text-gray-700 text-sm">7:30 PM</p>
                <p className="text-gray-500 text-xs mt-1">(1st Apr to 30th Sep)</p>
                <p className="text-gray-700 text-sm mt-3">7:00 PM</p>
                <p className="text-gray-500 text-xs mt-1">(1st Oct to 31st Mar)</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              During Ambubachi (Jun 22 - 26, 2027), Maa Kali&apos;s idol remains covered; the Mandir stays open as per
              timings above.
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 mb-12">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-[#44233b] mb-2">Offerings Invited</h3>
            <p className="text-gray-500 text-xs mb-6">Effective 1st April 2026 to 31st March 2027</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-kallol-200">
                    <th className="text-left py-2 text-kallol-700">Offering</th>
                    <th className="text-right py-2 text-kallol-700">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {[
                    ["Flower Decoration (Interior part only)", "Rs. 3,000/-"],
                    ["Flower Decoration (Entire Mandir)", "Rs. 5,000/-"],
                    ["Water offering (Jal-Daan) on Community feeding days", "Rs. 7,000/-"],
                    ["Amavasya Special Puja", "Rs. 500/-"],
                    ["Anna Bhog (Daily offerings)", "Rs. 1,000/-"],
                    ["Amavasya General Bhog (Bhandara)", "Rs. 35,000/-"],
                    ["Shree Shree Shanidev Puja", "Rs. 5,000/-"],
                    ["Saree Offering for Maa Kali (except Durga Pujas & Kali Puja)", "Rs. 10,000/-"],
                  ].map(([offering, amount]) => (
                    <tr key={offering} className="border-b border-gray-100">
                      <td className="py-2.5">{offering}</td>
                      <td className="py-2.5 text-right font-medium whitespace-nowrap">{amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="text-gray-600 text-xs space-y-1 mt-4">
              <li>&#10022; Please provide Name/s &amp; Gotra along with offering.</li>
              <li>&#10022; Saree offerings for draping Maa Kali may be booked (subject to availability).</li>
              <li>&#10022; Saree offerings for special occasions will be as publicised from time to time.</li>
            </ul>
            <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white mt-6 rounded-full text-sm">
              <Link href="/donate">Book Offerings Online</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-gradient-to-r from-kallol-50 to-gray-50">
          <CardContent className="p-8 md:p-12">
            <h3 className="text-2xl font-bold text-[#44233b] mb-6 text-center">Why Kallol Kali Mandir is Special</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "A deeply revered temple, rooted in Bengali tradition",
                "Monthly Amavasya celebrations with large participation",
                "Open to all faith-seekers, every day of the week",
                "Seamless online booking for Puja and Bhog",
                "A space for peace, prayer, and spiritual renewal",
                "Daily Anna Bhog and special Puja offerings",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-kallol-700 text-xl mt-0.5">&#10022;</span>
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-700 mt-8 text-lg italic">
              Whether you seek solace, strength, or spiritual connection, Kallol Kali Mandir welcomes you with open
              arms, not just as a place of worship, but as a sanctuary of the Divine Mother's love.
            </p>
            <p className="text-center text-[#44233b] font-semibold mt-4">Visit. Worship. Belong.</p>
            <p className="text-center text-gray-500 mt-2">Located within the Kallol campus, Goregaon</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
