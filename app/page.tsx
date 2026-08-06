import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, Users, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedBanner } from "@/components/animated-banner"
import { FeaturedEvents } from "@/components/featured-events"
import { HeroSection } from "@/components/hero-section"

const pujas = [
  { title: "Amavasya Puja", image: "/assets/Amabasya_Puja_Tile-f954983b.png", href: "/amavasya-puja-2025" },
  { title: "Durga Puja", image: "/assets/Durga_Puja_Tile-289a4e35.png", href: "/durga-puja-2025" },
  { title: "Lakshmi Puja", image: "/assets/Lakshmi_Puja_Tile-2a79392d.png", href: "/lakshmi-puja-2025" },
  { title: "Kali Puja", image: "/assets/Kali_Puja_Tile-35f6bb42.png", href: "/kali-puja-2025" },
  { title: "Saraswati Puja", image: "/assets/Sarashwati_Puja_Tile-ed17e914.png", href: "/saraswati-puja-2025" },
  { title: "Special Puja", image: "/assets/SpecialPuja-3da3ae1b.png", href: "/special-puja" },
]

const services = [
  { title: "Kallol Kali Mandir", image: "/assets/Kali-Mandir-Tile-20c642f6.png", href: "/kallol-kali-mandir" },
  { title: "Facility for Events", image: "/assets/Events-308ea450.png", href: "/facilities-services" },
  { title: "Medical & Library", image: "/assets/library-de30773d.png", href: "/medical-services" },
  { title: "Puja Calendar", image: "/assets/WhatsApp-Image-2025-09-01-at-12.14.56_2df50f9d-77660215.jpg", href: "/calendar" },
]

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />

      <AnimatedBanner />

      <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Welcome to <span className="text-kallol-700">Kallol</span>
          </h2>

          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-lg text-gray-700 mb-6">
              Kallol has been home to the Bengali Community of Goregaon for over Six decades, providing a platform for
              expression and exposition to Bengali Culture.
            </p>
             <p className="text-lg text-gray-700 mb-6">
              {"The Bengali community in Goregaon is one of the oldest settlements in the north western suburbs of the Bombay city, now Mumbai."}
            </p>
            <p className="text-lg text-gray-700 mb-6">
              {"Kallol had it's humble beginnings in the decision by it\'s founding fathers, to celebrate the Spring Festival, Basanta Panchami with the worship of Maa Saraswati."}
            </p>
            <p className="text-lg text-gray-700 mb-6">
              {"Since then Kallol has come a long way and is now considered an established portal to the community for the Bengalis of the suburbs."}
            </p>
          </div>

          {/* Services Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 mb-12">
            {services.map((service) => (
              <Link key={service.title} href={service.href} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 h-full">
                  <div className="relative h-40">
                    <Image src={service.image} alt={service.title} fill className="object-cover" />
                  </div>
                  <div className="p-3 text-center">
                    <span className="font-semibold text-gray-900 group-hover:text-kallol-700 transition-colors text-sm">
                      {service.title}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Puja Tiles */}
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900">
            Puja &amp; <span className="text-kallol-700">Events</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {pujas.map((puja) => (
              <Link key={puja.title} href={puja.href} className="group text-center">
                <div className="relative h-32 md:h-40 rounded-lg overflow-hidden shadow-md mb-2 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                  <Image src={puja.image} alt={puja.title} fill className="object-cover" />
                </div>
                <span className="font-semibold text-gray-900 group-hover:text-kallol-700 transition-colors text-sm">
                  {puja.title}
                </span>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <Link href="/upcoming-events" className="group">
              <div className="bg-gray-50 rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 h-full flex flex-col items-center text-center">
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
              <div className="bg-gray-50 rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 h-full flex flex-col items-center text-center">
                <div className="bg-kallol-700 text-white p-3 rounded-full mb-4 transition-transform group-hover:scale-110">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Calendar</h3>
                <p className="text-gray-700 mb-4 flex-grow">
                  View our full calendar of events, festivals and celebrations.
                </p>
                <span className="text-kallol-700 inline-flex items-center font-medium">
                  View Calendar
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            <Link href="/about" className="group">
              <div className="bg-gray-50 rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 h-full flex flex-col items-center text-center">
                <div className="bg-kallol-700 text-white p-3 rounded-full mb-4 transition-transform group-hover:scale-110">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">About Us</h3>
                <p className="text-gray-700 mb-4 flex-grow">
                  Learn about our mission, history and community at Kali Mandir.
                </p>
                <span className="text-kallol-700 inline-flex items-center font-medium">
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            <Link href="/donate" className="group">
              <div className="bg-gray-50 rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 h-full flex flex-col items-center text-center">
                <div className="bg-kallol-700 text-white p-3 rounded-full mb-4 transition-transform group-hover:scale-110">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Donate Now</h3>
                <p className="text-gray-700 mb-4 flex-grow">
                  Support our cultural initiatives and the Kali Mandir's community programs with UPI/Paytm donations in
                  INR.
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

      <FeaturedEvents />

      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-gray-50 to-kallol-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Visit Kali Mandir</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Experience the spiritual and cultural richness of the Kali Mandir in Bangur Nagar. Join our community for
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
