import type { CalendarEvent } from "@/lib/events-store"
import type { EventView } from "@/components/kallol/event-view"
import { eventHref } from "@/components/kallol/event-view"

/**
 * Homepage event-view derivation — ONE SOURCE OF TRUTH.
 *
 * Derives presentational views from the shared events store
 * (data/local-events.json via getEvents()), exactly like /calendar and
 * /archives do. Homepage event cards were previously hardcoded in
 * components/featured-events.tsx; this module removes that duplication
 * without changing the store itself: an edit in the admin UI (or the
 * JSON file) now updates calendar, archives AND the homepage together.
 *
 * No dates are invented: whatever the store holds is what shows.
 */

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

/** ISO date string -> "16 Oct 2026" style short label. */
function shortDate(iso: string): string {
  const [, m, d] = iso.split("-").map(Number)
  return `${d} ${MONTHS[m - 1]} ${iso.slice(0, 4)}`
}

/** Grouped "16-21 Oct 2026" label when a festival spans consecutive days. */
function rangeLabel(events: CalendarEvent[]): string | null {
  if (events.length < 2) return null
  const first = events[0]
  const last = events[events.length - 1]
  if (first.date === last.date) return null
  const [, fm, fd] = first.date.split("-").map(Number)
  const [, lm, ld] = last.date.split("-").map(Number)
  const y = first.date.slice(0, 4)
  if (fm === lm) {
    return `${fd}\u2013${ld} ${MONTHS[fm - 1]} ${y}`
  }
  return `${fd} ${MONTHS[fm - 1]} \u2013 ${ld} ${MONTHS[lm - 1]} ${y}`
}

/** Display title for a collapsed festival run (drops day suffixes). */
function baseTitle(title: string): string {
  return title
    .replace(/\s*\(.*?\)\s*$/, "")
    .replace(
      /\s*-\s*(Maha|Adhik|Sandhi|Kalparambha|Bodhan|Amantran|Adhibas|Darpan|Sindoor|Sindur|Kumari|Hom|Vijaya|Dashami|Sashti|Saptami|Ashtami|Navami|Nabami).*$/i,
      "",
    )
    .trim()
}

/**
 * Collapses consecutive-day runs of one festival (e.g. the six Durga Puja
 * days) into a single representative event, so the homepage never shows
 * six rows of the same festival. The representative keeps the earliest
 * date; the range label is computed from the full run.
 */
function collapseFestivalRuns(events: CalendarEvent[]): Array<{ event: CalendarEvent; run: CalendarEvent[] }> {
  const groups = new Map<string, CalendarEvent[]>()
  for (const e of events) {
    const key = baseTitle(e.title)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(e)
  }

  const collapsed: Array<{ event: CalendarEvent; run: CalendarEvent[] }> = []
  for (const [key, group] of groups) {
    const consecutive = group.every((e, i) => {
      if (i === 0) return true
      const prev = new Date(group[i - 1].date).getTime()
      const cur = new Date(e.date).getTime()
      const diff = (cur - prev) / 86400000
      return diff >= 0 && diff <= 1
    })
    if (consecutive && group.length > 1) {
      collapsed.push({ event: { ...group[0], title: key }, run: group })
    } else {
      for (const e of group) collapsed.push({ event: e, run: [e] })
    }
  }
  return collapsed.sort((a, b) => (a.event.date < b.event.date ? -1 : 1))
}

export interface HomepageEvents {
  next: EventView | null
  upcoming: EventView[]
  all: EventView[]
}

/**
 * Build the homepage event views.
 * @param maxNext how many events feed the "coming up next" list (default 3)
 */
export function buildHomepageEvents(
  events: CalendarEvent[],
  maxNext = 3,
): HomepageEvents {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const future = events
    .filter((e) => new Date(`${e.date}T00:00:00`).getTime() >= todayStart.getTime())
    .sort((a, b) => (a.date < b.date ? -1 : 1))

  const views: EventView[] = collapseFestivalRuns(future).map((entry) => {
    const range = rangeLabel(entry.run)
    return {
      id: entry.event.id,
      title: entry.event.title,
      dateLabel: range !== null ? range : shortDate(entry.event.date),
      time: entry.event.time,
      location: entry.event.location,
      href: eventHref(entry.event.title),
      sortKey: entry.event.date,
    }
  })

  return {
    next: views[0] ?? null,
    upcoming: views.slice(1, 1 + maxNext),
    all: views,
  }
}
