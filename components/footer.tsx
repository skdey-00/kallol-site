"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"
import { useAuth } from "@/hooks/use-auth"

export function Footer() {
  const { user, logout } = useAuth()

  return (
    <footer className="bg-kallol-950 text-ivory/80">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {/* Contact */}
          <div className="lg:col-span-1">
            {/* Canonical logo — same exact asset as the navbar.
                White letters sit inside the maroon petals, so it
                reads correctly on the dark footer without variants. */}
            <Link href="/" aria-label="Kallol — home" className="inline-block mb-6">
              <BrandLogo size="lg" />
            </Link>
            <p className="mb-2 flex items-center gap-2">
              <Phone className="h-4 w-4 text-ivory/50" />
              <a href="tel:+918655852917" className="hover:text-ivory transition-colors duration-200">+91-8655852917</a>
            </p>
            <p className="mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4 text-ivory/50" />
              <a href="mailto:info@kallolmumbai.com" className="hover:text-ivory transition-colors duration-200">info@kallolmumbai.com</a>
            </p>
            <p className="mb-2 flex items-start gap-2">
              <MapPin className="h-4 w-4 text-ivory/50 mt-1" />
              <span>Kallol Kali Mandir, Bangur Nagar,<br />Goregaon West, Mumbai - 400104</span>
            </p>
            <div className="flex space-x-4 mt-4">
              <Link
                href="https://www.facebook.com/kallolkalimandir/"
                target="_blank"
                aria-label="Kallol on Facebook"
                className="text-ivory/60 hover:text-ivory transition-colors duration-200"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/kallolkalimandir/"
                target="_blank"
                aria-label="Kallol on Instagram"
                className="text-ivory/60 hover:text-ivory transition-colors duration-200"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://x.com/KallolMumbai"
                target="_blank"
                aria-label="Kallol on X"
                className="text-ivory/60 hover:text-ivory transition-colors duration-200"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
            <div className="mt-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-ivory/70">Welcome, {user.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="border-ivory/30 text-ivory/80 hover:bg-ivory/10 bg-transparent"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-ivory/30 text-ivory/80 hover:bg-ivory/10 bg-transparent"
                >
                  <Link href="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-caps text-ivory/50 mb-5">Explore</h3>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="hover:text-ivory transition-colors duration-200">About Kallol</Link></li>
              <li><Link href="/kallol-kali-mandir" className="hover:text-ivory transition-colors duration-200">Kallol Kali Mandir</Link></li>
              <li><Link href="/managing-committee" className="hover:text-ivory transition-colors duration-200">Managing Committee</Link></li>
              <li><Link href="/facilities-services" className="hover:text-ivory transition-colors duration-200">Facilities &amp; Services</Link></li>
              <li><Link href="/library-services" className="hover:text-ivory transition-colors duration-200">Library</Link></li>
              <li><Link href="/medical-services" className="hover:text-ivory transition-colors duration-200">Medical Services</Link></li>
            </ul>
          </div>

          {/* Puja */}
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-caps text-ivory/50 mb-5">Puja</h3>
            <ul className="space-y-2.5">
              <li><Link href="/upcoming-events" className="hover:text-ivory transition-colors duration-200">Upcoming Events</Link></li>
              <li><Link href="/calendar" className="hover:text-ivory transition-colors duration-200">Puja Calendar</Link></li>
              <li><Link href="/amavasya-puja" className="hover:text-ivory transition-colors duration-200">Amavasya Puja</Link></li>
              <li><Link href="/durga-puja" className="hover:text-ivory transition-colors duration-200">Durga Puja</Link></li>
              <li><Link href="/kali-puja" className="hover:text-ivory transition-colors duration-200">Kali Puja</Link></li>
              <li><Link href="/lakshmi-puja" className="hover:text-ivory transition-colors duration-200">Lakshmi Puja</Link></li>
              <li><Link href="/saraswati-puja" className="hover:text-ivory transition-colors duration-200">Saraswati Puja</Link></li>
              <li><Link href="/special-puja" className="hover:text-ivory transition-colors duration-200">Special Pujas</Link></li>
              <li><Link href="/archives" className="hover:text-ivory transition-colors duration-200">Past Events</Link></li>
            </ul>
          </div>

          {/* Cultural */}
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-caps text-ivory/50 mb-5">Cultural</h3>
            <ul className="space-y-2.5">
              <li><Link href="/cultural-events" className="hover:text-ivory transition-colors duration-200">Cultural Programmes</Link></li>
              <li><Link href="/poila-baishak" className="hover:text-ivory transition-colors duration-200">Poila Baishakh</Link></li>
              <li><Link href="/rabindranath-tagore-birthday" className="hover:text-ivory transition-colors duration-200">Rabindra Jayanti</Link></li>
            </ul>
          </div>

          {/* Participate */}
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-caps text-ivory/50 mb-5">Participate</h3>
            <ul className="space-y-2.5">
              <li><Link href="/donate" className="hover:text-ivory transition-colors duration-200">Donate</Link></li>
              <li><Link href="/donate" className="hover:text-ivory transition-colors duration-200">Puja Offerings</Link></li>
              <li><Link href="/photos" className="hover:text-ivory transition-colors duration-200">Photo Gallery</Link></li>
              <li><Link href="/videos" className="hover:text-ivory transition-colors duration-200">Videos</Link></li>
              <li><Link href="/facilities-services" className="hover:text-ivory transition-colors duration-200">Book a Facility</Link></li>
              <li><Link href="/contact" className="hover:text-ivory transition-colors duration-200">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-ivory transition-colors duration-200">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ivory/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-ivory/40 text-xs tracking-caps">
          <p>COPYRIGHT &copy; {new Date().getFullYear()}, KALLOL KALI MANDIR, GOREGAON, MUMBAI. ALL RIGHTS RESERVED.</p>
          <span className="font-bengali text-sm normal-case" lang="bn">শ্রী শ্রী কালী</span>
        </div>
      </div>
    </footer>
  )
}
