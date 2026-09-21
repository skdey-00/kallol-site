"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/kallol/page-header"
import { NextAmavasyaDate } from "@/components/kallol/next-amavasya-date"
import type { AmavasyaTarget } from "@/components/kallol/next-amavasya-date"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function UpcomingEventsView({
  amavasya,
}: {
  amavasya: AmavasyaTarget | null
}) {
  const [activeTab, setActiveTab] = useState("all")

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

  // Recurring pujas at Kallol — dated per the Calendar of Events, Bengali year
  // (Bangabda) 1433 (October 2026 - September 2027).
  interface EventCard {
    id: number
    title: string
    date: string
    time: string
    location: string
    description: string
    image: string
    category: string
    featured: boolean
    href: string
    /** Amavasya card only: show the next Amavasya date */
    nextDate?: boolean
  }

  const upcomingEvents: EventCard[] = [
    {
      id: 1,
      title: "Amavasya Puja",
      date: "Every new moon (monthly) — 8:00 PM",
      time: "08:00 PM",
      location: "Kallol Kali Mandir, Bangur Nagar",
      description:
        "Monthly Amavasya Puja dedicated to Maa Kali with Khichdi Bhog distribution. Exact dates are listed on the Puja Calendar.",
      image: "/assets/Amabasya_Puja_Tile-f954983b.png",
      category: "religious",
      featured: true,
      href: "/amavasya-puja",
      nextDate: true,
    },
    {
      id: 2,
      title: "Shree Shree Shanidev Puja",
      date: "Dec 26, Mar 27, Jun 27 & Sep 26 — 7:30 PM",
      time: "07:30 PM",
      location: "Kallol Kali Mandir, Bangur Nagar",
      description:
        "Shree Shree Shanidev Puja (Boro Thakur Puja) at the Kallol campus at 7:30 PM. Next: December 26, 2026.",
      image: "/assets/kali-mandir-banner1-dc6a1673.png",
      category: "religious",
      featured: false,
      href: "/special-puja",
    },
    {
      id: 3,
      title: "Durga Puja 2026",
      date: "Oct 16 - Oct 21, 2026 (Sashti to Dashami)",
      time: "All Day",
      location: "Kallol Kali Mandir, Bangur Nagar",
      description:
        "Durgotsab 2026 — Debir Ghotoke Agaman, Debir Noukaye Gaman. Maha Sashti (Fri, Oct 16) through Vijaya Dashami (Wed, Oct 21): Maha Saptami Sat Oct 17, Maha Ashtami Sun Oct 18, Adhik Ashtami & Sandhi Puja Mon Oct 19 (7:26-8:14 AM), Maha Navami with Kumari Puja and Hom Tue Oct 20, Darpan Visarjan & Sindur Utsav Wed Oct 21. The biggest festival of the Bengali community.",
      image: "/assets/Durga_Puja_Tile-289a4e35.png",
      category: "religious",
      featured: true,
      href: "/durga-puja",
    },
    {
      id: 4,
      title: "Kali Puja (Deepawali Amavasya)",
      date: "Sunday, Nov 8, 2026 — 11:00 PM",
      time: "11:00 PM onwards",
      location: "Kallol Kali Mandir, Bangur Nagar",
      description:
        "Shree Shree Mahakali Puja on Deepawali Amavasya, the most important Kali Puja of the year, starting at 11:00 PM. Annakoot on Tuesday, Nov 10 at 11:00 AM.",
      image: "/assets/Kali_Puja_Tile-35f6bb42.png",
      category: "religious",
      featured: true,
      href: "/kali-puja",
    },
    {
      id: 5,
      title: "Lakshmi Puja (Kojagari Purnima)",
      date: "Sunday, Oct 25, 2026 — 8:00 PM",
      time: "08:00 PM",
      location: "Kallol Kali Mandir, Bangur Nagar",
      description:
        "Shree Shree Kojagari Laxmi Puja on the night of the full moon: Puja 8:00 PM, Pushpanjali 9:00 PM, Bhog Nibedan & Aarti 9:30 PM, Hom 10:30 PM. A celebration of prosperity and divine grace.",
      image: "/assets/Lakshmi_Puja_Tile-2a79392d.png",
      category: "religious",
      featured: true,
      href: "/lakshmi-puja",
    },
    {
      id: 6,
      title: "Saraswati Puja",
      date: "Thursday, Feb 11, 2027",
      time: "All Day",
      location: "Kallol Kali Mandir, Bangur Nagar",
      description:
        "Saraswati Puja, the worship of Goddess of knowledge, music and arts, celebrated each spring (21 Magh, Bangabda 1433).",
      image: "/assets/Sarashwati_Puja_Tile-ed17e914.png",
      category: "religious",
      featured: false,
      href: "/saraswati-puja",
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
        intro="Join us for upcoming pujas at Kallol Kali Mandir in Bangur Nagar, Goregaon West. Mark your calendars and be part of our vibrant community celebrations."
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
            <h2 className="text-2xl md:text-3xl font-bold text-[#44233b] mb-8">
              Featured <span className="text-kallol-700">Events</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden border-gray-200 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative h-64 md:h-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-6 flex flex-col">
                      <div className="flex items-center text-kallol-700 mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">{event.date}</span>
                      </div>
                      {event.nextDate ? (
                        <div className="mb-3">
                          <NextAmavasyaDate target={amavasya} variant="compact" />
                        </div>
                      ) : null}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                      <div className="flex items-center text-gray-600 mb-1">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                      <p className="text-gray-700 mb-4 flex-grow">{event.description}</p>
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
            <h2 className="text-2xl md:text-3xl font-bold text-[#44233b] mb-4 md:mb-0">
              All <span className="text-kallol-700">Events</span>
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-4">
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
                </TabsList>
              </Tabs>
              {/* Cultural events live on their own page now */}
              <Link
                href="/cultural-events"
                className="text-kallol-700 inline-flex items-center font-medium hover:underline"
              >
                Cultural Programmes
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          <motion.div variants={staggerChildren} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <motion.div key={event.id} variants={fadeIn}>
                <Card className="h-full border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col">
                  <div className="relative h-48">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-kallol-700 text-white text-xs px-2 py-1 rounded capitalize">
                      {event.category}
                    </div>
                  </div>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                    <div className="flex items-center text-kallol-700 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">{event.date}</span>
                    </div>
                    {event.nextDate ? (
                      <div className="mb-2">
                        <NextAmavasyaDate target={amavasya} variant="compact" />
                      </div>
                    ) : null}
                    <div className="flex items-center text-gray-600 mb-1">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <p className="text-gray-700 mb-4 flex-grow line-clamp-3">{event.description}</p>
                    <Link
                      href={event.href}
                      className="text-kallol-700 inline-flex items-center font-medium mt-auto hover:underline"
                    >
                      View Details
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
          <Card className="border-gray-200 bg-gradient-to-r from-gray-50 to-kallol-50 p-8">
            <CardContent className="p-0">
              <h2 className="text-2xl md:text-3xl font-bold text-[#44233b] mb-4">Join Our Community</h2>
              <p className="text-gray-700 max-w-2xl mx-auto mb-6">
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
