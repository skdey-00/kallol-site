import type { Metadata } from "next"
import { getEvents } from "@/actions/events"
import { buildHomepageEvents } from "@/components/home/events-view"
import { Hero } from "@/components/home/hero"
import { NowAtKallol } from "@/components/home/now-at-kallol"
import { Story } from "@/components/home/story"
import { PujaIndex } from "@/components/home/puja-index"
import { Community } from "@/components/home/community"
import { GalleryTeaser } from "@/components/home/gallery"
import { Participate } from "@/components/home/participate"
import { Visit } from "@/components/home/visit"

export const metadata: Metadata = {
  title: "Kallol Kali Mandir — Bengali Mandir & Community, Goregaon West, Mumbai",
  description:
    "Kallol Kali Mandir in Bangur Nagar, Goregaon West, Mumbai — pujas and festivals through the year, a charitable homeopathy dispensary, a Bengali library, and community halls. Donate, book a puja, or visit.",
}

/**
 * Kallol homepage (Phase 5).
 *
 * Narrative order:
 *   1. Identity      — split hero: logo + positioning + CTAs / photography
 *   2. Presence      — verified address + mandir timings (Visit, below)
 *   3. Current       — NowAtKallol, straight from the events store
 *   4. Story         — concise editorial intro from verified About copy
 *   5. Puja & Events — six puja tiles with real next-date chips
 *   _narrative continues:
 *   6. Community     — library / dispensary / facilities spread
 *   7. Visual memory — gallery mosaic of real Kallol photography
 *   8. Participate   — donate / offerings / booking on deep maroon
 *   9. Visit         — address, timings, phone, email, map
 *
 * Server-rendered: events come from the same store that feeds /calendar
 * and /archives — one source of truth, no hardcoded homepage cards.
 *
 * No negative top margin: the global <main> already pads for the fixed
 * navbar (pt-[104px] md:pt-[120px]); pulling the hero up further slid
 * the identity column's logo behind the opaque navbar (verified Sept 2026:
 * logo rect top 40px vs header bottom 105px at 390px — 65px hidden).
 */
export default async function Home() {
  const events = await getEvents()
  const { next, upcoming, all } = buildHomepageEvents(events)

  return (
    <div>
      <Hero />
      <NowAtKallol next={next} upcoming={upcoming} />
      <Story />
      <PujaIndex events={all} />
      <Community />
      <GalleryTeaser />
      <Participate />
      <Visit />
    </div>
  )
}
