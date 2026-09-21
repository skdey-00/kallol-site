import Link from "next/link"
import { HeroSlideshow } from "@/components/home/hero-slideshow"

/**
 * HERO — the homepage masthead (Phase 5B).
 *
 * Full-bleed, edge-to-edge Kallol photography with a deep maroon
 * scrim; one oversized serif statement, an editorial metadata rail,
 * and a single primary CTA anchored bottom-left. Deliberately NOT a
 * text-left/image-right split.
 *
 * - No second logo here: the canonical mark lives in the navbar
 *   alone, so the photograph stays the primary visual and nothing
 *   competes with the header.
 * - One-time entrance (hero-enter) staggers statement → rail →
 *   CTAs; reduced-motion collapses it globally.
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
              <h1
                id="hero-heading"
                className="hero-enter font-display text-display-xl text-ivory"
                style={{ ["--reveal-delay" as string]: "80ms" }}
              >
                A Bengali mandir &amp; cultural
                <br className="hidden md:block" /> community in the heart of
                Goregaon.
              </h1>

              <p
                className="hero-enter mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-caption uppercase tracking-caps text-ivory/75 md:mt-6"
                style={{ ["--reveal-delay" as string]: "180ms" }}
              >
                <span className="inline-block h-px w-10 bg-kallol-300" aria-hidden="true" />
                Bangur Nagar · Goregaon West · Mumbai
              </p>

              <div
                className="hero-enter mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:mt-8"
                style={{ ["--reveal-delay" as string]: "280ms" }}
              >
                <Link href="/upcoming-events" className="btn-primary">
                  Puja
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
