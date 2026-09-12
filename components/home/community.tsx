import Link from "next/link"

/**
 * "More than a mandir" — the community-services editorial spread.
 * Real, verified services only: Library, homeopathy dispensary,
 * facilities/halls, plus the archived medical camp. Editorial
 * rows rather than an icon grid, per the Phase 5 brief.
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

export function Community() {
  return (
    <section aria-labelledby="community-heading" className="bg-stone-warm/60">
      <div className="container py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="section-eyebrow">Community</p>
          <h2 id="community-heading" className="section-title mt-3">
            More than a mandir
          </h2>
          <p className="mt-4 text-body-lg text-ink-soft">
            Kallol is a working community institution — its campus serves the
            neighbourhood long after the aarti ends.
          </p>
        </div>

        <div className="mt-12 space-y-10 md:space-y-0 md:grid md:gap-px md:grid-cols-3">
          {SERVICES.map((s) => (
            <article
              key={s.eyebrow}
              className="group flex flex-col border border-stone-line bg-ivory-raised rounded-md overflow-hidden md:rounded-none md:first:rounded-l-md md:last:rounded-r-md md:border-r-0 md:last:border-r"
            >
              <Link href={s.href} className="block overflow-hidden">
                <img
                  src={s.image}
                  alt={s.alt}
                  width={640}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/2] w-full object-cover transition-transform duration-300 ease-calm group-hover:scale-[1.02]"
                />
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-caption uppercase tracking-caps text-kallol-700">
                  {s.eyebrow}
                </p>
                <h3 className="mt-2 font-display text-h3 text-ink">{s.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                  {s.body}
                </p>
                <Link
                  href={s.href}
                  className="mt-5 text-sm font-semibold text-kallol-700 underline-offset-4 hover:underline hover:text-kallol-800 transition-colors"
                >
                  {s.linkLabel}
                  <span aria-hidden="true"> →</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-sm text-ink-mute">
          Past initiatives, such as the{" "}
          <Link
            href="/medical-camp"
            className="text-kallol-700 underline underline-offset-4 hover:text-kallol-800"
          >
            March 2025 free medical camp
          </Link>
          , are preserved in the{" "}
          <Link
            href="/archives"
            className="text-kallol-700 underline underline-offset-4 hover:text-kallol-800"
          >
            archives
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
