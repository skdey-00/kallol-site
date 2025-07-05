"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function FeaturedEvents() {
  // Remove the `useState` and `useEffect` for `publicImages`.
  // Remove the `featuredEventImage` constant.
  // Update the `events` array to directly use the static image paths.
  // Remove the conditional rendering for `base64Image` as all images will now be static paths.

  const events = [
    {
      id: 1,
      title: "Kali Puja Celebration",
      date: "November 12, 2025",
      description:
        "Join us for the grand celebration of Kali Puja at the Kali Mandir in Bangur Nagar with cultural performances and traditional rituals.",
      image: "/images/kali-mandir-deity.jpg", // Directly reference the static image
    },
    {
      id: 2,
      title: "Bengali New Year Festival",
      date: "April 14, 2025",
      description:
        "Celebrate Poila Boishakh with traditional music, dance performances, and authentic Bengali cuisine at the Kali Mandir community hall.",
      image: "/images/cultural-event-placeholder.png", // Use new placeholder
    },
    {
      id: 3,
      title: "Rabindra Jayanti",
      date: "May 9, 2025",
      description:
        "Commemorate the birth anniversary of Rabindranath Tagore with poetry recitations, songs, and theatrical performances.",
      image: "/images/event-placeholder-1.png", // Use new placeholder
    },
    {
      id: 4,
      title: "Saraswati Puja",
      date: "February 14, 2025",
      description:
        "Participate in the worship of Goddess Saraswati, the deity of knowledge, music, and arts at the Kali Mandir.",
      image: "/images/temple-exterior-placeholder.png", // Use new placeholder
    },
  ]

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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-0">
            Upcoming <span className="text-kallol-700">Events</span>
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
                    <Image
                      src={events[currentIndex].image || "/placeholder.svg"}
                      alt={events[currentIndex].title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <div className="flex items-center text-kallol-700 mb-4">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      <span className="text-sm font-medium">{events[currentIndex].date}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{events[currentIndex].title}</h3>
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

        {/* Event indicators */}
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
