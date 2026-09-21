import { getEvents } from "@/actions/events"
import { PageHeader } from "@/components/kallol/page-header"
import { Section } from "@/components/kallol/section"
import { FeatureRowList } from "@/components/kallol/feature-row"
import { EventRail } from "@/components/kallol/event-rail"
import { CtaBand } from "@/components/kallol/cta-band"
import { eventHref } from "@/components/kallol/event-view"
import type { EventView } from "@/components/kallol/event-view"
import { formatArchiveDate } from "@/components/kallol/archive-list"

export const metadata = {
  title: "Cultural Programmes — Poila Baishakh, Rabindra Jayanti & Dol Purnima | Kallol",
  description:
    "Cultural programmes at Kallol Kali Mandir, Goregaon West — Poila Baishakh (Bengali New Year), Rabindra Jayanti and Dol Purnima: evenings of Rabindra Sangeet, recitation, drama and authentic Bengali cuisine.",
}

/**
 * Cultural hub (the nav's "Cultural" landing).
 *
 * Signature cultural evenings live as FeatureRows (the paired
 * content + image treatment); dated occurrences derive from the
 * shared events store exactly like the calendar and homepage —
 * no dates are invented here.
 */

/** Titles that belong to the cultural calendar regardless of store category. */
const CULTURAL_TITLE = /(poila|baisakh|boishakh|baishak|rabindra|tagore|dol purnima|holi)/i

export default async function CulturalEventsPage() {
  const events = await getEvents()

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const culturalViews: EventView[] = events
    .filter((e) => e.category === "cultural" || CULTURAL_TITLE.test(e.title))
    .filter((e) => new Date(`${e.date}T00:00:00`).getTime() >= todayStart.getTime())
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .map((e) => ({
      id: e.id,
      title: e.title,
      dateLabel: formatArchiveDate(e.date),
      time: e.time,
      location: e.location,
      href: eventHref(e.title),
      sortKey: e.date,
    }))

  const signatureEvents = [
    {
      eyebrow: "Bengali New Year",
      title: "Poila Baishakh",
      body: "The Bengali New Year begins with prayers for prosperity — Dashopachar Puja at 9:00 AM and Satyanarayan Puja at 6:00 PM — and flows into a cultural programme of traditional music, dance and poetry, served with authentic Bengali cuisine. The day also marks the Kallol Club Anniversary. Next celebration: Poila Baishakh 1434, Thursday 15 April 2027.",
      href: "/poila-baishak",
      linkLabel: "Celebration details",
      image: "/assets/PoilaBoishak-ee6e477f.png",
      alt: "Poila Baishakh — Bengali New Year celebration at Kallol",
    },
    {
      eyebrow: "25 Boishakh",
      title: "Rabindra Jayanti",
      body: "Kallol pays homage to Gurudev Rabindranath Tagore with a curated evening of Rabindra Sangeet, recitation and drama. Members of all ages perform his poems, songs and dance dramas, keeping the Bard of Bengal's spirit alive across generations. The next programme is announced closer to the date.",
      href: "/rabindranath-tagore-birthday",
      linkLabel: "Programme details",
      image: "/assets/Final_1_ranbindra_opt1-1-1-55e1cfa0.png",
      alt: "Rabindra Jayanti — cultural evening at Kallol",
    },
  ]

  return (
    <main className="min-h-screen pb-16 bg-ivory">
      <PageHeader
        eyebrow="Cultural"
        title="Cultural Programmes"
        intro="Between the pujas, Kallol keeps Bengal's arts alive — music, dance, recitation and drama at the Bengali community's cultural home in Bangur Nagar, Goregaon West."
        crumbs={[{ label: "Cultural", href: "/cultural-events" }]}
      />

      <Section
        id="signature"
        tone="sun"
        eyebrow="Signature Evenings"
        title="The year's cultural calendar"
        intro="Two evenings anchor the cultural year — the Bengali New Year in spring and Rabindra Jayanti in Boishakh — with Dol Purnima's Holi Utsav rounding out the season."
      >
        <FeatureRowList rows={signatureEvents} className="mt-12" />
      </Section>

      <Section
        id="ahead"
        tone="raised"
        eyebrow="Dates"
        title="What's ahead"
        intro="Dated cultural occasions from the shared events calendar — the same store the Puja Calendar and homepage read from."
      >
        <EventRail
          label="Upcoming cultural occasions"
          events={culturalViews}
          className="mt-12"
          footerLinks={[
            { label: "Full puja calendar", href: "/calendar" },
            { label: "All upcoming events", href: "/upcoming-events" },
          ]}
        />
      </Section>

      <CtaBand
        eyebrow="Participate"
        title="Take your place on the cultural calendar"
        body="Performers, volunteers and patrons keep these evenings alive. If you would like to take part — or support a programme — speak to the committee."
        primary={{ label: "Contact Kallol", href: "/contact" }}
        secondary={{ label: "View the puja calendar", href: "/calendar" }}
        quietActions={[
          { label: "Poila Baishakh", href: "/poila-baishak", note: "Bengali New Year" },
          { label: "Rabindra Jayanti", href: "/rabindranath-tagore-birthday", note: "25 Boishakh" },
        ]}
      />
    </main>
  )
}
