import { unstable_cache } from "next/cache"
import ical from "node-ical"
import type { CalendarEvent } from "@/lib/events-store"

// Public Google Calendar managed by the temple committee; the site's events
// pages render whatever is on it. Override with GOOGLE_CALENDAR_ID if needed.
const GOOGLE_CALENDAR_ID =
  process.env.GOOGLE_CALENDAR_ID ||
  "037e179a1d54e741762a80e52fd2cc441cbedeccd4bd1aab97b1de80da1cbab4@group.calendar.google.com"

const FEED_URL = `https://calendar.google.com/calendar/ical/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/public/basic.ics`
const TIME_ZONE = "Asia/Kolkata"
const REVALIDATE_SECONDS = 15 * 60

// Matched against event titles to pick a card category for the site's tabs
const RELIGIOUS_TITLE = /puj[ai]o?|amavasya|purnima|kali|durga|lakshmi|saraswati|navami|dashami/i

function plainText(value: unknown): string {
  if (typeof value === "string") return value
  if (value && typeof value === "object" && "val" in value) {
    const val = (value as { val: unknown }).val
    return typeof val === "string" ? val : ""
  }
  return ""
}

// The calendar's year, in IST — events outside it are ignored (current year only)
function currentYearWindow(): { from: Date; to: Date; year: string } {
  const year = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric" }).format(new Date())
  return {
    year,
    from: new Date(`${year}-01-01T00:00:00+05:30`),
    to: new Date(`${year}-12-31T23:59:59+05:30`),
  }
}

async function fetchAndMapEvents(): Promise<CalendarEvent[]> {
  const res = await fetch(FEED_URL, { next: { revalidate: REVALIDATE_SECONDS } })
  if (!res.ok) {
    throw new Error(`Google Calendar ICS feed returned ${res.status}`)
  }
  const calendar = ical.sync.parseICS(await res.text())

  const { from, to } = currentYearWindow()
  const fmtDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  const fmtTime = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  const events: CalendarEvent[] = []
  let veventCount = 0
  let filteredBusyCount = 0

  for (const component of Object.values(calendar)) {
    if (component?.type === "VEVENT") veventCount++
    if (component?.type !== "VEVENT" || component.status === "CANCELLED") continue

    let instances: { start: Date; summary: unknown; isFullDay: boolean }[]
    if (component.rrule) {
      instances = ical.expandRecurringEvent(component, { from, to }).map((instance) => ({
        start: instance.start,
        summary: instance.summary,
        isFullDay: instance.isFullDay,
      }))
    } else {
      const start = component.start
      if (!(start instanceof Date) || start < from || start > to) continue
      instances = [
        {
          start,
          summary: component.summary,
          isFullDay: component.datetype === "date",
        },
      ]
    }

    const title = plainText(instances.length ? instances[0].summary : "") || component.uid
    const location = plainText(component.location)
    const description = plainText(component.description)

    for (const instance of instances) {
      const instanceTitle = plainText(instance.summary) || title
      // "Busy" blocks are the committee's internal placeholders while
      // scheduling — don't publish them; they show up once renamed
      if (/^busy$/i.test(instanceTitle)) {
        filteredBusyCount++
        continue
      }
      events.push({
        id: `${component.uid}-${fmtDate.format(instance.start)}`,
        title: instanceTitle,
        date: fmtDate.format(instance.start),
        // Per site requirements: show only the start time
        time: instance.isFullDay ? "All Day" : fmtTime.format(instance.start),
        location,
        category: RELIGIOUS_TITLE.test(instanceTitle) ? "religious" : "cultural",
        description,
      })
    }
  }

  if (veventCount > 0 && events.length === 0 && veventCount !== filteredBusyCount) {
    // Parse worked but nothing mapped (e.g. bundling broke node-ical dates) —
    // surface it instead of silently showing an empty calendar
    console.warn(`[google-calendar] parsed ${veventCount} VEVENTs but mapped 0 events`)
  }

  return events.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
}

// Cached so both server components and server actions share one fetch per 15 min
export const getGoogleEvents = unstable_cache(
  async (): Promise<CalendarEvent[]> => {
    try {
      return await fetchAndMapEvents()
    } catch (error) {
      console.error("[google-calendar] falling back to local events:", error)
      return []
    }
  },
  ["google-calendar-events"],
  { revalidate: REVALIDATE_SECONDS, tags: ["google-calendar"] },
)
