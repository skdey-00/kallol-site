import { getEvents } from "@/actions/events"
import { nextAmavasyaEvent, nextEventByTitle } from "@/components/kallol/event-view"
import { UpcomingEventsView } from "./list-view"

export const metadata = {
  title: "Puja, Upcoming Pujas and Programmes | Kallol Kali Mandir",
  description:
    "Upcoming pujas and events at Kallol Kali Mandir Complex, Bangur Nagar, Goregaon West, Amavasya Puja every new moon, Durga Puja, Kali Puja, Lakshmi Puja, Saraswati Puja and cultural evenings.",
}

/**
 * Server wrapper: pulls the next Amavasya and Saraswati Puja dates from the
 * public Google Calendar (via getEvents()) and hands them to the client view,
 * whose cards render the calendar-derived dates instead of hardcoded ones.
 */
export default async function UpcomingEventsPage() {
  const events = await getEvents()
  const amavasya = nextAmavasyaEvent(events)
  const saraswati = nextEventByTitle(events, /saraswati/i)

  return <UpcomingEventsView amavasya={amavasya} saraswati={saraswati} events={events} />
}
