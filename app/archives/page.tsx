import Link from "next/link"
import { PageHeader } from "@/components/kallol/page-header"
import { ArchiveList } from "@/components/kallol/archive-list"
import type { ArchiveEntry } from "@/components/kallol/archive-list"
import { eventHref } from "@/components/kallol/event-view"
import { getEvents } from "@/actions/events"

// Past-events archive. Sources only dated events already recorded in
// data/local-events.json (the committee-published calendar record) —
// nothing is invented here. Grouped by calendar year, newest first,
// rendered with the Phase 6 archive system (ruled rows, serif year).

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

  const groups = years.map((year) => ({
    year,
    events: byYear.get(year)!.map<ArchiveEntry>((event) => ({
      id: event.id,
      title: event.title,
      date: event.date,
      category: event.category,
      href: eventHref(event.title),
    })),
  }))

  return (
    <main className="min-h-screen pb-16 bg-ivory">
      <PageHeader
        eyebrow="Puja"
        title="Past Events & Archives"
        intro="A record of pujas, festivals and community celebrations at Kallol Kali Mandir — the community's history, kept by the calendars the committee published."
        crumbs={[{ label: "Puja", href: "/upcoming-events" }]}
      />

      <div className="container py-12 md:py-16">
        {groups.length > 0 ? (
          <ArchiveList groups={groups} />
        ) : (
          <div className="max-w-2xl">
            <p className="text-ink-soft leading-relaxed">
              No past events have been recorded yet. Pujas and observances are
              added to the calendar as the committee announces them — see the{" "}
              <Link href="/calendar" className="link-editorial text-kallol-700">
                Puja Calendar
              </Link>{" "}
              for what is coming up.
            </p>
          </div>
        )}

        {/* Cross-navigation — where the record continues */}
        <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-stone-line pt-8">
          <Link
            href="/calendar"
            className="link-editorial text-sm font-semibold text-kallol-700 hover:text-kallol-800"
          >
            Puja calendar
          </Link>
          <Link
            href="/upcoming-events"
            className="link-editorial text-sm font-semibold text-kallol-700 hover:text-kallol-800"
          >
            Upcoming events
          </Link>
          <Link
            href="/photos"
            className="link-editorial text-sm font-semibold text-kallol-700 hover:text-kallol-800"
          >
            Photographs
          </Link>
        </div>

        {/* Historical highlights already preserved as dedicated pages */}
        <section className="mt-16">
          <h2 className="section-eyebrow">Preserved in full</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Link
              href="/medical-camp"
              className="group card-kallol p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-600 focus-visible:ring-offset-4 focus-visible:ring-offset-ivory"
            >
              <span className="meta-label text-kallol-700">2025 · Community</span>
              <h3 className="mt-2 font-display text-h3 text-ink transition-colors group-hover:text-kallol-700">
                Free Medical Camp
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                A community health initiative held at the Kallol campus —
                preserved here as a record of Kallol&rsquo;s service to the
                neighbourhood.
              </p>
            </Link>
            <div className="card-kallol p-6">
              <span className="meta-label">[VERIFY WITH KALLOL]</span>
              <h3 className="mt-2 font-display text-h3 text-ink">Earlier Years</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Records of previous years&rsquo; Durga Puja, Kali Puja and
                cultural programmes [CONTENT REQUIRED — photographs, dates and
                programme details from the committee archives].
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
