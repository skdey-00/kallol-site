import { getEvents } from "@/actions/events"
import { nextAmavasyaEvent } from "@/components/kallol/event-view"
import { UpcomingEventsView } from "./list-view"

export const metadata = {
  title: "Puja — Upcoming Pujas and Programmes | Kallol Kali Mandir",
  description:
    "Upcoming pujas at Kallol Kali Mandir, Bangur Nagar, Goregaon West — Amavasya Puja every new moon, Durga Puja, Kali Puja, Lakshmi Puja and Saraswati Puja. Cultural programmes are listed separately.",
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
