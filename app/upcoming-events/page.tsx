"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UpcomingEventsPage() {
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

  const upcomingEvents = [
    {
      id: 1,
      title: "Durga Puja - Maha Navami",
      date: "October 1, 2025",
      time: "All Day",
      location: "Kallol Kali Mandir, Bangur Nagar",
      description:
        "Durga Puja Maha Navami with Kumari Puja. The biggest festival of the Bengali community.",
      image: "/assets/Durga_Puja_Tile-289a4e35.png",
      category: "religious",
      featured: true,
    },
    {
      id: 2,
      title: "Durga Puja - Vijaya Dashami",
      date: "October 2, 2025",
      time: "All Day",
      location: "Kallol Kali Mandir, Bangur Nagar",
      description:
        "Vijaya Dashami with Darpan Visarjan and Sindur Utsav. The grand finale of Durga Puja.",
      image: "/assets/Durga_Puja_Tile-289a4e35.png",
      category: "religious",
      featured: true,
    },
    {
      id: 3,
      title: "Kojagari Purnima - Lakshmi Puja",
      date: "October 6, 2025",
      time: "09:00 PM",
      location: "Kallol Kali Mandir, Bangur Nagar",
      description:
        "Shree Shree Kojagari Laxmi Puja at 9:00 PM. A celebration of prosperity and divine grace.",
      image: "/assets/Lakshmi_Puja_Tile-2a79392d.png",
      category: "religious",
      featured: true,
    },
    {
      id: 4,
      title: "Deepavali Amavasya - Kali Puja",
      date: "October 20, 2025",
      time: "11:00 PM",
      location: "Kallol Kali Mandir, Bangur Nagar",
      description:
        "Shree Shree Mahakali Puja on Deepavali Amavasya at 11:00 PM. The most important Kali Puja of the year.",
      image: "/assets/Kali_Puja_Tile-35f6bb42.png",
      category: "religious",
      featured: true,
    },
    {
      id: 5,
      title: "Amavasya Puja",
      date: "November 19, 2025",
      time: "08:00 PM",
      location: "Kallol Kali Mandir, Bangur Nagar",
      description:
        "Monthly Amavasya Puja dedicated to Maa Kali with Khichdi Bhog distribution.",
      image: "/assets/Amabasya_Puja_Tile-f954983b.png",
      category: "religious",
      featured: false,
    },
    {
      id: 6,
      title: "Amavasya Puja",
      date: "December 19, 2025",
      time: "08:00 PM",
      location: "Kallol Kali Mandir, Bangur Nagar",
      description:
        "Monthly Amavasya Puja dedicated to Maa Kali with Khichdi Bhog distribution.",
      image: "/assets/Amabasya_Puja_Tile-f954983b.png",
      category: "religious",
      featured: false,
    },
    {
      id: 7,
      title: "Saraswati Puja",
      date: "January 23, 2026",
      time: "All Day",
      location: "Kallol Kali Mandir, Bangur Nagar",
      description:
        "Saraswati Puja, the worship of Goddess of knowledge, music and arts.",
      image: "/assets/Sarashwati_Puja_Tile-ed17e914.png",
      category: "religious",
      featured: true,
    },
    {
      id: 8,
      title: "Dol Purnima (Holi Utsav)",
      date: "March 3, 2026",
      time: "All Day",
      location: "Kallol Kali Mandir, Bangur Nagar",
      description:
        "Dol Purnima / Holi Utsav celebration with the community.",
      image: "/assets/SpecialPuja-3da3ae1b.png",
      category: "cultural",
      featured: false,
    },
  ]

  const filteredEvents =
    activeTab === "all" ? upcomingEvents : upcomingEvents.filter((event) => event.category === activeTab)

  const featuredEvents = upcomingEvents.filter((event) => event.featured)

  return (
    <main className="min-h-screen pt-20 pb-16 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#44233b] mb-4">
            Puja &amp; <span className="text-kallol-700">Events</span>
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Join us for upcoming pujas and events at Kallol Kali Mandir in Bangur Nagar, Goregaon West. Mark
            your calendars and be part of our vibrant community celebrations.
          </p>
        </motion.div>

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
                      <Button className="bg-kallol-700 hover:bg-kallol-800 text-white mt-auto self-start shadow-md">
                        Event Details
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="bg-white border-2 border-kallol-700 p-1">
                <TabsTrigger value="all" className="data-[state=active]:bg-kallol-700 data-[state=active]:text-white">
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="religious"
                  className="data-[state=active]:bg-kallol-700 data-[state=active]:text-white"
                >
                  Religious
                </TabsTrigger>
                <TabsTrigger
                  value="cultural"
                  className="data-[state=active]:bg-kallol-700 data-[state=active]:text-white"
                >
                  Cultural
                </TabsTrigger>
              </TabsList>
            </Tabs>
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
                      href={`/upcoming-events`}
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
