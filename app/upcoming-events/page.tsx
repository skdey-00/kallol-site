import { getEvents } from "@/actions/events"
import { nextAmavasyaEvent } from "@/components/kallol/event-view"
import { UpcomingEventsView } from "./list-view"

export const metadata = {
  title: "Puja & Events — Upcoming Pujas and Programmes | Kallol Kali Mandir",
  description:
    "Upcoming pujas and events at Kallol Kali Mandir, Bangur Nagar, Goregaon West — Amavasya Puja every new moon, Durga Puja, Kali Puja, Lakshmi Puja, Saraswati Puja and cultural evenings.",
}

/**
 * Server wrapper: pulls the next Amavasya from the shared events store
 * (data/local-events.json) and hands it to the client view, whose
 * Amavasya card carries the live countdown.
 */
export default async function UpcomingEventsPage() {
  const events = await getEvents()
  const amavasya = nextAmavasyaEvent(events)

  return <UpcomingEventsView amavasya={amavasya} />
}
