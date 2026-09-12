import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"
import { HeroSlideshow } from "@/components/home/hero-slideshow"

/**
 * Editorial split hero (Phase 5).
 *
 * Left: ivory column with the canonical Kallol logo at hero scale,
 * a concise positioning line, location, and two CTAs.
 * Right: slow crossfade of real Kallol photography with a maroon scrim.
 * The logo sits on solid ivory — never over imagery — per brand doc §2.
 */
export function Hero() {
  return (
    <section className="relative bg-ivory" aria-labelledby="hero-heading">
      <div className="container">
        <div className="grid grid-rows-[auto_auto] lg:grid-cols-12 lg:grid-rows-1">
          {/* Identity column */}
          <div className="flex flex-col justify-center py-10 md:py-14 lg:py-24 lg:pr-12 lg:col-span-5">
            <BrandLogo size="hero" className="h-16 md:h-24 lg:h-[120px] w-auto" />
            <h1 id="hero-heading" className="sr-only">
              Kallol Kali Mandir, Bangur Nagar, Goregaon West, Mumbai
            </h1>
            <p className="mt-8 font-display text-display leading-[1.05] text-ink">
              A Bengali mandir and cultural community in the heart of Goregaon.
            </p>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
              Pujas and festivals through the year, a charitable dispensary, a
              library of Bengali literature, and halls that welcome the
              neighbourhood — anchored by the Kallol Kali Mandir.
            </p>
            <p className="mt-6 flex items-center gap-2 text-caption uppercase tracking-caps text-ink-mute">
              <span
                aria-hidden="true"
                className="inline-block h-px w-8 bg-kallol-600"
              />
              Bangur Nagar · Goregaon West · Mumbai
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/upcoming-events" className="btn-primary">
                Puja &amp; Events
              </Link>
              <Link href="/about" className="btn-outline">
                About Kallol
              </Link>
            </div>
          </div>

          {/* Photo column — real Kallol photography, slow crossfade */}
          <div className="relative min-h-[340px] lg:min-h-[600px] lg:col-span-7">
            <HeroSlideshow />
          </div>
        </div>
      </div>
    </section>
  )
}
