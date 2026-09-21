"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/kallol/page-header"
import { NextAmavasyaDate, amavasyaLongDate } from "@/components/kallol/next-amavasya-date"
import type { AmavasyaTarget } from "@/components/kallol/next-amavasya-date"
import { festivalDateLabel, festivalRun } from "@/components/kallol/event-view"
import type { CalendarEvent } from "@/lib/events-store"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function UpcomingEventsView({
  amavasya,
  saraswati,
  events,
}: {
  amavasya: AmavasyaTarget | null
  /** Next Saraswati Puja from the calendar, falls back to the printed date */
  saraswati: { title: string; date: string; time?: string; location?: string } | null
  /** Calendar events, festival runs derive card dates/times from it */
  events: CalendarEvent[]
}) {
  const [activeTab, setActiveTab] = useState("all")

  // Festival runs from the calendar (title OR description matched across
  // consecutive days), card dates/times follow the published calendar.
  const durgaRun = festivalRun(events, /durga|kalparambh|nabapatrika|saptami|ashtami|nabami|navami|dashami|sandhi puja|darpan|sindoor|sindur|bisarjan|kanakanjali|bijoya|kumari puja|agomoni/i)
  const kaliRun = festivalRun(events, /kali puja|maha kali|annakoot|deepawali|deepavali/i)
  const lakshmiRun = festivalRun(events, /lakshmi|laxmi|kojagari/i)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  // Recurring pujas at Kallol, dated per the Calendar of Events, Bengali year
  // (Bangabda) 1433 (October 2026 - September 2027).
  interface EventCard {
    id: number
    title: string
    date: string
    time: string
    location: string
    description: string
    /** Sub-events rendered one per line instead of inline prose */
    subEvents?: string[]
    image: string
    category: string
    featured: boolean
    href: string
    /** Amavasya card only: show the next Amavasya date */
    nextDate?: boolean
    /** Intrinsic image aspect ratio, containers match it so nothing crops */
    ratio: string
  }

  const upcomingEvents: EventCard[] = [
    {
      id: 1,
      title: "Amavasya Puja",
      date: "Every new moon (monthly)",
      // Time follows the calendar: the next occurrence's start time from the
      // public Google Calendar, not a hardcoded string (which went stale when
      // the committee moved the puja to 9:00 PM).
      time: amavasya?.time ?? "9:00 PM",
      location: "Kallol Kali Mandir Complex, Bangur Nagar",
      description:
        "Monthly Amavasya Puja dedicated to Maa Kali with Khichdi Bhog distribution. Exact dates are listed on the Puja Calendar.",
      image: "/assets/Amabasya_Puja_Tile-f954983b.webp",
      category: "religious",
      featured: true,
      href: "/amavasya-puja",
      nextDate: true,
      ratio: "350 / 500",
    },
    {
      id: 3,
      title: "Durga Puja 2026",
      // Range from the calendar's Durga-day run (Sashti through Dashami)
      date: festivalDateLabel(durgaRun)
        ? `${festivalDateLabel(durgaRun)} (Sashti to Dashami)`
        : "Oct 16 - Oct 21, 2026 (Sashti to Dashami)",
      time: "All Day",
      location: "Kallol Kali Mandir Complex, Bangur Nagar",
      description:
        "Durgotsab 2026, Debir Ghotoke Agaman, Debir Noukaye Gaman, the biggest festival of the Bengali community.",
      subEvents: [
        "Maha Sashti, Fri, Oct 16",
        "Maha Saptami, Sat, Oct 17",
        "Maha Ashtami, Sun, Oct 18",
        "Adhik Ashtami & Sandhi Puja, Mon, Oct 19 (7:26-8:14 AM)",
        "Maha Navami, Kumari Puja & Hom, Tue, Oct 20",
        "Vijaya Dashami, Darpan Visarjan & Sindur Utsab, Wed, Oct 21",
      ],
      image: "/assets/Durga_Puja_Tile-289a4e35.webp",
      category: "religious",
      featured: true,
      href: "/durga-puja",
      ratio: "350 / 500",
    },
    {
      id: 4,
      title: "Kali Puja (Deepawali Amavasya)",
      // Night and time from the calendar's first Kali Puja event
      date: kaliRun[0] ? amavasyaLongDate(kaliRun[0].date) : "Sunday, Nov 8, 2026",
      time: kaliRun[0]?.time ?? "11:00 PM onwards",
      location: "Kallol Kali Mandir Complex, Bangur Nagar",
      description:
        "Shree Shree Mahakali Puja on Deepawali Amavasya, the most important Kali Puja of the year.",
      subEvents: [
        "Maha Kali Puja, Sun, Nov 8, 11:00 PM onwards",
        "Annakoot, Tue, Nov 10, 11:00 AM",
      ],
      image: "/assets/Kali_Puja_Tile-35f6bb42.webp",
      category: "religious",
      featured: true,
      href: "/kali-puja",
      ratio: "350 / 500",
    },
    {
      id: 5,
      title: "Lakshmi Puja (Kojagari Purnima)",
      // Date and time from the calendar's Kojagari Lakshmi Puja events
      date: lakshmiRun[0] ? amavasyaLongDate(lakshmiRun[0].date) : "Sunday, Oct 25, 2026",
      time: lakshmiRun[0]?.time ?? "08:00 PM",
      location: "Kallol Kali Mandir Complex, Bangur Nagar",
      description:
        "Shree Shree Kojagari Laxmi Puja on the night of the full moon, a celebration of prosperity and divine grace.",
      subEvents: [
        "Puja, 8:00 PM",
        "Pushpanjali, 9:00 PM",
        "Bhog Nibedan & Aarti, 9:30 PM",
        "Hom, 10:30 PM",
      ],
      image: "/assets/Lakshmi_Puja_Tile-2a79392d.webp",
      category: "religious",
      featured: true,
      href: "/lakshmi-puja",
      ratio: "350 / 500",
    },
    {
      id: 6,
      title: "Saraswati Puja",
      // Date follows the Google Calendar (all-day event); the printed
      // Bangabda-1433 date is the fallback if the calendar has no entry yet.
      date: saraswati ? amavasyaLongDate(saraswati.date) : "Thursday, Feb 11, 2027",
      time: saraswati?.time ?? "All Day",
      location: "Kallol Kali Mandir Complex, Bangur Nagar",
      description:
        "Saraswati Puja, the worship of Goddess of knowledge, music and arts, celebrated each spring (21 Magh, Bangabda 1433).",
      image: "/assets/Sarashwati_Puja_Tile-ed17e914.webp",
      category: "religious",
      featured: false,
      href: "/saraswati-puja",
      ratio: "350 / 500",
    },
    {
      id: 7,
      title: "Poila Boishakh (Bengali New Year)",
      date: "Thursday, Apr 15, 2027",
      time: "09:00 AM onwards",
      location: "Kallol Kali Mandir Complex, Bangur Nagar",
      description:
        "Bengali New Year 1434 at the Kallol campus, followed by a cultural program and authentic Bengali cuisine.",
      subEvents: [
        "Dashopachar Puja, 9:00 AM",
        "Satyanarayan Puja, 6:00 PM",
        "Kallol Anniversary",
      ],
      image: "/assets/PoilaBoishak-ee6e477f.webp",
      category: "cultural",
      featured: false,
      href: "/poila-baishak",
      ratio: "1 / 1",
    },
    {
      id: 8,
      title: "Rabindra Jayanti",
      date: "Early May (25 Boishakh), date to be announced",
      time: "Evening",
      location: "Kallol Kali Mandir Complex, Bangur Nagar",
      description:
        "Cultural evening of Rabindra Sangeet, recitations and performances honouring Gurudev Rabindranath Tagore.",
      image: "/assets/Final_1_ranbindra_opt1-1-1-55e1cfa0.webp",
      category: "cultural",
      featured: false,
      href: "/rabindranath-tagore-birthday",
      ratio: "569 / 1138",
    },
  ]

  const filteredEvents =
    activeTab === "all" ? upcomingEvents : upcomingEvents.filter((event) => event.category === activeTab)

  const featuredEvents = upcomingEvents.filter((event) => event.featured)

  return (
    <main className="min-h-screen pb-16 bg-ivory">
      <PageHeader
        eyebrow="Puja"
        title="Puja"
        intro="Join us for upcoming pujas and events at Kallol Kali Mandir in Bangur Nagar, Goregaon West. Mark your calendars and be part of our vibrant community celebrations."
        crumbs={[{ label: "Puja", href: "/upcoming-events" }]}
      />
      <div className="container mx-auto">

        {/* Featured Events Section */}
        {featuredEvents.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-kallol-800 mb-8">
              Featured <span className="text-kallol-700">Events</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden border-stone-line hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5">
                    <div
                      className="relative md:col-span-2"
                      style={{ aspectRatio: event.ratio }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-6 flex flex-col md:col-span-3">
                      <div className="flex items-center text-kallol-700 mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">{event.date}</span>
                      </div>
                      {event.nextDate ? (
                        <div className="mb-3">
                          <NextAmavasyaDate target={amavasya} variant="compact" />
                        </div>
                      ) : null}
                      <h3 className="text-xl font-bold text-ink mb-2">
                        {event.nextDate && amavasya ? amavasya.title : event.title}
                      </h3>
                      <div className="flex items-center text-ink-mute mb-1">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-center text-ink-mute mb-3">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                      <div className="flex-grow">
                        <p className="text-ink-soft mb-3">{event.description}</p>
                        {event.subEvents && (
                          <ul className="space-y-1.5 mb-4">
                            {event.subEvents.map((s) => (
                              <li key={s} className="flex items-start gap-2 text-sm text-ink-soft">
                                <span aria-hidden="true" className="text-kallol-500 mt-0.5 text-xs">✦</span>
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <Button
                        asChild
                        className="bg-kallol-700 hover:bg-kallol-800 text-white mt-auto self-start shadow-md"
                      >
                        <Link href={event.href}>Event Details</Link>
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Events Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.3 }}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-kallol-800 mb-4 md:mb-0">
              All <span className="text-kallol-700">Events</span>
            </h2>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="bg-white border-2 border-kallol-700 p-1 h-auto w-full md:w-auto">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-kallol-700 data-[state=active]:text-white py-2.5 px-4"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="religious"
                  className="data-[state=active]:bg-kallol-700 data-[state=active]:text-white py-2.5 px-4"
                >
                  Religious
                </TabsTrigger>
                <TabsTrigger
                  value="cultural"
                  className="data-[state=active]:bg-kallol-700 data-[state=active]:text-white py-2.5 px-4"
                >
                  Cultural
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <motion.div variants={staggerChildren} className="grid grid-cols-1 items-start md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <motion.div key={event.id} variants={fadeIn}>
                <Card className="h-full border-stone-line hover:shadow-lg transition-shadow duration-300 flex flex-col">
                  <div className="relative" style={{ aspectRatio: event.ratio }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-kallol-700 text-white text-xs px-2 py-1 rounded capitalize">
                      {event.category}
                    </div>
                  </div>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-ink mb-2">
                      {event.nextDate && amavasya ? amavasya.title : event.title}
                    </h3>
                    <div className="flex items-center text-kallol-700 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">{event.date}</span>
                    </div>
                    {event.nextDate ? (
                      <div className="mb-2">
                        <NextAmavasyaDate target={amavasya} variant="compact" />
                      </div>
                    ) : null}
                    <div className="flex items-center text-ink-mute mb-1">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center text-ink-mute mb-3">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-ink-soft mb-3 line-clamp-3">{event.description}</p>
                      {event.subEvents && (
                        <ul className="space-y-1.5 mb-4">
                          {event.subEvents.map((s) => (
                            <li key={s} className="flex items-start gap-2 text-sm text-ink-soft">
                              <span aria-hidden="true" className="text-kallol-500 mt-0.5 text-xs">✦</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <Link
                      href={event.href}
                      className="link-editorial text-kallol-700 inline-flex items-center font-medium mt-auto"
                    >
                      View Details
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Card className="border-stone-line bg-kallol-50/60 p-8">
            <CardContent className="p-0">
              <h2 className="text-2xl md:text-3xl font-bold text-kallol-800 mb-4">Join Our Community</h2>
              <p className="text-ink-soft max-w-2xl mx-auto mb-6">
                Want to stay updated on all our events? Join our community and receive regular updates about upcoming
                pujas, festivals, and cultural programs at Kallol Kali Mandir in Bangur Nagar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white shadow-md">
                  <Link href="/contact">Join our community</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-kallol-700 text-kallol-700 hover:bg-kallol-50 shadow-sm bg-transparent"
                >
                  <Link href="/calendar">View Calendar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
