import Link from "next/link"
import { Reveal } from "@/components/kallol/reveal"
import { NextAmavasyaDate } from "@/components/kallol/next-amavasya-date"
import type { AmavasyaTarget } from "@/components/kallol/next-amavasya-date"
import { festivalDateLabel, festivalRun } from "@/components/kallol/event-view"
import type { CalendarEvent } from "@/lib/events-store"

/**
 * PUJA INDEX, the year, indexed (Phase 5B).
 *
 * Not six equal cards. Two major entries (Durga Puja, the
 * community's greatest festival; Kali Puja, Kallol's namesake)
 * carry photography at portrait scale. The remaining four are a
 * ruled index list: type + hairline + date chip carry them, no
 * images, size follows significance.
 *
 * Dates derive from the events store exactly as before. Festivals are
 * matched by title OR description across their consecutive-day run —
 * the calendar titles Durga Puja days per activity ("Pushpanjali"),
 * so title-only matching showed "Date to be announced".
 */
interface PujaEntry {
  title: string
  href: string
  image?: string
  alt?: string
  note: string
  /** Matched against event title and description, across the festival run. */
  pattern: RegExp
  fallback?: string
  /** Amavasya row: the date chip shows the next Amavasya date. */
  showNextDate?: boolean
}

const MAJORS: PujaEntry[] = [
  {
    title: "Durga Puja",
    href: "/durga-puja",
    image: "/assets/Durga_Puja_Tile-289a4e35.webp",
    alt: "Goddess Durga protima at Kallol's Durga Puja",
    note: "Six days of the community's greatest festival, dhaak, dhunuchi, Khichdi Bhog.",
    // Day events are titled per activity with the day in the description
    // ("Saptami", "Maha Ashtami (Adhik Diba)", "Sri Sri Durga Shashti").
    pattern: /durga|kalparambh|nabapatrika|saptami|ashtami|nabami|navami|dashami|sandhi puja|darpan|sindoor|sindur|bisarjan|kanakanjali|bijoya|kumari puja|agomoni/i,
  },
  {
    title: "Kali Puja",
    href: "/kali-puja",
    image: "/assets/Kali_Puja_Tile-35f6bb42.webp",
    alt: "Maa Kali at the Kallol Kali Mandir on Kali Puja night",
    note: "The Deepawali Amavasya Mahakali Puja at the mandir that gives Kallol its name.",
    pattern: /kali puja|maha kali|annakoot|deepawali|deepavali/i,
  },
]

const MINORS: PujaEntry[] = [
  {
    title: "Lakshmi Puja",
    href: "/lakshmi-puja",
    note: "Kojagari Purnima",
    pattern: /lakshmi|laxmi|kojagari/i,
  },
  {
    title: "Saraswati Puja",
    href: "/saraswati-puja",
    note: "Basanta Panchami, the puja Kallol was born of",
    pattern: /saraswati/i,
  },
  {
    title: "Amavasya Puja",
    href: "/amavasya-puja",
    note: "Monthly, every new moon, with Khichdi Bhog",
    pattern: /amavasya/,
    fallback: "Monthly · every new moon",
    showNextDate: true,
  },
  {
    title: "Special Pujas",
    href: "/special-puja",
    note: "Satyanarayan · Shanidev · Bipattarini & more",
    pattern: /shanidev|satyanarayan|bipattarini/i,
    fallback: "Satyanarayan · Shanidev & more",
  },
]

function dateFor(events: CalendarEvent[], puja: PujaEntry): string {
  const label = festivalDateLabel(festivalRun(events, puja.pattern))
  return label ?? puja.fallback ?? "Date to be announced"
}

interface ResolvedMinor {
  puja: PujaEntry
  /** ISO date of the next occurrence, when the calendar provides one */
  sortKey: string | null
}

/** The ruled index, ordered chronologically by each puja's next occurrence.
    Rows the calendar cannot date keep their authored order at the end. */
