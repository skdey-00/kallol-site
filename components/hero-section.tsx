"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const { left, top, width, height } = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - left) / width
      const y = (e.clientY - top) / height

      const moveX = (x - 0.5) * 20
      const moveY = (y - 0.5) * 20

      containerRef.current.style.backgroundPosition = `${50 + moveX * 0.5}% ${50 + moveY * 0.5}%`
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bengali-pattern"
      style={{ backgroundSize: "400px 400px", transition: "background-position 0.3s ease-out" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-kallol-500/10 to-kallol-700/10"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Celebrating Bengali
              <span className="text-kallol-700 block mt-2">Culture & Heritage</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl mx-auto lg:mx-0">
              Join Kallol's vibrant community at the Kali Mandir in Bangur Nagar, dedicated to preserving and sharing
              the rich traditions, arts, and festivals of Bengali culture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                className="bg-kallol-700 hover:bg-kallol-800 text-white px-8 py-6 rounded-md text-lg shadow-md"
              >
                <Link href="/upcoming-events">Upcoming Events</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-2 border-kallol-700 text-kallol-700 hover:bg-kallol-50 px-8 py-6 rounded-md text-lg shadow-sm"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[400px] md:h-[500px] w-full">
              <div className="absolute top-0 right-0 w-full h-full bg-kallol-600/10 rounded-full blur-3xl"></div>
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px]">
                  <Image src="/images/kallol-logo.png" alt="Kallol Logo" fill className="object-contain" priority />
                </div>
              </div>
              
              <div className="absolute bottom-4 right-4 rounded-lg overflow-hidden shadow-2xl">
                <div className="relative w-[250px] h-[180px] md:w-[350px] md:h-[250px]">
                  <Image
                    src="/assets/5B8A0782-1-2a544d2e.webp"
                    alt="Kallol Kali Mandir"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  )
}
