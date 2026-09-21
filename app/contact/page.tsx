"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // The embed URL is a specific format from Google Maps' "Embed a map" option.
  // If the new short link points to a slightly different location, you might need to
  // generate a new embed URL directly from Google Maps.
  	const googleMapsEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13274.317827296245!2d72.83752767472929!3d19.16408215102074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b65c30fda125%3A0x8725da56052753f8!2sKallol+Kali+Mandir!5e0!3m2!1sen!2sin!4v1554378261303!5m2!1sen!2sin"
  const googleMapsLink = "https://maps.app.goo.gl/2AbY2NxYEX1fgfWHA" // Updated Google Maps direct link


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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Contact <span className="text-kallol-700">Us</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            We'd love to hear from you! Reach out to us for inquiries, support, or to get involved with Kallol and the
            Kali Mandir community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Contact Information */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="border-gray-200 shadow-lg h-full">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <Mail className="h-6 w-6 text-kallol-700 mr-4" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Email Us</h3>
                      <a
                        href="mailto:info@kallolmumbai.com"
                        className="text-gray-700 hover:text-kallol-700 transition-colors"
                      >
                        info@kallolmumbai.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-6 w-6 text-kallol-700 mr-4" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Call Us</h3>
                      <a href="tel:+918655852917" className="text-gray-700 hover:text-kallol-700 transition-colors">
                        +91-8655852917
                                            </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-kallol-700 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Visit Us</h3>
                      <p className="text-gray-700">
                        Kallol Kali Mandir Complex
                        <br />
                        Bangur Nagar, Goregaon West
                        <br />
                        Mumbai - 400104, Maharashtra, India
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Connect on Social Media</h2>
                <div className="flex space-x-6">
                  <Button
                    asChild
                    variant="outline"
                    size="icon"
                    className="border-kallol-700 text-kallol-700 hover:bg-kallol-50 bg-transparent"
                  >
                    <Link href="https://www.facebook.com/kallolkalimandir/" target="_blank" rel="noopener noreferrer">
                      <Facebook className="h-6 w-6" />
                      <span className="sr-only">Facebook</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="icon"
                    className="border-kallol-700 text-kallol-700 hover:bg-kallol-50 bg-transparent"
                  >
                    <Link href="https://www.instagram.com/kallolkalimandir/" target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-6 w-6" />
                      <span className="sr-only">Instagram</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Google Map */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card className="border-gray-200 shadow-lg h-full flex flex-col">
              <CardContent className="p-8 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Location</h2>
                <div className="relative w-full flex-grow rounded-lg overflow-hidden shadow-md mb-6">
                  <iframe
                    src={googleMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Kali Mandir Location"
                  ></iframe>
                </div>
                <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white self-start">
                  <Link href={googleMapsLink} target="_blank" rel="noopener noreferrer">
                    <MapPin className="h-4 w-4 mr-2" />
                    Open in Google Maps
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Feedback/Inquiry Form (Optional - can be added later if needed) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <Card className="border-gray-200 bg-gradient-to-r from-gray-50 to-kallol-50 p-8">
            <CardContent className="p-0">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
              <p className="text-gray-700 max-w-2xl mx-auto mb-6">
                Have a specific question or feedback? Email us directly and we'll get back to you as soon as
                possible.
              </p>
              <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white shadow-md">
                <Link href="mailto:info@kallolmumbai.com">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Us Directly
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
