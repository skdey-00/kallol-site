import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import { Card, CardContent } from "@/components/ui/card"
import { getEvents } from "@/actions/events"

// Past-events archive. Sources only dated events already recorded in
// data/local-events.json (the committee-published calendar record) —
// nothing is invented here. Grouped by calendar year, newest first.

const CATEGORY_LABELS: Record<string, string> = {
  religious: "Puja",
  cultural: "Cultural",
  educational: "Educational",
  community: "Community",
  "member-meeting": "Member Meeting",
  "committee-meeting": "Committee Meeting",
}

export const metadata = {
  title: "Past Events & Archives | Kallol Kali Mandir, Goregaon",
  description:
    "Archive of past pujas, festivals and community events celebrated at Kallol Kali Mandir, Bangur Nagar, Goregaon West, Mumbai.",
}

export default async function ArchivesPage() {
  const allEvents = await getEvents()
  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const past = allEvents
    .filter((event) => new Date(event.date) < todayStart)
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  // Group by calendar year, newest year first
  const byYear = new Map<string, typeof past>()
  for (const event of past) {
    const year = event.date.slice(0, 4)
    if (!byYear.has(year)) byYear.set(year, [])
    byYear.get(year)!.push(event)
  }
  const years = [...byYear.keys()].sort((a, b) => (a < b ? 1 : -1))

  return (
    <main className="min-h-screen pb-16 bg-gray-50">
      <PageBanner
        title="Past Events & Archives"
        subtitle="A record of pujas, festivals and community celebrations at Kallol Kali Mandir"
      />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto mb-10">
          <p className="text-gray-700 leading-relaxed text-justify">
            Kallol has been celebrating Bengali festivals and serving the community for decades. This
            page preserves the record of our past pujas and events, drawn from the calendars
            published by the committee. For what is coming up next, see the{" "}
            <Link href="/calendar" className="text-kallol-700 font-medium hover:underline">
              Puja Calendar
            </Link>{" "}
            and{" "}
            <Link href="/upcoming-events" className="text-kallol-700 font-medium hover:underline">
              Upcoming Events
            </Link>
            .
          </p>
        </div>

        {years.length === 0 && (
          <Card className="border-gray-200 max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <p className="text-gray-700">No past events have been recorded yet.</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-12">
          {years.map((year) => (
            <section key={year}>
              <h2 className="text-2xl md:text-3xl font-bold text-[#44233b] mb-6">{year}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {byYear.get(year)!.map((event) => (
                  <Card key={event.id} className="border-gray-200 flex flex-col">
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-kallol-700">{event.date}</span>
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 capitalize">
                          {CATEGORY_LABELS[event.category] ?? event.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-700 text-sm flex-grow">{event.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Historical highlights already preserved as dedicated pages */}
        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-[#44233b] mb-6">
            Historical <span className="text-kallol-700">Highlights</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/medical-camp" className="group">
              <Card className="border-gray-200 overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <span className="text-sm font-medium text-kallol-700">2025</span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-kallol-700 transition-colors">
                    Free Medical Camp
                  </h3>
                  <p className="text-gray-700 text-sm">
                    A community health initiative held at the Kallol campus — preserved here as a
                    record of Kallol&apos;s service to the neighbourhood.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <span className="text-sm font-medium text-kallol-700">[VERIFY WITH KALLOL]</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Earlier Years</h3>
                <p className="text-gray-700 text-sm">
                  Records of previous years&apos; Durga Puja, Kali Puja and cultural programmes
                  [CONTENT REQUIRED — photographs, dates and programme details from the committee
                  archives].
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}
