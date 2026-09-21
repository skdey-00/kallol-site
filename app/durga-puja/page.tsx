import { PageHeader } from "@/components/kallol/page-header"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Durga Puja in Goregaon West, Maha Sashti to Vijaya Dashami | Kallol",
  description: "Kallol's Durga Puja: six days of dhaak, dhunuchi naach, Sandhi Puja and Khichdi Bhog at Bangur Nagar, Goregaon West, Mumbai.",
}

/**
 * Durga Puja page (UX plan Phase 6).
 *
 * The structured information — the six-day date range, bhog timing,
 * calendar link and booking action — reads before the published
 * programme poster on mobile; the poster stays alongside the text on
 * desktop as supporting evidence, with an "Open full size" path to
 * the full-resolution image. Store/verified data only.
 */
export default function DurgaPujaPage() {
  return (
    <main className="min-h-screen pb-16 bg-ivory">
      <PageHeader
        title="Durga Puja"
        intro="Six days of dhaak, dhunuchi naach, Sandhi Puja and Khichdi Bhog at Bangur Nagar, Goregaon West — Friday 16 to Wednesday 21 October 2026."
        crumbs={[{ label: "Puja", href: "/upcoming-events" }]}
      />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
          {/* Story + key information: first on mobile, right column on desktop */}
          <div className="space-y-4 max-w-prose lg:order-2">
            <h2 className="text-2xl md:text-3xl font-bold text-kallol-800">The Pinnacle of Bengali Celebration</h2>
            <p className="text-ink-soft leading-relaxed">
              Durga Puja marks the pinnacle of spiritual and cultural celebration for the Bengali community, a radiant
              festival that epitomizes the triumph of good over evil and ushers in a season of joy and unity. The
              evocative rhythm of the dhaak, the sacred resonance of the shankha and ghanta, and the heady aroma of
              dhunuchi incense herald the arrival of Maa Durga, drawing the community together in reverence and
              festivity, no matter how far they may be.
            </p>
            <p className="text-ink-soft leading-relaxed">
              Kallol&apos;s annual Durga Puja celebration is held with great devotion and splendor at its campus, creating a
              sacred space for prayer, reflection, and togetherness. Devotees are invited to offer their Puja, relish
              the traditional Khichdi Bhog, mingle with loved ones amidst a vibrant array of food stalls, and witness
              the enchanting Dhunuchi Naach performed daily during the festivities.
            </p>

            {/* Key information */}
            <div className="mt-8 border-t border-stone-line pt-6">
              <h3 className="font-display text-h3 text-ink">Key Information</h3>
              <p className="mt-4 text-ink-soft leading-relaxed">
                For those unable to attend in person, Kallol extends its reach through a live telecast of the Durga
                Puja events on its official website. Contributions to the Puja may be made online, where one may also
                book specific rituals to be performed in their name and Gotra.
              </p>
              <p className="mt-4 text-ink-soft leading-relaxed">
                Special bhog may be collected from the Kallol grounds between 1:00 PM and 3:00 PM. The full day-by-day
                programme is on the <Link href="/calendar" className="link-editorial text-kallol-700">Puja Calendar</Link>.
              </p>
              <div className="mt-6">
                <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white rounded-full text-sm">
                  <Link href="/donate/durga-puja">Book Puja Offerings</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* The published programme poster: desktop left column; on mobile it
              follows the key information as supporting evidence */}
          <figure className="lg:order-1">
            <img
              src="/assets/durgotsab-2026-schedule.webp"
              alt="Durgotsab 2026 — the full six-day programme, Friday 16 to Wednesday 21 October 2026"
              width={637}
              height={741}
              loading="lazy"
              decoding="async"
              className="w-full rounded-lg border border-stone-line shadow-lg"
            />
            <figcaption className="img-caption mt-2 text-center">
              The published programme, Durgotsab 2026.{" "}
              <a
                href="/assets/durgotsab-2026-schedule.webp"
                target="_blank"
                rel="noreferrer"
                className="link-editorial whitespace-nowrap text-kallol-700"
              >
                Open full size
              </a>
            </figcaption>
          </figure>
        </div>

        {/* Quiet editorial close (was a gradient card) */}
        <div className="rule-draw h-px bg-kallol-600/60" aria-hidden="true" />
        <p className="mt-8 max-w-prose font-display text-statement text-ink">
          Kallol cordially invites you with your family and friends to participate in the annual Durga Puja
          celebrations from October 16 to October 21.
        </p>
      </div>
    </main>
  )
}