function orderedMinors(events: CalendarEvent[], amavasya: AmavasyaTarget | null | undefined): ResolvedMinor[] {
  const resolved: ResolvedMinor[] = MINORS.map((puja) => {
    if (puja.showNextDate && amavasya) {
      return { puja, sortKey: amavasya.date }
    }
    const run = festivalRun(events, puja.pattern)
    return { puja, sortKey: run[0]?.date ?? null }
  })
  return [...resolved].sort((a, b) => {
    if (a.sortKey && b.sortKey) return a.sortKey < b.sortKey ? -1 : 1
    if (a.sortKey) return -1
    if (b.sortKey) return 1
    return 0
  })
}

export function PujaIndex({
  events,
  amavasya,
}: {
  events: CalendarEvent[]
  /** Next Amavasya from the store, powers the Amavasya row's date chip. */
  amavasya?: AmavasyaTarget | null
}) {
  return (
    <section aria-labelledby="puja-heading" className="bg-ivory">
      <div className="container py-10 md:py-12 lg:py-16">
        {/* Section head, typographic, ruled */}
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="section-eyebrow">Puja</p>
              <h2
                id="puja-heading"
                className="reveal-up section-title mt-3"
                style={{ ["--reveal-delay" as string]: "60ms" }}
              >
                The pujas of the Bengali year
              </h2>
            </div>
            <Link
              href="/upcoming-events"
              className="link-editorial reveal-up text-sm font-semibold uppercase tracking-caps text-kallol-700 hover:text-kallol-800"
              style={{ ["--reveal-delay" as string]: "120ms" }}
            >
              View all events
            </Link>
          </div>
          <div
            className="rule-draw mt-8 h-px bg-kallol-600/60"
            aria-hidden="true"
          />
        </Reveal>

        {/* Major entries, aligned pair with photography (both tiles are
            7:10 portraits, so equal-width columns line up exactly) */}
        <Reveal className="mt-12 grid gap-10 md:grid-cols-2 lg:mt-16 lg:gap-12">
          {MAJORS.map((puja) => (
            <Link
              key={puja.title}
              href={puja.href}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-600 focus-visible:ring-offset-4 focus-visible:ring-offset-ivory"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
                <div className="relative w-full shrink-0 overflow-hidden sm:w-[44%]">
                  <img
                    src={puja.image}
                    alt={puja.alt}
                    width={350}
                    height={500}
                    loading="lazy"
                    decoding="async"
                    className="reveal-img img-breathe aspect-[7/10] h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <p className="text-caption uppercase tracking-caps text-kallol-700">
                      {dateFor(events, puja)}
                    </p>
                    <h3 className="mt-3 font-display text-h2 text-ink transition-colors group-hover:text-kallol-700">
                      {puja.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                      {puja.note}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </Reveal>

        {/* Minor entries, the ruled index — chronological by next occurrence */}
        <Reveal className="mt-14 md:mt-20">
          <div className="rule-draw h-px bg-stone-line" aria-hidden="true" />
          <ul>
            {orderedMinors(events, amavasya).map(({ puja }, i) => (
              <li key={puja.title}>
                <Link
                  href={puja.href}
                  className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-stone-line py-5 transition-colors hover:bg-kallol-50/60"
                >
                  <span className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                    <span className="w-8 text-caption text-ink-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-h3 text-ink transition-colors group-hover:text-kallol-700">
                      {puja.title}
                    </span>
                    <span className="hidden text-sm text-ink-mute md:inline">
                      {puja.note}
                    </span>
                  </span>
                  {puja.showNextDate && amavasya ? (
                    <NextAmavasyaDate target={amavasya} variant="compact" />
                  ) : (
                    <span className="text-caption uppercase tracking-caps text-ink-mute transition-colors group-hover:text-kallol-700">
                      {dateFor(events, puja)}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-ink-mute">
            Cultural evenings{" "}
            <Link href="/poila-baishak" className="link-editorial text-kallol-700">
              Poila Baishakh
            </Link>{" "}
            and{" "}
            <Link
              href="/rabindranath-tagore-birthday"
              className="link-editorial text-kallol-700"
            >
              Rabindra Jayanti
            </Link>{" "}
            are celebrated alongside the pujas.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
