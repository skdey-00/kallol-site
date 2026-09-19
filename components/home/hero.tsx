import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"
import { HeroSlideshow } from "@/components/home/hero-slideshow"

/**
 * HERO — the homepage masthead (Phase 5B).
 *
 * Full-bleed, edge-to-edge Kallol photography with a deep maroon
 * scrim; the canonical logo, one oversized serif statement, an
 * editorial metadata rail, and a single primary CTA anchored
 * bottom-left. Deliberately NOT a text-left/image-right split.
 *
 * - The logo sits on the deepest part of the scrim (kallol-950 at
 *   ~90%), the sanctioned dark surface per brand doc §2 (footer
 *   uses the same logo-on-kallol-950 treatment).
 * - One-time entrance (hero-enter) staggers logo → statement →
 *   rail → CTAs; reduced-motion collapses it globally.
 * - No negative margins: the global <main> already pads for the
 *   fixed navbar, so the photo begins flush below it.
 */
export function Hero() {
  return (
    <section className="relative bg-kallol-950" aria-labelledby="hero-heading">
      <div className="relative h-[82svh] min-h-[560px] max-h-[940px] w-full overflow-hidden">
        <HeroSlideshow />

        {/* Content anchored bottom-left, on the deepest scrim */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="container pb-8 md:pb-14">
            <div className="max-w-3xl">
              <div className="hero-enter" style={{ ["--reveal-delay" as string]: "80ms" }}>
                {/* `!` overrides BrandLogo's inline px sizing so the mark
                    scales down on small viewports — ratio stays locked by
                    the component's width/height attributes (never cropped). */}
                <BrandLogo
                  size="hero"
                  className="!h-14 !w-auto md:!h-20 lg:!h-[104px] max-w-none"
                />
              </div>

              <h1
                id="hero-heading"
                className="hero-enter mt-4 font-display text-display-xl text-ivory md:mt-8"
                style={{ ["--reveal-delay" as string]: "180ms" }}
              >
                A Bengali mandir &amp; cultural
                <br className="hidden md:block" /> community in the heart of
                Goregaon.
              </h1>

              <p
                className="hero-enter mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-caption uppercase tracking-caps text-ivory/75 md:mt-6"
                style={{ ["--reveal-delay" as string]: "280ms" }}
              >
                <span className="inline-block h-px w-10 bg-kallol-300" aria-hidden="true" />
                Bangur Nagar · Goregaon West · Mumbai
              </p>

              <div
                className="hero-enter mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:mt-8"
                style={{ ["--reveal-delay" as string]: "380ms" }}
              >
                <Link href="/upcoming-events" className="btn-primary">
                  Puja &amp; Events
                </Link>
                <Link
                  href="/about"
                  className="link-editorial text-sm font-semibold uppercase tracking-caps text-ivory transition-colors hover:text-kallol-200"
                >
                  About Kallol
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
