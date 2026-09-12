import Link from "next/link"
import type { EventView } from "./types"

/**
 * Puja & Events index — six puja tiles with next-date chips derived from
 * the events store (grouped multi-day festivals collapse to a range).
 * Prioritization: Durga Puja and Kali Puja lead (the community's biggest
 * festival and Kallol's namesake); recurring Amavasya shows a
 * "Monthly" chip instead of a fabricated single date.
 */
interface PujaEntry {
  title: string
  href: string
  image: string
  alt: string
  /** Find the next dated instance of this puja in the events store */
  match: (title: string) => boolean
  /** Chip label when the puja is recurring or has no dated instance */
  fallback?: string
}

const PUJAS: PujaEntry[] = [
  {
    title: "Durga Puja",
    href: "/durga-puja",
    image: "/assets/Durga_Puja_Tile-289a4e35.png",
    alt: "Goddess Durga protima at Kallol's Durga Puja",
    match: (t) => t.includes("Durga Puja"),
  },
  {
    title: "Kali Puja",
    href: "/kali-puja",
    image: "/assets/Kali_Puja_Tile-35f6bb42.png",
    alt: "Maa Kali at the Kallol Kali Mandir on Kali Puja night",
    match: (t) => t.includes("Kali Puja") || t.includes("Mahakali"),
  },
  {
    title: "Lakshmi Puja",
    href: "/lakshmi-puja",
    image: "/assets/Lakshmi_Puja_Tile-2a79392d.png",
    alt: "Kojagari Lakshmi Puja at Kallol",
    match: (t) => t.includes("Laxmi") || t.includes("Lakshmi"),
  },
  {
    title: "Saraswati Puja",
    href: "/saraswati-puja",
    image: "/assets/Sarashwati_Puja_Tile-ed17e914.png",
    alt: "Saraswati Puja — the spring worship of Maa Saraswati at Kallol",
    match: (t) => t.includes("Saraswati"),
  },
  {
    title: "Amavasya Puja",
    href: "/amavasya-puja",
    image: "/assets/Amabasya_Puja_Tile-f954983b.png",
    alt: "Devotees at the monthly Amavasya Puja, Kallol Kali Mandir",
    match: () => false, // monthly — never surface a single "next" date
    fallback: "Monthly · every new moon",
  },
  {
    title: "Special Pujas",
    href: "/special-puja",
    image: "/assets/SpecialPuja-3da3ae1b.png",
    alt: "Special pujas at Kallol — Satyanarayan, Shanidev and others",
    match: () => false,
    fallback: "Satyanarayan · Shanidev & more",
  },
]

function chipLabel(events: EventView[], puja: PujaEntry): string {
  const found = events.find((e) => puja.match(e.title))
  if (found) return found.dateLabel
  return puja.fallback ?? "Date to be announced"
}

export function PujaIndex({ events }: { events: EventView[] }) {
  return (
    <section aria-labelledby="puja-heading" className="bg-ivory">
      <div className="container py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="section-eyebrow">Puja &amp; Events</p>
            <h2 id="puja-heading" className="section-title mt-3">
              The pujas of the Bengali year
            </h2>
            <p className="mt-4 text-body-lg text-ink-soft">
              From the monthly Amavasya Puja to the great autumn festivals —
              each with its own page of rituals, schedules and offerings.
            </p>
          </div>
          <Link href="/upcoming-events" className="btn-outline">
            View all events
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PUJAS.map((puja) => (
            <Link
              key={puja.title}
              href={puja.href}
              className="group card-kallol flex flex-col"
            >
              <div className="relative overflow-hidden">
                <img
                  src={puja.image}
                  alt={puja.alt}
                  width={640}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/2] w-full object-cover transition-transform duration-300 ease-calm group-hover:scale-[1.02]"
                />
                <span className="absolute bottom-2 left-2 right-2 truncate rounded-sm bg-ivory/95 px-2.5 py-1.5 text-caption uppercase tracking-caps text-kallol-800">
                  {chipLabel(events, puja)}
                </span>
              </div>
              <div className="flex items-center justify-between p-5">
                <h3 className="font-display text-h3 text-ink group-hover:text-kallol-700 transition-colors">
                  {puja.title}
                </h3>
                <span
                  aria-hidden="true"
                  className="text-kallol-600 transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-6 text-sm text-ink-mute">
          Cultural evenings —{" "}
          <Link
            href="/poila-baishak"
            className="text-kallol-700 underline underline-offset-4 hover:text-kallol-800"
          >
            Poila Baishakh
          </Link>{" "}
          and{" "}
          <Link
            href="/rabindranath-tagore-birthday"
            className="text-kallol-700 underline underline-offset-4 hover:text-kallol-800"
          >
            Rabindra Jayanti
          </Link>{" "}
          — are celebrated alongside the pujas.
        </p>
      </div>
    </section>
  )
}
