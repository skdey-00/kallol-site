/**
 * Presentational event view (Phase 6).
 *
 * The single shared shape passed from server components to event
 * components — derived entirely from data/local-events.json via
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
  /** ISO date of the first occurrence — ordering only */
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
  if (t.includes("dol purnima") || t.includes("holi")) return "/cultural-events"
  if (t.includes("bipattarini")) return "/special-puja"
  return "/upcoming-events"
}

/**
 * Next Amavasya Puja occurrence (title contains "Amavasya", date today
 * or later). All site countdowns derive from the same store the
 * calendar and admin edit — dates are never hardcoded here.
 */
export function nextAmavasyaEvent<T extends { title: string; date: string; time?: string }>(
  events: T[],
  now: Date = new Date(),
): T | null {
  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)
  let best: T | null = null
  for (const e of events) {
    if (!/amavasya/i.test(e.title)) continue
    if (new Date(`${e.date}T00:00:00`).getTime() < startOfDay.getTime()) continue
    if (!best || e.date < best.date) best = e
  }
  return best
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
