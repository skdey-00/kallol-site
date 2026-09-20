import Link from "next/link"
import { CATEGORY_LABELS } from "./event-view"

/**
 * ArchiveList — the Kallol archive treatment (Phase 6).
 *
 * Past events as ruled rows grouped by year, newest first — the
 * homepage's ruled-row language applied to history. The year is set
 * large in serif (a quiet echo of the date-xl scale voice); each row
 * shows date left, serif title, category tag. The archive reads as
 * Kallol's history, not a dumping ground.
 *
 * Data: only dated events already on the public Google Calendar.
 */

export interface ArchiveEntry {
  id: string
  title: string
  /** ISO date, YYYY-MM-DD */
  date: string
  category: string
  description?: string
  href?: string
}

/** "2025-10-06" → "6 Oct 2025" */
export function formatArchiveDate(iso: string): string {
  const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ]
  const [, m, d] = iso.split("-").map(Number)
  return `${d} ${MONTHS[m - 1]} ${iso.slice(0, 4)}`
}

export function ArchiveList({
  groups,
  className,
}: {
  /** Years, newest first; events within each year newest-first */
  groups: Array<{ year: string; events: ArchiveEntry[] }>
  className?: string
}) {
  return (
    <div className={className}>
      {groups.map((group) => (
        <section key={group.year} className="mb-16 last:mb-0">
          <div className="flex items-baseline gap-6">
            <h2 className="font-display text-statement text-kallol-700">
              {group.year}
            </h2>
            <div className="rule-draw h-px flex-1 bg-stone-line" aria-hidden="true" />
          </div>
          <ul className="mt-6">
            {group.events.map((event) => {
              const label = CATEGORY_LABELS[event.category] ?? event.category
              return (
                <li key={event.id}>
                  <Link
                    href={event.href ?? "/archives"}
                    className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-stone-line py-5 transition-colors hover:bg-kallol-50/60"
                  >
                    <span className="whitespace-nowrap text-caption uppercase tracking-caps text-kallol-700">
                      {formatArchiveDate(event.date)}
                    </span>
                    <span className="mt-1.5 font-display text-h3 text-ink transition-colors group-hover:text-kallol-700 md:mt-0">
                      {event.title}
                    </span>
                    <span className="text-caption uppercase tracking-caps text-ink-mute md:ml-auto md:whitespace-nowrap">
                      {label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
