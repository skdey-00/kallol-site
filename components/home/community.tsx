import Link from "next/link"
import { Reveal } from "@/components/kallol/reveal"

/**
 * COMMUNITY, "More than a mandir" (Phase 5B).
 *
 * Not three equal cards. One large statement, then three
 * full-width ruled rows: eyebrow + title + body left, thumbnail
 * right (swap sides on mobile). The row is the Kallol visual
 * language: hairline in, content carried, hairline out.
 * Verified services only, library, dispensary, facilities.
 */
const SERVICES = [
  {
    eyebrow: "Library",
    title: "A lending library of Bengali literature",
    body: "Tagore, Sarat Chandra, Bankim Chandra and contemporary Bengali authors, alongside spiritual texts and periodicals, in a reading room open to members of all ages.",
    href: "/library-services",
    linkLabel: "Visit the library",
    image: "/assets/library-de30773d.webp",
    alt: "Shelves of Bengali books in the Kallol library",
  },
  {
    eyebrow: "Medical",
    title: "A charitable homeopathy dispensary",
    body: "Free consultations and affordable medicines three days a week, Tuesdays, Thursdays and Saturdays, open to all, staffed by experienced practitioners.",
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
    image: "/assets/Conference-Hall-6ce31122.webp",
    alt: "The air-conditioned conference hall at Kallol",
  },
] as const

export function Community() {
  return (
    <section aria-labelledby="community-heading" className="bg-stone-warm/60">
      <div className="container py-10 md:py-12 lg:py-16">
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
              Kallol is a working community institution, its campus serves
              the neighbourhood long after the aarti ends.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-12 lg:mt-16">
          <div className="rule-draw h-px bg-stone-line" aria-hidden="true" />
          {SERVICES.map((s, i) => (
            <article key={s.eyebrow} className="border-b border-stone-line">
              <Link
                href={s.href}
                className="group grid gap-6 py-8 transition-colors hover:bg-kallol-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-600 focus-visible:ring-offset-4 focus-visible:ring-offset-stone-warm md:grid-cols-12 md:items-center md:gap-10 md:py-10"
              >
                <div className="md:col-span-8 lg:col-span-9">
                  <p className="text-caption uppercase tracking-caps text-kallol-700">
                    {String(i + 1).padStart(2, "0")} · {s.eyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-h2 text-ink transition-colors group-hover:text-kallol-700">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-soft">
                    {s.body}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-kallol-700">
                    <span className="link-editorial">{s.linkLabel}</span>
                  </span>
                </div>
                <div className="md:col-span-4 lg:col-span-4">
                  <div className="overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.alt}
                      width={640}
                      height={400}
                      loading="lazy"
                      decoding="async"
                      className="reveal-img img-breathe aspect-[3/2] w-full object-cover"
                    />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </Reveal>

        <p className="mt-8 text-sm text-ink-mute">
          And take a look at the{" "}
          <Link
            href="/medical-camp"
            className="link-editorial text-kallol-700"
          >
            March 2025 free medical camp
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
