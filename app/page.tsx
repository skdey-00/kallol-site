import type { Metadata } from "next"
import { getEvents } from "@/actions/events"
import { buildHomepageEvents } from "@/components/home/events-view"
import { nextAmavasyaEvent } from "@/components/kallol/event-view"
import { Hero } from "@/components/home/hero"
import { NowAtKallol } from "@/components/home/now-at-kallol"
import { Story } from "@/components/home/story"
import { PujaIndex } from "@/components/home/puja-index"
import { Community } from "@/components/home/community"
import { GalleryTeaser } from "@/components/home/gallery"
import { Participate } from "@/components/home/participate"
import { Visit } from "@/components/home/visit"

export const metadata: Metadata = {
  title: "Kallol Kali Mandir, Bengali Mandir & Community, Goregaon West, Mumbai",
  description:
    "Kallol Kali Mandir in Bangur Nagar, Goregaon West, Mumbai, pujas and festivals through the year, a charitable homeopathy dispensary, a Bengali library, and community halls. Donate, book a puja, or visit.",
}

// ISR: re-render the home page (with fresh calendar events) every 15 minutes
export const revalidate = 900

/**
 * Kallol homepage (Phase 5B, visual experience).
 *
 * Narrative order (IDENTITY → PLACE → PEOPLE → PUJA → CULTURE →
 * COMMUNITY → PARTICIPATION), composed for rhythm:
 *   1. Masthead  , full-bleed photography, logo + oversized statement
 *   2. Cover story— the most relevant upcoming event, date set enormous
 *   3. Story     , editorial feature from verified About copy
 *   4. Puja index— Durga/Kali majors + a ruled calendar index
 *   5. Community , ruled rows, not icon cards
 *   6. Memory    , one dominant frame + supporting photography
 *   7. Participate— donate-led dignified close on deep maroon
 *   8. Visit     , quiet metadata + map
 *
 * Server-rendered: events come from the public Google Calendar via
 * getEvents(), the same store that feeds /calendar and /archives —
 * one source of truth, no hardcoded homepage cards.
 *
 * No negative top margin: the global <main> already pads for the
 * fixed navbar (pt-[104px] md:pt-[120px]).
 */
export default async function Home() {
  const events = await getEvents()
  const { next, upcoming } = buildHomepageEvents(events)
  const amavasya = nextAmavasyaEvent(events)

  return (
    <div>
      <Hero />
      <NowAtKallol next={next} upcoming={upcoming} />
      <Story />
      <PujaIndex events={events} amavasya={amavasya} />
      <Community />
      <GalleryTeaser />
      <Participate />
      <Visit />
    </div>
  )
}
