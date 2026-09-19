import Link from "next/link"
import { Reveal } from "@/components/kallol/reveal"

/**
 * GALLERY — visual memory, not a uniform grid (Phase 5B).
 *
 * One dominant frame (the sanctum, near-16:9 wide) anchors the
 * wall; three supporting frames sit beside/below at varied sizes
 * and intentional crops. Quiet captions under everything. All
 * frames verified against app/photos/page.tsx. Links to /photos.
 *
 * Layout (lg): dominant left ~58%, supporting column right with
 * two frames stacked, one wide frame below spanning. Asymmetry by
 * design; uniformity is the enemy.
 */
const DOMINANT = {
  src: "/assets/5B8A0782-1-2a544d2e.webp",
  alt: "The Kallol Kali Mandir sanctum",
  caption: "The Kali Mandir sanctum",
}

const SUPPORTING = [
  {
    src: "/assets/JTP_1643-1-ddea36c8.png",
    alt: "Evening aarti with lamps at the Kallol Kali Mandir",
    caption: "Evening aarti",
  },
  {
    src: "/assets/5B8A9920-1-30c87be2.webp",
    alt: "Devotees gathered at a Kallol festival celebration",
    caption: "Festival crowds",
  },
  {
    src: "/assets/IMG_9312-1-d83d3edb.png",
    alt: "Floral decorations and offerings at the Kali Mandir",
    caption: "Flowers for Maa Kali",
  },
] as const

export function GalleryTeaser() {
  return (
    <section aria-labelledby="gallery-heading" className="bg-ivory-raised">
      <div className="container py-16 md:py-24 lg:py-28">
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
                The mandir, the festivals, the people — photographs from
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            {/* Dominant frame — full-width at md, tall left column at lg */}
            <figure className="group md:col-span-12 lg:col-span-7 lg:row-span-2">
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
                    className="reveal-img img-breathe aspect-[4/3] w-full object-cover lg:aspect-[4/5] lg:h-full"
                  />
                </div>
                <figcaption className="img-caption mt-2">
                  {DOMINANT.caption}
                </figcaption>
              </Link>
            </figure>

            {/* Supporting frames — 2-up at md, stacked right column at lg */}
            <figure className="group md:col-span-6 lg:col-span-5">
              <Link href="/photos" className="block">
                <div className="overflow-hidden">
                  <img
                    src={SUPPORTING[0].src}
                    alt={SUPPORTING[0].alt}
                    width={1500}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                    className="reveal-img img-breathe aspect-[3/2] w-full object-cover"
                  />
                </div>
                <figcaption className="img-caption mt-2">
                  {SUPPORTING[0].caption}
                </figcaption>
              </Link>
            </figure>

            <figure className="group md:col-span-6 lg:col-span-5">
              <Link href="/photos" className="block">
                <div className="overflow-hidden">
                  <img
                    src={SUPPORTING[1].src}
                    alt={SUPPORTING[1].alt}
                    width={1920}
                    height={1280}
                    loading="lazy"
                    decoding="async"
                    className="reveal-img img-breathe aspect-[3/2] w-full object-cover"
                  />
                </div>
                <figcaption className="img-caption mt-2">
                  {SUPPORTING[1].caption}
                </figcaption>
              </Link>
            </figure>

            {/* Wide frame below — full-width, near-cinema crop */}
            <figure className="group md:col-span-12">
              <Link href="/photos" className="block">
                <div className="overflow-hidden">
                  <img
                    src={SUPPORTING[2].src}
                    alt={SUPPORTING[2].alt}
                    width={1500}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                    className="reveal-img img-breathe aspect-[3/2] w-full object-cover md:aspect-[21/9]"
                  />
                </div>
                <figcaption className="img-caption mt-2">
                  {SUPPORTING[2].caption}
                </figcaption>
              </Link>
            </figure>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
