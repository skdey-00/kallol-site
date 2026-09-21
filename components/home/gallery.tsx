import Link from "next/link"
import { Reveal } from "@/components/kallol/reveal"

/**
 * GALLERY, visual memory, not a uniform grid (Phase 5B).
 *
 * One dominant frame (the sanctum) anchors the wall full-width;
 * three supporting frames follow in a row. Every frame renders at
 * its intrinsic 3:2, nothing is cropped, nothing letterboxed, and
 * the rows stay aligned because all sources share the ratio.
 * Quiet captions under everything. All frames verified against
 * app/photos/page.tsx. Links to /photos.
 */
const DOMINANT = {
  src: "/assets/5B8A0782-1-2a544d2e.webp",
  alt: "The Kallol Kali Mandir sanctum",
  caption: "The Kali Mandir sanctum",
}

const SUPPORTING = [
  {
    src: "/assets/JTP_1643-1-ddea36c8.webp",
    alt: "Evening aarti with lamps at the Kallol Kali Mandir",
    caption: "Evening aarti",
  },
  {
    src: "/assets/5B8A9920-1-30c87be2.webp",
    alt: "Devotees gathered at a Kallol festival celebration",
    caption: "Festival crowds",
  },
  {
    src: "/assets/IMG_9312-1-d83d3edb.webp",
    alt: "Floral decorations and offerings at the Kali Mandir",
    caption: "Flowers for Maa Kali",
  },
] as const

export function GalleryTeaser() {
  return (
    <section aria-labelledby="gallery-heading" className="bg-ivory-raised">
      <div className="container py-10 md:py-12 lg:py-16">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="section-eyebrow">Gallery</p>
              <h2
                id="gallery-heading"
                className="reveal-up section-title mt-3"
                style={{ ["--reveal-delay" as string]: "60ms" }}
              >
                Kallol, seen up close
              </h2>
              <p
                className="reveal-up mt-4 max-w-prose text-body-lg text-ink-soft"
                style={{ ["--reveal-delay" as string]: "120ms" }}
              >
                The mandir, the festivals, the people, photographs from
                Kallol&rsquo;s own celebrations.
              </p>
            </div>
            <Link
              href="/photos"
              className="link-editorial reveal-up text-sm font-semibold uppercase tracking-caps text-kallol-700 hover:text-kallol-800"
              style={{ ["--reveal-delay" as string]: "180ms" }}
            >
              View all photos
            </Link>
          </div>
        </Reveal>

        <Reveal className="mt-12 lg:mt-16">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            {/* Dominant frame, full-width anchor at its native 3:2 */}
            <figure className="group md:col-span-3">
              <Link
                href="/photos"
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-600 focus-visible:ring-offset-4 focus-visible:ring-offset-ivory-raised"
              >
                <div className="overflow-hidden">
                  <img
                    src={DOMINANT.src}
                    alt={DOMINANT.alt}
                    width={1710}
                    height={1140}
                    loading="lazy"
                    decoding="async"
                    className="reveal-img img-breathe aspect-[3/2] w-full object-cover"
                  />
                </div>
                <figcaption className="img-caption mt-2">
                  {DOMINANT.caption}
                </figcaption>
              </Link>
            </figure>

            {/* Supporting frames, equal thirds at their native 3:2 */}
            {SUPPORTING.map((s) => (
              <figure key={s.src} className="group">
                <Link href="/photos" className="block">
                  <div className="overflow-hidden">
                    <img
                      src={s.src}
                      alt={s.alt}
                      width={1500}
                      height={1000}
                      loading="lazy"
                      decoding="async"
                      className="reveal-img img-breathe aspect-[3/2] w-full object-cover"
                    />
                  </div>
                  <figcaption className="img-caption mt-2">{s.caption}</figcaption>
                </Link>
              </figure>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
