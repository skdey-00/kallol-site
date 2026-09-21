import Link from "next/link"
import { Reveal } from "@/components/kallol/reveal"
import { Figure } from "@/components/kallol/figure"
import { NextAmavasyaDate } from "@/components/kallol/next-amavasya-date"
import type { AmavasyaTarget } from "@/components/kallol/next-amavasya-date"
import type { EventView } from "@/components/kallol/event-view"

/**
 * PUJA INDEX — the year, indexed (Phase 5B; majors recomposed 5C).
 *
 * One curated editorial composition, not two matching blocks:
 * Durga Puja — the community's greatest festival — carries the
 * large portrait frame (left), while Kali Puja — the namesake —
 * sits as the companion feature, anchored below a hairline in the
 * right column. Size follows significance; the whitespace between
 * them is the composition. The four minor pujas remain a numbered
 * ruled index — type carries them, no images.
 *
 * Dates derive from the events store exactly as before (grouped
 * multi-day festivals collapse to a range; recurring Amavasya
 * shows "Monthly", never a fabricated single date).
 */
interface PujaEntry {
  title: string
  href: string
  image?: string
  alt?: string
  note: string
  match: (title: string) => boolean
  fallback?: string
  /** Amavasya row: the date chip shows the next Amavasya date. */
  showNextDate?: boolean
}

const MAJORS: PujaEntry[] = [
  {
    title: "Durga Puja",
    href: "/durga-puja",
    image: "/assets/Durga_Puja_Tile-289a4e35.png",
    alt: "Goddess Durga protima at Kallol's Durga Puja",
    note: "Six days of the community's greatest festival — dhaak, dhunuchi, Khichdi Bhog.",
    match: (t) => t.includes("Durga Puja"),
  },
  {
    title: "Kali Puja",
    href: "/kali-puja",
    image: "/assets/Kali_Puja_Tile-35f6bb42.png",
    alt: "Maa Kali at the Kallol Kali Mandir on Kali Puja night",
    note: "The Deepawali Amavasya Mahakali Puja at the mandir that gives Kallol its name.",
    match: (t) => t.includes("Kali Puja") || t.includes("Mahakali"),
  },
]

const MINORS: PujaEntry[] = [
  {
    title: "Lakshmi Puja",
    href: "/lakshmi-puja",
    note: "Kojagari Purnima",
    match: (t) => t.includes("Laxmi") || t.includes("Lakshmi"),
  },
  {
    title: "Saraswati Puja",
    href: "/saraswati-puja",
    note: "Basanta Panchami — the puja Kallol was born of",
    match: (t) => t.includes("Saraswati"),
  },
  {
    title: "Amavasya Puja",
    href: "/amavasya-puja",
    note: "Monthly, every new moon — with Khichdi Bhog",
    match: () => false,
    fallback: "Monthly · every new moon",
    showNextDate: true,
  },
  {
    title: "Special Pujas",
    href: "/special-puja",
    note: "Satyanarayan · Shanidev · Bipattarini & more",
    match: (t) =>
      t.includes("Shanidev") ||
      t.includes("Satyanarayan") ||
      t.includes("Bipattarini"),
    fallback: "Satyanarayan · Shanidev & more",
  },
]

function dateFor(events: EventView[], puja: PujaEntry): string {
  const found = events.find((e) => puja.match(e.title))
  if (found) return found.dateLabel
  return puja.fallback ?? "Date to be announced"
}

const [DURGA, KALI] = MAJORS

export function PujaIndex({
  events,
  amavasya,
}: {
  events: EventView[]
  /** Next Amavasya from the store — powers the Amavasya row's date chip. */
  amavasya?: AmavasyaTarget | null
}) {
  return (
    <section aria-labelledby="puja-heading" className="bg-ivory">
      <div className="container py-16 md:py-24 lg:py-28">
        {/* Section head — typographic, ruled */}
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

        {/* Major festivals — one curated editorial composition.
            Durga Puja, the community's greatest festival, carries the
            large portrait frame; its type sits beside it (md) or opens
            the right column (lg). Kali Puja, the namesake, is the
            companion feature: a hairline, a smaller frame, type set
            one step down — pinned to the same bottom baseline the
            Durga image establishes. Size follows significance; the
            air between the two entries is the composition's
            whitespace, not padding around two equal blocks. */}
        <div className="mt-12 grid gap-12 md:grid-cols-2 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          {/* Durga Puja — the featured festival plate. Capped at 560px:
              the source tile is 350×500 (documented photo limitation),
              so beyond this the upscale reads soft; the remaining
              track width becomes composition air. */}
          <Reveal className="md:col-span-1 lg:col-span-7 lg:row-span-2 lg:max-w-[560px]">
            <Link
              href={DURGA.href}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-600 focus-visible:ring-offset-4 focus-visible:ring-offset-ivory"
            >
              <Figure
                src={DURGA.image!}
                alt={DURGA.alt!}
                width={350}
                height={500}
                aspect="7/10"
                imgClassName="object-top"
              />
            </Link>
          </Reveal>

          {/* Durga type — beside the plate at md, top of the column at lg */}
          <Reveal>
            <Link
              href={DURGA.href}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-600 focus-visible:ring-offset-4 focus-visible:ring-offset-ivory"
            >
              <p className="text-caption uppercase tracking-caps text-kallol-700">
                {dateFor(events, DURGA)}
              </p>
              <h3 className="reveal-up mt-3 font-display text-h2 text-ink transition-colors group-hover:text-kallol-700">
                {DURGA.title}
              </h3>
              <p className="reveal-up mt-4 max-w-prose text-sm leading-relaxed text-ink-soft">
                {DURGA.note}
              </p>
              <span
                aria-hidden="true"
                className="reveal-up mt-5 inline-block text-kallol-600 transition-transform duration-300 ease-calm group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </Reveal>

          {/* Kali Puja — the namesake, anchored to the shared baseline */}
          <Reveal className="md:col-span-2 lg:col-span-5 lg:self-end">
            <Link
              href={KALI.href}
              className="group block border-t border-stone-line pt-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-600 focus-visible:ring-offset-4 focus-visible:ring-offset-ivory"
            >
              <div className="flex gap-6">
                <div className="w-[38%] shrink-0 md:w-[34%] lg:w-[42%]">
                  <Figure
                    src={KALI.image!}
                    alt={KALI.alt!}
                    width={350}
                    height={500}
                    aspect="7/10"
                    imgClassName="object-top"
                  />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <p className="text-caption uppercase tracking-caps text-kallol-700">
                      {dateFor(events, KALI)}
                    </p>
                    <h3 className="reveal-up mt-2 font-display text-h3 text-ink transition-colors group-hover:text-kallol-700">
                      {KALI.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      {KALI.note}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="mt-5 inline-block text-kallol-600 transition-transform duration-300 ease-calm group-hover:translate-x-1"
                  >
                    →
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>

        {/* Minor entries — the ruled index */}
        <Reveal className="mt-14 md:mt-20">
          <div className="rule-draw h-px bg-stone-line" aria-hidden="true" />
          <ul>
            {MINORS.map((puja, i) => (
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
            Cultural evenings — Poila Baishakh, Rabindra Jayanti and Dol
            Purnima —{" "}
            <Link href="/cultural-events" className="link-editorial text-kallol-700">
              have a calendar of their own
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  )
}
