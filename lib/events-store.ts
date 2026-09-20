import fs from "fs"
import path from "path"

export interface CalendarEvent {
  id: string
  title: string
  date: string // YYYY-MM-DD
  time: string
  location: string
  category: "religious" | "cultural" | "educational" | "community" | "member-meeting" | "committee-meeting"
  description: string
}

const DATA_DIR = path.join(process.cwd(), "data")
const EVENTS_FILE = path.join(DATA_DIR, "local-events.json")

// Seed data -- used the first time the file is created.
// NOTE(archive): the Apr 2025 - Apr 2026 puja calendar published by Kallol has
// fully passed, so its dated events were removed from the live schedule so the
// site no longer shows past pujas as current. Historical reference for that
// calendar: Kali Puja (Deepavali Amavasya) 2025-10-20, Durga Puja Maha Navami
// 2025-10-01, Vijaya Dashami 2025-10-02, Kojagari Lakshmi Puja 2025-10-06,
// Saraswati Puja 2026-01-23, Dol Purnima 2026-03-03, plus monthly Amavasya,
// Shanidev and other pujas (see site-data/pages.json for the full archive).
// When the committee publishes the next calendar, add the new dated events here
// or via the admin interface -- do NOT guess festival dates.
const SEED_EVENTS: CalendarEvent[] = []

function ensureDataFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(EVENTS_FILE)) {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(SEED_EVENTS, null, 2), "utf-8")
  }
}

function readEvents(): CalendarEvent[] {
  ensureDataFile()
  try {
    const raw = fs.readFileSync(EVENTS_FILE, "utf-8")
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeEvents(events: CalendarEvent[]): void {
  ensureDataFile()
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), "utf-8")
}

function generateId(): string {
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export const eventsStore = {
  getAll(): CalendarEvent[] {
    return readEvents().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  },

  getById(id: string): CalendarEvent | undefined {
    return readEvents().find((e) => e.id === id)
  },

  add(data: Omit<CalendarEvent, "id">): CalendarEvent {
    const events = readEvents()
    const newEvent: CalendarEvent = { ...data, id: generateId() }
    events.push(newEvent)
    writeEvents(events)
    return newEvent
  },

  update(id: string, data: Partial<Omit<CalendarEvent, "id">>): CalendarEvent | null {
    const events = readEvents()
    const idx = events.findIndex((e) => e.id === id)
    if (idx === -1) return null
    events[idx] = { ...events[idx], ...data }
    writeEvents(events)
    return events[idx]
  },

  remove(id: string): boolean {
    const events = readEvents()
    const filtered = events.filter((e) => e.id !== id)
    if (filtered.length === events.length) return false
    writeEvents(filtered)
    return true
  },
}
