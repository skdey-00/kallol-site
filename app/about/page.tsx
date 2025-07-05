"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Heart, Users, Calendar, MapPin, BookOpen } from "lucide-react"
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
      title: "Cultural Preservation",
      description: "Dedicated to preserving and promoting the rich cultural heritage of Bengal for future generations.",
    },
    {
      icon: Users,
      title: "Community Unity",
      description: "Building strong bonds within our Bengali community through shared traditions and celebrations.",
    },
    {
      icon: BookOpen,
      title: "Education & Learning",
      description: "Promoting Bengali language, literature, and arts through educational programs and workshops.",
    },
    {
      icon: Calendar,
      title: "Festival Celebrations",
      description: "Organizing authentic Bengali festivals and religious ceremonies with traditional rituals.",
    },
  ]

  const milestones = [
    {
      year: "1985",
      title: "Foundation of Kallol",
      description: "Established as a Bengali cultural organization in Bangur Nagar, Mumbai.",
    },
    {
      year: "1990",
      title: "Kali Mandir Association",
      description: "Became the official cultural organization associated with Kali Mandir, Bangur Nagar.",
    },
    {
      year: "2000",
      title: "Community Hall Construction",
      description: "Built our dedicated community hall for larger cultural events and gatherings.",
    },
    {
      year: "2010",
      title: "Educational Programs Launch",
      description: "Started Bengali language classes and cultural education programs for children.",
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description: "Adapted to digital platforms during the pandemic, reaching Bengali communities worldwide.",
    },
  ]

  return (
    <main className="min-h-screen pt-20 pb-16 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-kallol-700">Kallol</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
            For nearly four decades, Kallol has been the heart of Bengali culture in Bangur Nagar, Mumbai. Associated
            with the sacred Kali Mandir, we are a vibrant community organization dedicated to preserving, celebrating,
            and sharing the rich heritage of Bengal.
          </p>
          <div className="relative h-64 md:h-80 w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
            {/* Check if there's a base64 image for this section */}
            <Image
              src="/images/kali-mandir-deity.jpg"
              alt="Kali Mandir Deity - Goddess Kali"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          <Card className="border-gray-200 bg-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                To preserve, promote, and celebrate Bengali culture, traditions, and values while fostering a strong
                sense of community among Bengali families in Mumbai. We strive to create an environment where our
                cultural heritage thrives and is passed on to future generations through the sacred space of Kali Mandir
                in Bangur Nagar.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                To be the premier Bengali cultural organization in Mumbai, serving as a bridge between traditional
                Bengali values and modern life. We envision a community where every Bengali family feels connected to
                their roots, where children learn their mother tongue, and where the spiritual and cultural essence of
                Bengal flourishes in the heart of the city.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Our Values */}
        <motion.div initial="hidden" animate="visible" variants={staggerChildren} className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Our <span className="text-kallol-700">Values</span>
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

        {/* History & Milestones */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Our <span className="text-kallol-700">Journey</span>
          </h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="bg-kallol-700 text-white px-4 py-2 rounded-lg font-bold text-lg min-w-[80px] text-center">
                  {milestone.year}
                </div>
                <Card className="flex-1 border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                    <p className="text-gray-700">{milestone.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Kali Mandir Connection */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-16"
        >
          <Card className="border-gray-200 bg-gradient-to-r from-kallol-50 to-gray-50">
            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Kali Mandir <span className="text-kallol-700">Connection</span>
                  </h2>
                  <p className="text-gray-700 mb-4">
                    The Kali Mandir in Bangur Nagar is not just our meeting place—it's the spiritual heart of our
                    community. This sacred temple, dedicated to Goddess Kali, serves as the center for our religious
                    ceremonies, cultural events, and community gatherings.
                  </p>
                  <p className="text-gray-700 mb-6">
                    Every major Bengali festival, from Durga Puja to Kali Puja, is celebrated here with traditional
                    fervor. The temple provides a spiritual anchor for our community, connecting us to our roots and to
                    each other.
                  </p>
                  <div className="flex items-center text-kallol-700">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="font-medium">Kali Mandir, Bangur Nagar, Mumbai, Maharashtra</span>
                  </div>
                </div>
                <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
                  {/* Check if there's a base64 image for this section */}
                  <Image
                    src="/images/kali-mandir-deity.jpg"
                    alt="Kali Mandir Interior - Sacred Deity"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Community Impact */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Community <span className="text-kallol-700">Impact</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Card className="border-gray-200 bg-white">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-kallol-700 mb-2">500+</div>
                <div className="text-gray-900 font-medium mb-1">Active Members</div>
                <div className="text-gray-600 text-sm">Bengali families in our community</div>
              </CardContent>
            </Card>
            <Card className="border-gray-200 bg-white">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-kallol-700 mb-2">40+</div>
                <div className="text-gray-900 font-medium mb-1">Annual Events</div>
                <div className="text-gray-600 text-sm">Cultural and religious celebrations</div>
              </CardContent>
            </Card>
            <Card className="border-gray-200 bg-white">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-kallol-700 mb-2">200+</div>
                <div className="text-gray-900 font-medium mb-1">Children Educated</div>
                <div className="text-gray-600 text-sm">In Bengali language and culture</div>
              </CardContent>
            </Card>
          </div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Through our programs and events, we've touched the lives of hundreds of Bengali families, helping them stay
            connected to their cultural roots while building a strong, supportive community in Mumbai.
          </p>
        </motion.div>
      </div>
    </main>
  )
}
