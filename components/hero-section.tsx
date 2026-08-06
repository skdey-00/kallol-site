"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const heroSlides = [
  "/assets/Group-160-7cb5c7f7.webp",
  "/assets/IMG_2297-73f3e209.webp",
  "/assets/JTP_1643-1-82a95cb9.webp",
  "/assets/5B8A9920-1-30c87be2.webp",
  "/assets/5B8A9864-1-11a3d049.webp",
  "/assets/5B8A0782-1-2a544d2e.webp",
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative w-full overflow-hidden bg-[#211521]" style={{ minHeight: "calc(100vh - 0px)" }}>
      <div className="relative w-full" style={{ aspectRatio: "1240 / 578", minHeight: "330px" }}>
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: currentSlide === index ? 1 : 0,
              zIndex: currentSlide === index ? 10 : 1,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide}
              alt={`Kallol Mumbai ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20" />

        <div className="absolute inset-0 z-30 flex items-end">
          <div className="container mx-auto px-4 md:px-6 pb-16 md:pb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                Kallol Kali Mandir
                <span className="block text-2xl md:text-3xl lg:text-4xl mt-2 text-amber-200">
                  Goregaon, Mumbai
                </span>
              </h1>
              <p className="text-base md:text-xl text-white/90 mb-8 max-w-xl drop-shadow">
                Devotion, Puja, Festivals, Community and Service. A cultural cornerstone for the Bengali diaspora in Mumbai for over six decades.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  className="bg-kallol-700 hover:bg-kallol-800 text-white px-8 py-6 rounded-md text-lg shadow-md"
                >
                  <Link href="/upcoming-events">Puja &amp; Events</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/20 px-8 py-6 rounded-md text-lg shadow-sm bg-transparent"
                >
                  <Link href="/about">About Kallol</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              currentSlide === index ? "bg-white w-8" : "bg-white/50"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
