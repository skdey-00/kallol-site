import { Fragment } from "react"
import { PageHeader } from "@/components/kallol/page-header"
import { getEvents } from "@/actions/events"
import type { CalendarEvent } from "@/lib/events-store"

export const metadata = {
  title: "Puja Calendar — All Events by Date | Kallol Kali Mandir",
  description:
    "The full schedule of pujas and events at Kallol Kali Mandir, Bangur Nagar, Goregaon West — every event, in date order.",
}

// ISR: refresh the table from the Google Calendar every 15 minutes
export const revalidate = 900

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const POSTER = "/assets/puja-calendar-2026.webp"

/** "2026-10-08" -> "Thu, 8 Oct 2026" (deterministic, UTC-anchored) */
function dateLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  const weekday = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
    weekday: "short",
    timeZone: "UTC",
  })
  return `${weekday}, ${d} ${MONTHS[m - 1].slice(0, 3)} ${y}`
}

/** "9:00 AM" -> 540, so same-day rows sort chronologically */
function timeMinutes(time: string): number {
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!match) return 24 * 60
  let hours = Number(match[1]) % 12
  if (match[3].toUpperCase() === "PM") hours += 12
  return hours * 60 + Number(match[2])
}

/** "2026-10-08" -> "October 2026" month divider label */
function monthLabel(iso: string): string {
  return `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`
}

/** Caption + full-size link, shared by the desktop figure and mobile disclosure */
function PosterFigure({ className }: { className?: string }) {
  return (
    <figure className={className}>
      <img
        src={POSTER}
        alt="Durgotsab 2026 — the published programme of pujas, day by day, from Sri Sri Durga Shashti to Annakoot"
        width={900}
        height={1600}
        loading="lazy"
        decoding="async"
        className="w-full rounded-lg border border-stone-line shadow-lg"
      />
      <figcaption className="img-caption mt-2 text-center">
        The published programme, Durgotsab 2026 (Bangabda 1433).{" "}
        <a
          href={POSTER}
          target="_blank"
          rel="noreferrer"
          className="link-editorial whitespace-nowrap text-kallol-700"
        >
          Open full size
        </a>
      </figcaption>
    </figure>
  )
}

export default async function CalendarPage() {
  const events = await getEvents()
  // Today-and-forward only, so past pujas never read as the current schedule
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date())
  const upcoming = events
    .filter((event) => event.date >= today)
    .sort((a, b) => (a.date !== b.date ? (a.date < b.date ? -1 : 1) : timeMinutes(a.time) - timeMinutes(b.time)))

  let lastMonth = ""

  // Summary line, derived from the store only — next event and month range
  const first = upcoming[0]
  const last = upcoming[upcoming.length - 1]
  const range =
    first && last && monthLabel(first.date) !== monthLabel(last.date)
      ? `${monthLabel(first.date)} – ${monthLabel(last.date)}`
      : first
        ? monthLabel(first.date)
        : ""

  return (
    <main className="min-h-screen pb-16 bg-ivory">
      <PageHeader
        title="Puja Calendar"
        intro="Every puja and event at Kallol Kali Mandir, in date order — published by the committee on the temple calendar."
        crumbs={[{ label: "Puja", href: "/upcoming-events" }]}
      />

      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* The committee's published programme card — above the table on md+
            (UX plan Phase 6: on mobile it moves below the schedule as a
            labelled secondary resource, so the structured dates read first) */}
        <PosterFigure className="mx-auto mb-16 hidden max-w-xl md:block" />

        {/* Every event, one row per date */}
        <section aria-labelledby="events-table-heading">
          <h2 id="events-table-heading" className="section-title mb-2">
            All events by date
          </h2>
          {upcoming.length > 0 && (
            <p className="mb-8 text-sm leading-relaxed text-ink-mute">
              Kallol Kali Mandir, Bangur Nagar, Goregaon West
              {range ? <> · {range}</> : null} · Next:{" "}
              <span className="font-semibold text-ink">
                {first.title}, {dateLabel(first.date)}
              </span>
            </p>
          )}
          {upcoming.length === 0 ? (
            <p className="text-ink-soft">No upcoming events have been published yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-stone-line">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-kallol-50 text-left">
                    <th scope="col" className="px-4 py-3 font-semibold text-ink uppercase tracking-caps text-caption">
                      Date
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-ink uppercase tracking-caps text-caption">
                      Event
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-ink uppercase tracking-caps text-caption">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {upcoming.map((event: CalendarEvent, index) => {
                    const month = monthLabel(event.date)
                    const showMonth = month !== lastMonth
                    lastMonth = month
                    return (
                      <Fragment key={event.id}>
                        {showMonth && (
                          <tr className="bg-ivory-sun">
                            <td colSpan={3} className="px-4 py-2 font-display font-semibold text-kallol-800">
                              {month}
                            </td>
                          </tr>
                        )}
                        <tr
                          className="border-t border-stone-line transition-colors hover:bg-kallol-50/40"
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-ink-soft align-top">
                            {dateLabel(event.date)}
                          </td>
                          <td className="px-4 py-3 text-ink align-top">{event.title}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-ink-soft align-top">{event.time}</td>
                        </tr>
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Mobile: the poster as a labelled secondary resource, collapsed so it
            never pushes the schedule down. No-JS safe: <details> works without
            hydration, and "Open full size" always reaches the full-resolution image. */}
        <details className="group mt-12 border-t border-stone-line pt-6 md:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold uppercase tracking-caps text-kallol-700 [&::-webkit-details-marker]:hidden">
            View full programme poster
            <span
              aria-hidden="true"
              className="text-lg transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <PosterFigure className="mt-6" />
        </details>
      </div>
    </main>
  )
}
