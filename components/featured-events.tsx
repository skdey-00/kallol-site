"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { CalendarEvent } from "@/lib/events-store"

const CATEGORY_IMAGES: Record<string, string> = {
  religious: "/assets/Kali_Puja_Tile-35f6bb42.webp",
  cultural: "/assets/SpecialPuja-3da3ae1b.webp",
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}

interface FeaturedEventsProps {
  /** Live events (Google Calendar); falls back to curated defaults when empty */
  events?: CalendarEvent[]
}

export function FeaturedEvents({ events: liveEvents }: FeaturedEventsProps) {
  const fallbackEvents = [
    {
      id: "featured-kali-puja",
      title: "Kali Puja & Deepavali",
      date: "October 20, 2025",
      description:
        "Shree Shree Mahakali Puja on Deepavali Amavasya. Join us for the grand celebration of Kali Puja at the Kali Mandir with traditional rituals and cultural performances.",
      image: "/assets/Kali_Puja_Tile-35f6bb42.webp",
    },
    {
      id: "featured-durga-puja",
      title: "Durga Puja 2025",
      date: "October 1-2, 2025",
      description:
        "Maha Navami and Vijaya Dashami celebrations. Kumari Puja, Darpan Visarjan and Sindur Utsav. The biggest festival of the Bengali community.",
      image: "/assets/Durga_Puja_Tile-289a4e35.webp",
    },
    {
      id: "featured-amavasya",
      title: "Amavasya Puja",
      date: "Monthly",
      description:
        "The monthly Amavasya Puja dedicated to Maa Kali draws thousands of devotees who seek divine blessings and partake in the sacred Khichdi Bhog.",
      image: "/assets/Amabasya_Puja_Tile-f954983b.webp",
    },
    {
      id: "featured-lakshmi",
      title: "Lakshmi Puja (Kojagari)",
      date: "October 6, 2025",
      description:
        "Shree Shree Kojagari Laxmi Puja on the night of the full moon. A celebration of prosperity and divine grace at Kallol Kali Mandir.",
      image: "/assets/Lakshmi_Puja_Tile-2a79392d.webp",
    },
  ]

  const events =
    liveEvents && liveEvents.length > 0
      ? liveEvents.map((event) => ({
          id: event.id,
          title: event.title,
          date: formatDate(event.date),
          description: event.description,
          image: CATEGORY_IMAGES[event.category] ?? "/assets/SpecialPuja-3da3ae1b.webp",
        }))
      : fallbackEvents

  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (autoPlay) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length)
      }, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoPlay, events.length])

  const nextSlide = () => {
    setAutoPlay(false)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length)
  }

  const prevSlide = () => {
    setAutoPlay(false)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length)
  }

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#44233b] mb-4 md:mb-0">
            Featured <span className="text-kallol-700">Puja &amp; Events</span>
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="border-2 border-kallol-700 text-kallol-700 hover:bg-kallol-50 bg-transparent"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="border-2 border-kallol-700 text-kallol-700 hover:bg-kallol-50 bg-transparent"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full"
            >
              <Card className="overflow-hidden border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-64 lg:h-80">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={events[currentIndex].image}
                      alt={events[currentIndex].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <div className="flex items-center text-kallol-700 mb-4">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      <span className="text-sm font-medium">{events[currentIndex].date}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#44233b] mb-4">{events[currentIndex].title}</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">{events[currentIndex].description}</p>
                    <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white shadow-md self-start">
                      <Link href="/upcoming-events">Learn More</Link>
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setAutoPlay(false)
                setCurrentIndex(index)
              }}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-kallol-700" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
