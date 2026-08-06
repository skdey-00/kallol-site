"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export function Footer() {
  const { user, logout } = useAuth()

  return (
    <footer className="bg-[#44233b] text-white/80">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-5 text-white">Contact Us</h3>
            <p className="mb-2 flex items-center gap-2">
              <Phone className="h-4 w-4 text-white/60" />
              <a href="tel:+918658852917" className="hover:text-white transition-colors">+91-8655852917</a>
            </p>
            <p className="mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4 text-white/60" />
              <a href="mailto:info@kallolmumbai.com" className="hover:text-white transition-colors">info@kallolmumbai.com</a>
            </p>
            <p className="mb-2 flex items-start gap-2">
              <MapPin className="h-4 w-4 text-white/60 mt-1" />
              <span>Kallol Kali Mandir, Bangur Nagar,<br />Goregaon West, Mumbai - 400104</span>
            </p>
            <div className="flex space-x-4 mt-4">
              <Link
                href="https://www.facebook.com/kallolkalimandir/"
                target="_blank"
                className="text-white/60 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/kallolkalimandir/"
                target="_blank"
                className="text-white/60 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://x.com/KallolMumbai"
                target="_blank"
                className="text-white/60 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
            <div className="mt-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-white/70">Welcome, {user.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="border-white/30 text-white/80 hover:bg-white/10 bg-transparent"
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
                  className="border-white/30 text-white/80 hover:bg-white/10 bg-transparent"
                >
                  <Link href="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Events */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-white">Events</h3>
            <ul className="space-y-2">
              <li><Link href="/facilities-services" className="hover:text-white transition-colors">Facility For Events</Link></li>
              <li><Link href="/photos" className="hover:text-white transition-colors">Gallery</Link></li>
              <li><Link href="/videos" className="hover:text-white transition-colors">Videos</Link></li>
              <li><Link href="/poila-baishak" className="hover:text-white transition-colors">Poila Baishak</Link></li>
              <li><Link href="/rabindranath-tagore-birthday" className="hover:text-white transition-colors">Rabindra Jayanti</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-white">Info</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Kallol</Link></li>
              <li><Link href="/calendar" className="hover:text-white transition-colors">2025 Puja Calendar</Link></li>
              <li><Link href="/managing-committee" className="hover:text-white transition-colors">Managing Committee</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Puja */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-white">Puja</h3>
            <ul className="space-y-2">
              <li><Link href="/amavasya-puja-2025" className="hover:text-white transition-colors">Amavasya Puja 2025</Link></li>
              <li><Link href="/durga-puja-2025" className="hover:text-white transition-colors">Durga Puja 2025</Link></li>
              <li><Link href="/kali-puja-2025" className="hover:text-white transition-colors">Kali Puja 2025</Link></li>
              <li><Link href="/lakshmi-puja-2025" className="hover:text-white transition-colors">Lakshmi Puja</Link></li>
              <li><Link href="/saraswati-puja-2025" className="hover:text-white transition-colors">Saraswati Puja 2025</Link></li>
              <li><Link href="/special-puja" className="hover:text-white transition-colors">Special Puja</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center text-white/50 text-xs tracking-wide">
          <p>COPYRIGHT &copy; 2025, KALLOL KALI MANDIR, GOREGAON, MUMBAI. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  )
}
