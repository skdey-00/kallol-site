/**
 * Presentational event view (Phase 6).
 *
 * The single shared shape passed from server components to event
 * components, derived entirely from data/local-events.json via
 * getEvents() / buildHomepageEvents(). Never hand-authored.
 *
 * (Merges the two identical interfaces that previously lived in
 * components/home/types.ts and components/home/events-view.ts.)
 */
export interface EventView {
  id: string
  title: string
  /** Short date label, e.g. "16–21 Oct 2026" */
  dateLabel: string
  /** Long date label, e.g. "Friday, 16 October 2026" */
  longDateLabel?: string
  time?: string
  location?: string
  href: string
  note?: string
  /** ISO date of the first occurrence, ordering only */
  sortKey: string
}

/** Routes an event title to its Phase 4 destination page. */
export function eventHref(title: string): string {
  const t = title.toLowerCase()
  if (t.includes("durga")) return "/durga-puja"
  if (t.includes("kali")) return "/kali-puja"
  if (t.includes("laxmi") || t.includes("lakshmi")) return "/lakshmi-puja"
  if (t.includes("saraswati")) return "/saraswati-puja"
  if (t.includes("amavasya")) return "/amavasya-puja"
  if (t.includes("shanidev")) return "/special-puja"
  if (t.includes("satyanarayan")) return "/special-puja"
  if (t.includes("poila") || t.includes("baisakh") || t.includes("boishakh") || t.includes("baishakh"))
    return "/poila-baishak"
  if (t.includes("rabindra") || t.includes("tagore")) return "/rabindranath-tagore-birthday"
  if (t.includes("bipattarini")) return "/special-puja"
  return "/upcoming-events"
}

/**
 * Next occurrence whose title matches pattern (date today or later).
 * All site date displays derive from the same store the calendar and
 * admin edit, dates are never hardcoded.
 */
export function nextEventByTitle<T extends { title: string; date: string }>(
  events: T[],
  pattern: RegExp,
  now: Date = new Date(),
): T | null {
  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)
  let best: T | null = null
  for (const e of events) {
    if (!pattern.test(e.title)) continue
    if (new Date(`${e.date}T00:00:00`).getTime() < startOfDay.getTime()) continue
    if (!best || e.date < best.date) best = e
  }
  return best
}

/**
 * Next Amavasya Puja occurrence (title contains "Amavasya", date today
 * or later).
 */
export function nextAmavasyaEvent<T extends { title: string; date: string; time?: string }>(
  events: T[],
  now: Date = new Date(),
): T | null {
  return nextEventByTitle(events, /amavasya/i, now)
}

/** Human category label for a store category slug. */
export const CATEGORY_LABELS: Record<string, string> = {
  religious: "Puja",
  cultural: "Cultural",
  educational: "Educational",
  community: "Community",
  "member-meeting": "Member Meeting",
  "committee-meeting": "Committee Meeting",
}

const FESTIVAL_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

/**
 * Earliest consecutive run of calendar events matching pattern (title OR
 * description). The committee's calendar titles Durga Puja days per
 * activity ("Pushpanjali", "Kumari Puja"…) with the festival/day in the
 * description ("Saptami", "Maha Ashtami"), so a festival's dates are the
 * run of matching events, not one event. A later stray match (e.g.
 * Chaitra Navami months after the Durga run) is excluded by the
 * consecutive-day window.
 */
export function festivalRun<T extends { title: string; date: string; description?: string }>(
  events: T[],
  pattern: RegExp,
): T[] {
  const matched = events
    .filter((e) => pattern.test(e.title) || pattern.test(e.description ?? ""))
    .sort((a, b) => (a.date < b.date ? -1 : 1))
  const run: T[] = []
  for (const e of matched) {
    if (run.length > 0) {
      const prev = new Date(`${run[run.length - 1].date}T00:00:00`).getTime()
      const cur = new Date(`${e.date}T00:00:00`).getTime()
      if ((cur - prev) / 86400000 > 1) break
    }
    run.push(e)
  }
  return run
}

/** Date label for a festival run, "16–21 Oct 2026" or "25 Oct 2026". */
export function festivalDateLabel(run: { date: string }[]): string | null {
  if (run.length === 0) return null
  const [fy, fm, fd] = run[0].date.split("-").map(Number)
  // Several events may share one date (e.g. Lakshmi Puja's evening run)
  if (run[0].date === run[run.length - 1].date) {
    return `${fd} ${FESTIVAL_MONTHS[fm - 1]} ${run[0].date.slice(0, 4)}`
  }
  const [ly, lm, ld] = run[run.length - 1].date.split("-").map(Number)
  const y = run[0].date.slice(0, 4)
  if (fm === lm && fy === ly) return `${fd}–${ld} ${FESTIVAL_MONTHS[fm - 1]} ${y}`
  return `${fd} ${FESTIVAL_MONTHS[fm - 1]} – ${ld} ${FESTIVAL_MONTHS[lm - 1]} ${ly}`
}
