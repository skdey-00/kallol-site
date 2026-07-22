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

// Seed data -- used the first time the file is created
const SEED_EVENTS: CalendarEvent[] = [
  {
    id: "evt-001",
    title: "Kali Puja Celebration",
    date: "2025-11-12",
    time: "6:00 PM - 10:00 PM",
    location: "Kali Mandir, Bangur Nagar",
    category: "religious",
    description: "Grand celebration of Kali Puja with traditional rituals and cultural performances.",
  },
  {
    id: "evt-002",
    title: "Bengali Cultural Night",
    date: "2025-10-25",
    time: "7:00 PM - 11:00 PM",
    location: "Kali Mandir Community Hall",
    category: "cultural",
    description: "Evening of Bengali music, dance, and poetry.",
  },
  {
    id: "evt-003",
    title: "Durga Puja",
    date: "2025-10-10",
    time: "All Day",
    location: "Kali Mandir, Bangur Nagar",
    category: "religious",
    description: "Five-day celebration of Goddess Durga with elaborate decorations and rituals.",
  },
  {
    id: "evt-004",
    title: "Saraswati Puja",
    date: "2026-02-14",
    time: "10:00 AM - 2:00 PM",
    location: "Kali Mandir, Bangur Nagar",
    category: "religious",
    description: "Worship of Goddess Saraswati, deity of knowledge and arts.",
  },
  {
    id: "evt-005",
    title: "Poila Boishakh (Bengali New Year)",
    date: "2025-04-14",
    time: "9:00 AM - 6:00 PM",
    location: "Kali Mandir Community Hall",
    category: "cultural",
    description: "Celebration of Bengali New Year with traditional food and performances.",
  },
  {
    id: "evt-006",
    title: "Rabindra Jayanti",
    date: "2025-05-09",
    time: "5:00 PM - 9:00 PM",
    location: "Kallol Auditorium",
    category: "cultural",
    description: "Commemoration of Rabindranath Tagore's birth anniversary.",
  },
  {
    id: "evt-007",
    title: "Bengali Language Workshop",
    date: "2025-09-18",
    time: "10:00 AM - 1:00 PM",
    location: "Kallol Learning Center",
    category: "educational",
    description: "Learn Bengali language basics with experienced instructors.",
  },
  {
    id: "evt-008",
    title: "Community Meeting",
    date: "2025-08-30",
    time: "5:00 PM - 7:00 PM",
    location: "Kali Mandir Meeting Room",
    category: "community",
    description: "Monthly community meeting to discuss upcoming events and initiatives.",
  },
]

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
