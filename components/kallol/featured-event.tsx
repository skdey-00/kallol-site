import Link from "next/link"
import { Reveal } from "./reveal"
import { EventMeta } from "./event-meta"
import type { EventView } from "./event-view"

/**
 * FeaturedEvent, the cover-story treatment (Phase 6).
 *
 * The Phase 5B "Now at Kallol" feature generalized for interior
 * pages: real photography, enormous date numerals anchored on the
 * image, serif statement title, metadata, CTA. Store data only.
 *
 * Use on: /upcoming-events (Phase 7), event hub pages.
 * The homepage keeps its own instance via now-at-kallol.tsx which
 * uses the same classes; this component is the reusable extraction.
 */

/** "16–21 Oct 2026" → { days: "16–21", month: "Oct", year: "2026" } */
export function splitDateLabel(label: string): {
  days: string
  month: string
  year: string
} {
  const parts = label.split(" ")
  if (parts.length >= 3) {
    return { days: parts[0], month: parts[1], year: parts[2] }
  }
  return { days: label, month: "", year: "" }
}

export interface FeaturedEventProps {
  event: EventView
  image: { src: string; alt: string }
  /** CTA label, usually "Explore …" derived from the destination */
  ctaLabel?: string
  eyebrow?: string
}

export function FeaturedEvent({
  event,
  image,
  ctaLabel = "Explore the event",
  eyebrow = "Now at Kallol",
}: FeaturedEventProps) {
  const { days, month } = splitDateLabel(event.dateLabel)
  return (
    <Reveal>
      <article>
        <p className="section-eyebrow">{eyebrow}</p>
        <div className="mt-6">
          <Link
            href={event.href}
            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-600 focus-visible:ring-offset-4 focus-visible:ring-offset-ivory"
          >
            <div className="relative overflow-hidden">
              <img
                src={image.src}
                alt={image.alt}
                width={1600}
                height={1067}
                loading="lazy"
                decoding="async"
                className="reveal-img img-breathe aspect-[3/2] w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute bottom-0 right-0 hidden select-none p-5 md:block"
              >
                <p className="font-display text-date-xl leading-none text-ivory drop-shadow-[0_2px_12px_rgba(14,14,42,0.55)]">
                  {days}
                  {month && (
                    <span className="ml-2 align-baseline font-sans text-caption font-semibold uppercase tracking-caps text-ivory/90">
                      {month}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </Link>
        </div>
        <p className="mt-8 font-display text-statement text-ink">
          <Link href={event.href} className="link-editorial hover:text-kallol-700">
            {event.title}
          </Link>
        </p>
        <EventMeta
          className="mt-4"
          date={event.dateLabel}
          time={event.time}
          location={event.location}
        />
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href={event.href} className="btn-primary">
            {ctaLabel}
          </Link>
        </div>
      </article>
    </Reveal>
  )
}
