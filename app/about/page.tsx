"use client"

import { motion } from "framer-motion"
import { Heart, Users, Calendar, MapPin, BookOpen, Stethoscope } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

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

  return (
    <main className="min-h-screen pt-20 pb-16 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto">
        {/* Page Banner */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="relative h-48 md:h-64 w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/kali-mandir-banner1-dc6a1673.webp"
              alt="Kallol Kali Mandir"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#44233b]/80 to-transparent flex items-end justify-center pb-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                About Kallol
              </h1>
            </div>
          </div>
        </motion.div>

        {/* About Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 items-center"
        >
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/home-about-06f92df6.webp"
              alt="About Kallol"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#44233b] mb-6">
              Our Story
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed text-justify">
              Nestled in the heart of Mumbai&apos;s vibrant western suburb of Goregaon, the Bengali community has cultivated a rich cultural tapestry, anchored by the establishment of Kallol, a distinguished social and cultural organization. Born from a collective desire to preserve and celebrate the traditions of Bengal, Kallol was conceived through the humble initiative of its founding members, who first came together to observe Basanta Panchami, the Spring Festival, through the worship of Maa Saraswati.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed text-justify">
              Since its modest inception, Kallol has flourished into a prominent institution, supported by over 150 life members and an extended network of lakhs of well-wishers. Today, it stands as a cultural cornerstone for the Bengali diaspora in Mumbai, a sanctuary of devotion and festivity.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              At the heart of its spiritual endeavors lies the Kali Mata Mandir, which draws thousands of devotees weekly. The monthly Amavasya Puja, dedicated to Maa Kali, witnesses an overwhelming turnout of worshippers who seek divine blessings and partake in the sacred Khichdi Bhog.
            </p>
          </div>
        </motion.div>

        {/* Full text */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <Card className="border-gray-200 bg-white">
            <CardContent className="p-8">
              <p className="text-gray-700 mb-4 leading-relaxed text-justify">
                Kallol is proud to host a range of religious observances including Durga Puja, Lakshmi Puja, Saraswati Puja, and various other auspicious ceremonies at its temple premises. It has become a spiritual and cultural epicenter not only for the Bengali community but also for the broader Hindu populace of Goregaon and surrounding areas. Devotees may offer special Puja and Anna Bhog daily, with bookings available conveniently online.
              </p>
              <p className="text-gray-700 leading-relaxed text-justify">
                Beyond its religious undertakings, Kallol actively promotes cultural enrichment through regular performances, community events, and educational initiatives. The organization operates a charitable homeopathy clinic on its premises and maintains a well-curated library with an extensive collection of literature across diverse disciplines.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Our Values */}
        <motion.div initial="hidden" animate="visible" variants={staggerChildren} className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#44233b] mb-12">
            Our <span className="text-kallol-700">Services</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="border-gray-200 hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="bg-kallol-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <value.icon className="h-8 w-8 text-kallol-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-700 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Facilities */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#44233b] mb-12">
            Our <span className="text-kallol-700">Facilities</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-52">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/Kali-Mandir-Tile-20c642f6.webp" alt="Kali Mandir" className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Kallol Kali Mandir</h3>
                <p className="text-gray-700 text-sm">
                  The spiritual heart of the community, hosting daily pujas and the monthly Amavasya Puja with Khichdi Bhog.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-52">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/library-de30773d.webp" alt="Library" className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Library</h3>
                <p className="text-gray-700 text-sm">
                  A well-curated library with an extensive collection of literature across diverse disciplines.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-52">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/Medical-a397b286.webp" alt="Medical Clinic" className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Homeopathy Clinic</h3>
                <p className="text-gray-700 text-sm">
                  A charitable homeopathy clinic serving the community with free medical consultations.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Community Impact */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#44233b] mb-8">
            Community <span className="text-kallol-700">Impact</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Card className="border-gray-200 bg-white">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-kallol-700 mb-2">150+</div>
                <div className="text-gray-900 font-medium mb-1">Life Members</div>
                <div className="text-gray-600 text-sm">Extended network of lakhs of well-wishers</div>
              </CardContent>
            </Card>
            <Card className="border-gray-200 bg-white">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-kallol-700 mb-2">Thousands</div>
                <div className="text-gray-900 font-medium mb-1">Weekly Devotees</div>
                <div className="text-gray-600 text-sm">Visit the Kali Mata Mandir every week</div>
              </CardContent>
            </Card>
            <Card className="border-gray-200 bg-white">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-kallol-700 mb-2">60+</div>
                <div className="text-gray-900 font-medium mb-1">Years of Service</div>
                <div className="text-gray-600 text-sm">Serving the Bengali community since inception</div>
              </CardContent>
            </Card>
          </div>
          <div className="flex items-center justify-center text-kallol-700">
            <MapPin className="h-5 w-5 mr-2" />
            <span className="font-medium">Kallol Kali Mandir, Bangur Nagar, Goregaon West, Mumbai - 400104</span>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
