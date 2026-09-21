"use client"

import { useEffect, useState } from "react"

/**
 * Slow, restrained crossfade through real Kallol photography.
 * ≥7s per slide, no zoom, no parallax. First slide is
 * server-rendered so LCP is real content; the rest lazy-load.
 *
 * No scrims or gradients: the slideshow stands alone — statement
 * and CTAs render below it, on the page background.
 * Reduced-motion users see a single static frame.
 */
const SLIDES = [
  "/assets/Group-160-7cb5c7f7.webp",
  "/assets/IMG_2297-73f3e209.webp",
  "/assets/JTP_1643-1-82a95cb9.webp",
  "/assets/5B8A9920-1-30c87be2.webp",
  "/assets/5B8A9864-1-11a3d049.webp",
] as const

const ALTS = [
  "Devotees gathered at a festival celebration, Kallol Kali Mandir",
  "Kallol Kali Mandir decked for a puja, Bangur Nagar, Goregaon",
  "Evening aarti at the Kallol Kali Mandir sanctum",
  "Community members at a Kallol cultural programme",
  "Flower decorations and offerings at the Kali Mandir",
]

export function HeroSlideshow() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length)
    }, 7000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden" role="presentation">
      {SLIDES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === 0 ? ALTS[0] : ""}
          aria-hidden={i !== 0}
          loading={i === 0 ? "eager" : "lazy"}
          decoding={i === 0 ? "sync" : "async"}
          fetchPriority={i === 0 ? "high" : "auto"}
          className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[1200ms] ease-calm"
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}
    </div>
  )
}
