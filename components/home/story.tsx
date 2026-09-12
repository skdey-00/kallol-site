import Link from "next/link"

/**
 * The Kallol Story — concise editorial introduction built from the verified
 * About copy. Two short paragraphs only; the full story lives at /about.
 */
export function Story() {
  return (
    <section aria-labelledby="story-heading" className="bg-ivory">
      <div className="container py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <figure className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-md border border-stone-line">
              <img
                src="/assets/home-about-06f92df6.png"
                alt="Kallol members and devotees gathered at the Kallol campus, Goregaon"
                width={960}
                height={640}
                loading="lazy"
                decoding="async"
                className="aspect-[3/2] w-full object-cover"
              />
            </div>
            <figcaption className="img-caption mt-3">
              The Kallol community, Bangur Nagar, Goregaon West
            </figcaption>
          </figure>

          <div className="lg:col-span-7">
            <p className="section-eyebrow">Our Story</p>
            <h2 id="story-heading" className="section-title mt-3">
              Born of Saraswati Puja, grown into a community
            </h2>
            <div className="mt-6 max-w-prose space-y-5 text-ink-soft leading-relaxed">
              <p>
                In Goregaon, Mumbai&rsquo;s Bengali community established Kallol
                as a social and cultural organization — conceived by founding
                members who first came together to observe Basanta Panchami
                through the worship of Maa Saraswati, and driven by a desire to
                preserve and celebrate the traditions of Bengal.
              </p>
              <p>
                At the heart of its spiritual life stands the Kallol Kali
                Mandir. Around it have grown the monthly Amavasya Puja with its
                Khichdi Bhog, the great festivals of the Bengali year, a
                charitable homeopathy dispensary, and a library of Bengali
                literature.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              <Link
                href="/about"
                className="text-sm font-semibold text-kallol-700 underline-offset-4 hover:underline hover:text-kallol-800 transition-colors"
              >
                Read our story
              </Link>
              <Link
                href="/kallol-kali-mandir"
                className="text-sm font-semibold text-kallol-700 underline-offset-4 hover:underline hover:text-kallol-800 transition-colors"
              >
                About the Kali Mandir
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
