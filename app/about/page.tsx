"use client"

import { motion } from "framer-motion"
import { PageHeader } from "@/components/kallol/page-header"
import { Heart, Users, MapPin, BookOpen, Stethoscope } from "lucide-react"

/**
 * About page (UX plan Phase 5).
 *
 * Editorial reading flow: short unjustified paragraphs at a prose
 * measure, secondary history in a labelled continuation section,
 * ruled service/facility/impact rows in the shared design language.
 *
 * NOTE — claims pending stakeholder verification (do not present as
 * confirmed figures without content-owner approval):
 *   · "150+ life members"
 *   · "lakhs of well-wishers"
 *   · "thousands of devotees weekly"
 *   · "60+ years of service"
 */

export default function AboutPage() {
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

  const values = [
    {
      icon: Heart,
      title: "Devotion & Faith",
      description: "The Kali Mata Mandir draws thousands of devotees weekly, offering daily Puja and Anna Bhog with profound spiritual dedication.",
    },
    {
      icon: Users,
      title: "Community Unity",
      description: "Over 150 life members and an extended network of lakhs of well-wishers form a strong Bengali community in Goregaon.",
    },
    {
      icon: BookOpen,
      title: "Library & Education",
      description: "A well-curated library with an extensive collection of literature across diverse disciplines for community enrichment.",
    },
    {
      icon: Stethoscope,
      title: "Healthcare Service",
      description: "A charitable homeopathy clinic operates on the premises, serving the community with free medical consultations.",
    },
  ]

  const facilities = [
    {
      image: "/assets/Kali-Mandir-Tile-20c642f6.webp",
      alt: "Kali Mandir",
      title: "Kallol Kali Mandir",
      description:
        "The spiritual heart of the community, hosting daily pujas and the monthly Amavasya Puja with Khichdi Bhog.",
    },
    {
      image: "/assets/library-de30773d.webp",
      alt: "Library",
      title: "Library",
      description:
        "A well-curated library with an extensive collection of literature across diverse disciplines.",
    },
    {
      image: "/assets/Medical-a397b286.webp",
      alt: "Medical Clinic",
      title: "Homeopathy Clinic",
      description:
        "A charitable homeopathy clinic serving the community with free medical consultations.",
    },
  ]

  const impact = [
    {
      figure: "150+",
      label: "Life Members",
      description: "Extended network of lakhs of well-wishers",
    },
    {
      figure: "Thousands",
      label: "Weekly Devotees",
      description: "Visit the Kali Mata Mandir every week",
    },
    {
      figure: "60+",
      label: "Years of Service",
      description: "Serving the Bengali community since inception",
    },
  ]

  return (
    <main className="min-h-screen pb-16 bg-ivory">
      <PageHeader
        eyebrow="About"
        title="About Kallol"
        intro="A Bengali social and cultural organization in Goregaon West, grown from a Saraswati Puja into a mandir, a dispensary, a library, and a community."
        crumbs={[]}
      />
      <div className="container">
        {/* Our Story */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mb-14 lg:mb-20 items-start"
        >
          <div className="relative aspect-[4/3] overflow-hidden lg:sticky lg:top-32">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/home-about-06f92df6.webp"
              alt="About Kallol"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="max-w-prose">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-ink-soft leading-relaxed">
              <p>
                Nestled in the heart of Mumbai&apos;s vibrant western suburb of
                Goregaon, the Bengali community has cultivated a rich cultural
                tapestry, anchored by the establishment of Kallol, a
                distinguished social and cultural organization.
              </p>
              <p>
                Born from a collective desire to preserve and celebrate the
                traditions of Bengal, Kallol was conceived through the humble
                initiative of its founding members, who first came together to
                observe Basanta Panchami, the Spring Festival, through the
                worship of Maa Saraswati.
              </p>
              <p>
                Since its modest inception, Kallol has flourished into a
                prominent institution, supported by over 150 life members and
                an extended network of lakhs of well-wishers. Today, it stands
                as a cultural cornerstone for the Bengali diaspora in Mumbai, a
                sanctuary of devotion and festivity.
              </p>
              <p>
                At the heart of its spiritual endeavors lies the Kali Mata
                Mandir, which draws thousands of devotees weekly. The monthly
                Amavasya Puja, dedicated to Maa Kali, witnesses an overwhelming
                turnout of worshippers who seek divine blessings and partake in
                the sacred Khichdi Bhog.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Kallol today — labelled continuation of the story */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-14 lg:mb-20 border-t border-stone-line pt-10"
        >
          <div className="max-w-prose">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6">
              Kallol today
            </h2>
            <div className="space-y-4 text-ink-soft leading-relaxed">
              <p>
                Kallol is proud to host a range of religious observances
                including Durga Puja, Lakshmi Puja, Saraswati Puja, and various
                other auspicious ceremonies at its temple premises.
              </p>
              <p>
                It has become a spiritual and cultural epicenter not only for
                the Bengali community but also for the broader Hindu populace
                of Goregaon and surrounding areas. Devotees may offer special
                Puja and Anna Bhog daily, with bookings available conveniently
                online.
              </p>
              <p>
                Beyond its religious undertakings, Kallol actively promotes
                cultural enrichment through regular performances, community
                events, and educational initiatives. The organization operates
                a charitable homeopathy clinic on its premises and maintains a
                well-curated library with an extensive collection of
                literature across diverse disciplines.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Our Services, ruled editorial rows */}
        <motion.div initial="hidden" animate="visible" variants={staggerChildren} className="mb-14 lg:mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-ink mb-8">
            Our <span className="text-kallol-700">Services</span>
          </h2>
          <div className="rule-draw h-px bg-stone-line" aria-hidden="true" />
          {values.map((value, index) => (
            <div key={index} className="border-b border-stone-line py-6">
              <p className="text-caption uppercase tracking-caps text-kallol-700">
                {String(index + 1).padStart(2, "0")} · {value.title}
              </p>
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-soft">{value.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Facilities, editorial image-and-text rows */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-14 lg:mb-20"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-ink mb-8">
            Our <span className="text-kallol-700">Facilities</span>
          </h2>
          <div className="rule-draw h-px bg-stone-line" aria-hidden="true" />
          {facilities.map((facility) => (
            <div
              key={facility.title}
              className="flex items-start gap-5 md:gap-10 border-b border-stone-line py-6"
            >
              <div className="relative w-28 md:w-44 shrink-0 aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={facility.image}
                  alt={facility.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="max-w-prose">
                <h3 className="font-display text-h3 text-ink">{facility.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {facility.description}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Community Impact, ruled figures (claims flagged above) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-ink mb-8">
            Community <span className="text-kallol-700">Impact</span>
          </h2>
          <div className="rule-draw h-px bg-stone-line" aria-hidden="true" />
          {impact.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-2 border-b border-stone-line py-6 md:flex-row md:items-baseline md:gap-10"
            >
              <p className="font-display text-4xl md:text-5xl leading-none text-kallol-700 md:w-40 shrink-0">
                {stat.figure}
              </p>
              <div>
                <p className="font-semibold text-ink">{stat.label}</p>
                <p className="mt-1 text-sm text-ink-mute">{stat.description}</p>
              </div>
            </div>
          ))}
          <div className="mt-8 flex items-center text-ink-soft">
            <MapPin className="h-5 w-5 mr-2 shrink-0 text-kallol-700" />
            <span className="text-sm font-medium">
              Kallol Kali Mandir, Bangur Nagar, Goregaon West, Mumbai - 400104
            </span>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
