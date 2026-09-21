import Link from "next/link"
import { Reveal } from "@/components/kallol/reveal"

/**
 * THE KALLOL STORY, editorial feature moment (Phase 5B).
 *
 * A pull-quote-scale statement set large, a narrow-measure narrative
 * beside it, and the verified community photograph held slightly
 * tall (portrait crop) with a quiet caption. "Discover our story"
 * as an underlined editorial link, an invitation, not a button.
 * Copy is the verified About narrative; no invented facts.
 */
export function Story() {
  return (
    <section aria-labelledby="story-heading" className="bg-ivory-sun">
      <div className="container py-10 md:py-12 lg:py-20">
        <Reveal className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Statement + narrative */}
          <div className="lg:col-span-7">
            <p className="section-eyebrow">Our Story</p>
            <h2
              id="story-heading"
              className="reveal-up mt-6 font-display text-statement text-ink"
              style={{ ["--reveal-delay" as string]: "60ms" }}
            >
              Born of Saraswati Puja,{" "}
              <span className="text-kallol-700">grown into a community</span>.
            </h2>

            <div
              className="reveal-up mt-8 grid gap-6 border-l-2 border-kallol-600/70 pl-6 sm:grid-cols-2 sm:gap-8"
              style={{ ["--reveal-delay" as string]: "140ms" }}
            >
              <p className="leading-relaxed text-ink-soft">
                In Goregaon, Mumbai&rsquo;s Bengali community established Kallol as a
                social and cultural organization, conceived by founding members
                who first came together to observe Basanta Panchami through the
                worship of Maa Saraswati.
              </p>
              <p className="leading-relaxed text-ink-soft">
                At the heart of its spiritual life stands the Kallol Kali
                Mandir. Around it have grown the monthly Amavasya Puja with its
                Khichdi Bhog, the great festivals of the Bengali year, a
                charitable homeopathy dispensary, and a library of Bengali
                literature.
              </p>
            </div>

            <div
              className="reveal-up mt-10 flex flex-wrap items-center gap-x-10 gap-y-3"
              style={{ ["--reveal-delay" as string]: "220ms" }}
            >
              <Link
                href="/about"
                className="link-editorial text-sm font-semibold uppercase tracking-caps text-kallol-700 hover:text-kallol-800"
              >
                Discover our story
              </Link>
              <Link
                href="/kallol-kali-mandir"
                className="link-editorial text-sm font-semibold uppercase tracking-caps text-kallol-700 hover:text-kallol-800"
              >
                The Kali Mandir
              </Link>
            </div>
          </div>

          {/* Portrait photograph, held slightly tall */}
          <figure className="reveal-up lg:col-span-5" style={{ ["--reveal-delay" as string]: "160ms" }}>
            <div className="overflow-hidden">
              <img
                src="/assets/home-about-06f92df6.webp"
                alt="Kallol members and devotees gathered at the Kallol campus, Goregaon"
                width={960}
                height={640}
                loading="lazy"
                decoding="async"
                className="reveal-img aspect-[3/2] w-full object-cover object-center"
              />
            </div>
            <figcaption className="img-caption mt-3">
              The Kallol community, Bangur Nagar, Goregaon West
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
