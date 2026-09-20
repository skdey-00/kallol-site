/**
 * NextAmavasyaDate — static date of the next Amavasya Puja.
 *
 * No countdown, no ticking — just the date. The target event is
 * derived server-side from data/local-events.json (via
 * nextAmavasyaEvent) and passed in as props, so this component
 * stores no dates of its own: an edit in /admin updates every
 * placement on the site. Pure presentational output of props, so
 * server and client markup always match (no hydration mismatch).
 * Renders nothing when no future Amavasya is known.
 *
 * Variants:
 *   band    — deep maroon panel (dedicated page placement)
 *   panel   — light boxed card for legacy-styled pages
 *   compact — single inline line for list rows and small cards
 */

export interface AmavasyaTarget {
  title: string
  /** YYYY-MM-DD */
  date: string
  /** Store format, e.g. "08:00 PM" */
  time?: string
  location?: string
}

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const

/**
 * Deterministic long date from an ISO YYYY-MM-DD string —
 * "2026-10-10" → "Saturday, 10 October 2026". Computed with a fixed
 * UTC lookup so it renders identically on server and every client.
 */
export function amavasyaLongDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) return iso
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]
  return `${weekday}, ${d} ${MONTHS[m - 1]} ${y}`
}

/** Short form — "2026-10-10" → "Sat, 10 Oct 2026" (for compact rows). */
function shortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) return iso
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]
  return `${weekday.slice(0, 3)}, ${d} ${MONTHS[m - 1].slice(0, 3)} ${y}`
}

export function NextAmavasyaDate({
  target,
  variant = "band",
  className = "",
}: {
  target: AmavasyaTarget | null
  variant?: "band" | "panel" | "compact"
  className?: string
}) {
  if (!target) return null

  const when = target.time ? `${amavasyaLongDate(target.date)} · ${target.time}` : amavasyaLongDate(target.date)

  if (variant === "compact") {
    return (
      <span
        className={`inline-flex items-baseline gap-2 whitespace-nowrap text-sm font-semibold text-kallol-700 ${className}`}
      >
        <span className="text-caption uppercase tracking-caps text-ink-mute">Next:</span>
        {shortDate(target.date)}
      </span>
    )
  }

  const isBand = variant === "band"
  const shell = isBand
    ? `rounded-xl bg-kallol-800 px-6 py-10 text-center md:px-10 md:py-14 ${className}`
    : `rounded-lg border border-stone-line bg-white p-5 ${className}`

  return (
    <div className={shell}>
      <p className={`text-caption font-semibold uppercase tracking-caps ${isBand ? "text-ivory/70" : "text-kallol-700"}`}>
        Next Amavasya Puja
      </p>
      <p className={`mt-3 font-display text-h3 ${isBand ? "text-ivory" : "text-ink"}`}>{target.title}</p>
      <p className={`mt-2 text-sm ${isBand ? "text-ivory/80" : "text-ink-soft"}`}>{when}</p>
    </div>
  )
}
