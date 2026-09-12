import Link from "next/link"
import type { EventView } from "./types"

/**
 * "Now at Kallol" — the current-activity band directly under the hero.
 * Server-rendered from the events store: next dated event as the anchor
 * + up to three following events as a quiet list. If no upcoming events
 * exist, a calendar link keeps the band useful without inventing activity.
 */
export function NowAtKallol({
  next,
  upcoming,
}: {
  next: EventView | null
  upcoming: EventView[]
}) {
  return (
    <section
      aria-labelledby="now-heading"
      className="border-y border-stone-line bg-ivory-sun"
    >
      <div className="container py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Next event — the anchor of the band */}
          <div className="lg:col-span-5">
            <p className="section-eyebrow">Now at Kallol</p>
            <h2 id="now-heading" className="section-title mt-3">
              {next ? "Coming up next" : "The year at Kallol"}
            </h2>
            {next ? (
              <div className="mt-6">
                <p className="flex items-baseline gap-3">
                  <span className="font-display text-4xl leading-none text-kallol-600">
                    {next.dateLabel.split(" ")[0]}
                  </span>
                  <span className="text-caption uppercase tracking-caps text-ink-mute">
                    {next.dateLabel.split(" ").slice(1).join(" ")}
                  </span>
                </p>
                <h3 className="mt-4 font-display text-h3 text-ink">
                  <Link
                    href={next.href}
                    className="hover:text-kallol-700 transition-colors"
                  >
                    {next.title}
                  </Link>
                </h3>
                {next.time && (
                  <p className="mt-2 text-sm text-ink-soft">{next.time}</p>
                )}
                {next.location && (
                  <p className="mt-1 text-sm text-ink-mute">{next.location}</p>
                )}
              </div>
            ) : (
              <p className="mt-6 leading-relaxed text-ink-soft">
                Pujas and observances are added to the calendar as the
                committee announces them. See the full picture on the{" "}
                <Link
                  href="/calendar"
                  className="text-kallol-700 underline underline-offset-4 hover:text-kallol-800"
                >
                  Puja Calendar
                </Link>
                .
              </p>
            )}
          </div>

          {/* Following events */}
          <div className="lg:col-span-7 lg:border-l lg:border-stone-line lg:pl-12">
            {upcoming.length > 0 ? (
              <ul className="divide-y divide-stone-line">
                {upcoming.map((event) => (
                  <li key={event.id}>
                    <Link
                      href={event.href}
                      className="group flex items-baseline justify-between gap-6 py-4 first:pt-0"
                    >
                      <span className="text-sm font-medium text-ink group-hover:text-kallol-700 transition-colors">
                        {event.title}
                      </span>
                      <span className="whitespace-nowrap text-caption uppercase tracking-caps text-ink-mute group-hover:text-kallol-700 transition-colors">
                        {event.dateLabel}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-mute">
                No further dated events published yet.
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
              <Link
                href="/upcoming-events"
                className="text-sm font-semibold text-kallol-700 underline-offset-4 hover:underline hover:text-kallol-800 transition-colors"
              >
                View all events
              </Link>
              <Link
                href="/calendar"
                className="text-sm font-semibold text-kallol-700 underline-offset-4 hover:underline hover:text-kallol-800 transition-colors"
              >
                Puja calendar
              </Link>
            </div>
            <p className="mt-3 text-xs text-ink-mute">
              Looking for past celebrations?{" "}
              <Link
                href="/archives"
                className="underline underline-offset-4 hover:text-kallol-800"
              >
                Browse the archives
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
