import Link from "next/link"
import { HeroSlideshow } from "@/components/home/hero-slideshow"

/**
 * HERO, the homepage masthead (Phase 5B, revised).
 *
 * Full-bleed Kallol photography stands alone — no overlays on the
 * slideshow. The statement, metadata rail and CTAs sit directly
 * below it on the ivory ground, where they read cleanly at every
 * viewport.
 *
 * - One-time entrance (hero-enter) staggers statement → rail → CTAs;
 *   reduced-motion collapses it globally.
 * - No negative margins: the global <main> already pads for the
 *   fixed navbar, so the photo begins flush below it.
 */
export function Hero() {
  return (
    <section className="bg-ivory" aria-labelledby="hero-heading">
      <div className="relative h-[50svh] min-h-[340px] max-h-[560px] w-full overflow-hidden md:h-[45svh]">
        <HeroSlideshow />
      </div>

      {/* Statement, rail and CTAs below the slideshow */}
      <div className="container pt-8 pb-10 md:pt-10 md:pb-12">
        <div className="max-w-4xl">
          <h1
            id="hero-heading"
            className="hero-enter font-display text-display-xl text-ink"
            style={{ ["--reveal-delay" as string]: "120ms" }}
          >
            A Bengali mandir &amp;
            <br className="hidden md:block" /> cultural community in the
            heart of Goregaon.
          </h1>

          <p
            className="hero-enter mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-caption uppercase tracking-caps text-ink-mute md:mt-5"
            style={{ ["--reveal-delay" as string]: "220ms" }}
          >
            <span className="inline-block h-px w-10 bg-kallol-600" aria-hidden="true" />
            Bangur Nagar · Goregaon West · Mumbai
          </p>

          <div
            className="hero-enter mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:mt-6"
            style={{ ["--reveal-delay" as string]: "320ms" }}
          >
            <Link href="/upcoming-events" className="btn-primary">
              Upcoming events
            </Link>
            <Link
              href="/durga-puja"
              className="inline-flex items-center justify-center rounded-xl border-2 border-kallol-700 bg-transparent px-5 py-2.5 text-sm font-semibold uppercase tracking-caps text-kallol-700 transition-colors duration-200 hover:bg-kallol-700 hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-600 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              Durgotsab 2026
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-xl border-2 border-kallol-700 bg-transparent px-5 py-2.5 text-sm font-semibold uppercase tracking-caps text-kallol-700 transition-colors duration-200 hover:bg-kallol-700 hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-600 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              About Kallol
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
