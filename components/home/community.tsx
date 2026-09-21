import Link from "next/link"
import { Reveal } from "@/components/kallol/reveal"
import { Figure } from "@/components/kallol/figure"

/**
 * COMMUNITY — "More than a mandir" (Phase 5B; recomposed 5C).
 *
 * Editorial storytelling rather than a catalogue of rows: each
 * service keeps its own silhouette on one 12-col grid —
 *   Library    — the lead: tall portrait frame + generous text;
 *   Medical    — reversed: text left, the wide dispensary banner
 *                (its native 20:9 shape) right;
 *   Facilities — the broad close: large landscape frame beside a
 *                narrow metadata rail.
 * Ghost numerals anchor the sequence; hairlines separate; nothing
 * is a card. Verified services only — library, dispensary, halls.
 */
const SERVICES = [
  {
    eyebrow: "Library",
    title: "A lending library of Bengali literature",
    body: "Tagore, Sarat Chandra, Bankim Chandra and contemporary Bengali authors — alongside spiritual texts and periodicals — in a reading room open to members of all ages.",
    href: "/library-services",
    linkLabel: "Visit the library",
    image: "/assets/library-de30773d.png",
    alt: "Shelves of Bengali books in the Kallol library",
  },
  {
    eyebrow: "Medical",
    title: "A charitable homeopathy dispensary",
    body: "Free consultations and affordable medicines three days a week — Tuesdays, Thursdays and Saturdays — open to all, staffed by experienced practitioners.",
    href: "/medical-services",
    linkLabel: "Medical services",
    image: "/assets/Medical-a397b286.webp",
    alt: "The homeopathy dispensary at the Kallol campus",
  },
  {
    eyebrow: "Facilities",
    title: "Halls and campus for the neighbourhood",
    body: "An air-conditioned conference hall seating about 35 and a large campus, bookable for family functions, seminars and events. Booking donations support temple maintenance and social activities.",
    href: "/facilities-services",
    linkLabel: "Facilities & booking",
    image: "/assets/Conference-Hall-6ce31122.jpg",
    alt: "The air-conditioned conference hall at Kallol",
  },
] as const

/** Ghost numeral — oversized, decorative, aria-hidden editorial anchor.
    In flow (flex row with the text block): no absolute positioning,
    no overlap with the hairlines. */
function GhostNumber({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="select-none shrink-0 basis-24 font-display text-[clamp(3.5rem,7vw,6rem)] leading-[0.8] text-kallol-600/15 lg:basis-28"
    >
      {String(n).padStart(2, "0")}
    </span>
  )
}

export function Community() {
  const [library, medical, facilities] = SERVICES

  return (
    <section aria-labelledby="community-heading" className="bg-stone-warm/60">
      <div className="container py-16 md:py-24 lg:py-28">
        <Reveal>
          <div className="max-w-3xl">
            <p className="section-eyebrow">Community</p>
            <h2
              id="community-heading"
              className="reveal-up mt-6 font-display text-statement text-ink"
              style={{ ["--reveal-delay" as string]: "60ms" }}
            >
              More than a mandir.
            </h2>
            <p
              className="reveal-up mt-5 max-w-prose text-body-lg text-ink-soft"
              style={{ ["--reveal-delay" as string]: "140ms" }}
            >
              Kallol is a working community institution — its campus serves
              the neighbourhood long after the aarti ends.
            </p>
          </div>
        </Reveal>

        {/* 01 · LIBRARY — the lead: tall frame + generous text */}
        <Reveal className="mt-12 lg:mt-16">
          <div className="rule-draw h-px bg-stone-line" aria-hidden="true" />
          <Link
            href={library.href}
            className="group grid gap-8 border-b border-stone-line py-10 md:py-12 lg:grid-cols-12 lg:items-start lg:gap-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-600 focus-visible:ring-offset-4 focus-visible:ring-offset-stone-warm"
          >
            <div className="lg:col-span-5 lg:pt-6">
              <Figure
                src={library.image}
                alt={library.alt}
                width={600}
                height={500}
                aspect="4/5"
                imgClassName="object-top"
              />
            </div>
            <div className="flex gap-6 lg:col-span-7 lg:gap-8">
              <GhostNumber n={1} />
              <div>
                <p className="text-caption uppercase tracking-caps text-kallol-700">
                  {library.eyebrow}
                </p>
                <h3 className="reveal-up mt-3 font-display text-h2 text-ink transition-colors group-hover:text-kallol-700">
                  {library.title}
                </h3>
                <p className="reveal-up mt-4 max-w-prose text-body-lg leading-relaxed text-ink-soft">
                  {library.body}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-kallol-700">
                  <span className="link-editorial">{library.linkLabel}</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 ease-calm group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </div>
          </Link>
        </Reveal>

        {/* 02 · MEDICAL — reversed: text left, wide banner right */}
        <Reveal>
          <Link
            href={medical.href}
            className="group grid gap-8 border-b border-stone-line py-10 md:py-12 lg:grid-cols-12 lg:items-center lg:gap-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-600 focus-visible:ring-offset-4 focus-visible:ring-offset-stone-warm"
          >
            <div className="flex gap-6 lg:order-1 lg:col-span-5 lg:gap-8">
              <GhostNumber n={2} />
              <div>
                <p className="text-caption uppercase tracking-caps text-kallol-700">
                  {medical.eyebrow}
                </p>
                <h3 className="reveal-up mt-3 font-display text-h2 text-ink transition-colors group-hover:text-kallol-700">
                  {medical.title}
                </h3>
                <p className="reveal-up mt-4 max-w-prose leading-relaxed text-ink-soft">
                  {medical.body}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-kallol-700">
                  <span className="link-editorial">{medical.linkLabel}</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 ease-calm group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </div>
            <div className="lg:order-2 lg:col-span-7">
              <Figure
                src={medical.image}
                alt={medical.alt}
                width={1600}
                height={720}
                aspect="21/9"
                imgClassName="object-top"
              />
            </div>
          </Link>
        </Reveal>

        {/* 03 · FACILITIES — the broad close: landscape frame + narrow rail */}
        <Reveal>
          <Link
            href={facilities.href}
            className="group grid gap-8 border-b border-stone-line py-10 md:py-12 lg:grid-cols-12 lg:items-end lg:gap-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-600 focus-visible:ring-offset-4 focus-visible:ring-offset-stone-warm"
          >
            <div className="lg:col-span-7">
              <Figure
                src={facilities.image}
                alt={facilities.alt}
                width={1600}
                height={1040}
                aspect="3/2"
                imgClassName="object-top"
              />
            </div>
            <div className="flex gap-6 lg:col-span-5 lg:gap-8">
              <GhostNumber n={3} />
              <div>
                <p className="text-caption uppercase tracking-caps text-kallol-700">
                  {facilities.eyebrow}
                </p>
                <h3 className="reveal-up mt-3 font-display text-h2 text-ink transition-colors group-hover:text-kallol-700">
                  {facilities.title}
                </h3>
                <p className="reveal-up mt-4 leading-relaxed text-ink-soft">
                  {facilities.body}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-kallol-700">
                  <span className="link-editorial">{facilities.linkLabel}</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 ease-calm group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </div>
          </Link>
        </Reveal>

        <p className="mt-8 text-sm text-ink-mute">
          Past initiatives, such as the{" "}
          <Link
            href="/medical-camp"
            className="link-editorial text-kallol-700"
          >
            March 2025 free medical camp
          </Link>
          , are preserved in the{" "}
          <Link href="/archives" className="link-editorial text-kallol-700">
            archives
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
