import Link from "next/link"
import { ArrowRight, Calendar, Users, Heart, BookOpen, Stethoscope, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedBanner } from "@/components/animated-banner"
import { FeaturedEvents } from "@/components/featured-events"
import { HeroSection } from "@/components/hero-section"
import { getEvents } from "@/actions/events"

// ISR: re-render the home page (with fresh calendar events) every 15 minutes
export const revalidate = 900

const services = [
  {
    title: "Kallol Kali Mandir",
    image: "/assets/Kali-Mandir-Tile-20c642f6.webp",
    href: "/kallol-kali-mandir",
    icon: Building,
  },
  {
    title: "Facility for Events",
    image: "/assets/Events-308ea450.webp",
    href: "/facilities-services",
    icon: Calendar,
  },
  {
    title: "Medical & Library Facility",
    image: "/assets/library-de30773d.webp",
    href: "/medical-services",
    icon: BookOpen,
  },
]

const pujas = [
  { title: "Amavasya Puja", image: "/assets/Amabasya_Puja_Tile-f954983b.webp", href: "/amavasya-puja-2026" },
  { title: "Durga Puja", image: "/assets/Durga_Puja_Tile-289a4e35.webp", href: "/durga-puja-2026" },
  { title: "Lakshmi Puja", image: "/assets/Lakshmi_Puja_Tile-2a79392d.webp", href: "/lakshmi-puja-2026" },
  { title: "Kali Puja", image: "/assets/Kali_Puja_Tile-35f6bb42.webp", href: "/kali-puja-2026" },
  { title: "Saraswati Puja", image: "/assets/Sarashwati_Puja_Tile-ed17e914.webp", href: "/saraswati-puja-2026" },
  { title: "Special Puja", image: "/assets/SpecialPuja-3da3ae1b.webp", href: "/special-puja" },
]

export default async function Home() {
  const events = await getEvents()

  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />

      <AnimatedBanner />

      {/* About Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/home-about-06f92df6.webp"
                alt="About Kallol"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#44233b]">
                About <span className="text-kallol-700">Kallol</span>
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed text-justify">
                Nestled in the heart of Mumbai&apos;s vibrant western suburb of Goregaon, the Bengali community has cultivated a rich cultural tapestry, anchored by the establishment of Kallol, a distinguished social and cultural organization. Born from a collective desire to preserve and celebrate the traditions of Bengal, Kallol was conceived through the humble initiative of its founding members, who first came together to observe Basanta Panchami, the Spring Festival, through the worship of Maa Saraswati.
              </p>
              <Button
                asChild
                className="bg-kallol-700 hover:bg-red-500 text-white rounded-full px-6"
              >
                <Link href="/about">Read More..</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Link key={service.title} href={service.href} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex-1 flex items-center justify-center">
                    <span className="font-semibold text-gray-900 text-center text-sm group-hover:text-kallol-700 transition-colors">
                      {service.title}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Puja & Events Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#44233b]">
            Puja &amp; <span className="text-kallol-700">Events</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {pujas.map((puja) => (
              <Link key={puja.title} href={puja.href} className="group text-center">
                <div className="relative h-40 md:h-48 rounded-lg overflow-hidden shadow-md mb-3 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={puja.image}
                    alt={puja.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-semibold text-gray-900 group-hover:text-kallol-700 transition-colors text-sm">
                  {puja.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FeaturedEvents events={events.slice(0, 6)} />

      {/* Quick Access Cards */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
            <Link href="/upcoming-events" className="group">
              <div className="bg-white rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 h-full flex flex-col items-center text-center">
                <div className="bg-kallol-700 text-white p-3 rounded-full mb-4 transition-transform group-hover:scale-110">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Upcoming Events</h3>
                <p className="text-gray-700 mb-4 flex-grow">
                  Discover our exciting upcoming events at the Kali Mandir.
                </p>
                <span className="text-kallol-700 inline-flex items-center font-medium">
                  View Events
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            <Link href="/calendar" className="group">
              <div className="bg-white rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 h-full flex flex-col items-center text-center">
                <div className="bg-kallol-700 text-white p-3 rounded-full mb-4 transition-transform group-hover:scale-110">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Puja Calendar</h3>
                <p className="text-gray-700 mb-4 flex-grow">
                  View our calendar of upcoming pujas, festivals and celebrations.
                </p>
                <span className="text-kallol-700 inline-flex items-center font-medium">
                  View Calendar
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            <Link href="/about" className="group">
              <div className="bg-white rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 h-full flex flex-col items-center text-center">
                <div className="bg-kallol-700 text-white p-3 rounded-full mb-4 transition-transform group-hover:scale-110">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">About Us</h3>
                <p className="text-gray-700 mb-4 flex-grow">
                  Learn about our mission, history and community at Kallol Kali Mandir.
                </p>
                <span className="text-kallol-700 inline-flex items-center font-medium">
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            <Link href="/donate" className="group">
              <div className="bg-white rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 h-full flex flex-col items-center text-center">
                <div className="bg-kallol-700 text-white p-3 rounded-full mb-4 transition-transform group-hover:scale-110">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Donate Now</h3>
                <p className="text-gray-700 mb-4 flex-grow">
                  Support our cultural initiatives and the Kali Mandir&apos;s community programs.
                </p>
                <span className="text-kallol-700 inline-flex items-center font-medium">
                  Donate
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Visit CTA */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-gray-50 to-kallol-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Visit Kallol Kali Mandir</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Experience the spiritual and cultural richness of the Kali Mandir in Bangur Nagar, Goregaon West. Join our community for
            regular pujas, cultural events, and celebrations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-kallol-700 hover:bg-kallol-800 text-white px-8 py-6 rounded-md text-lg shadow-md"
            >
              <Link href="/upcoming-events">Upcoming Events</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-2 border-kallol-700 text-kallol-700 hover:bg-kallol-50 px-8 py-6 rounded-md text-lg shadow-sm bg-transparent"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
