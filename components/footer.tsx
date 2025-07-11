"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export function Footer() {
  const { user, logout } = useAuth()

  return (
    <footer className="bg-kallol-700 text-gray-100">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="relative h-16 w-48 mr-2 bg-white rounded-md p-2">
                <Image src="/images/kallol-logo.png" alt="Kallol Logo" fill className="object-contain" />
              </div>
            </div>
            <p className="mb-4 text-gray-300">
              Preserving and celebrating the rich cultural heritage of Bengal through community events, festivals, and
              educational programs at the Kali Mandir in Bangur Nagar.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#https://www.facebook.com/kallolkalimandir#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://www.instagram.com/kallolkalimandir/"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
            <div className="mt-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-300">Welcome, {user.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="border-kallol-300 text-kallol-300 hover:bg-kallol-600 bg-transparent"
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
                  className="border-kallol-300 text-kallol-300 hover:bg-kallol-600 bg-transparent"
                >
                  <Link href="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/upcoming-events" className="text-gray-300 hover:text-white transition-colors">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="text-gray-300 hover:text-white transition-colors">
                  Calendar
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-gray-300 hover:text-white transition-colors">
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-kallol-300" />
                <span className="text-gray-300">
                  Kali Mandir
                  <br />
                  Bangur Nagar
                  <br />
                  Mumbai, Maharashtra
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-kallol-300" />
                <span className="text-gray-300">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-kallol-300" />
                <span className="text-gray-300">kallolmandir@gmail.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="mb-4 text-gray-300">
              Subscribe to our newsletter to receive updates on upcoming events and cultural programs at the Kali
              Mandir. Donations accepted via UPI and Paytm in Indian Rupees.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded-md bg-kallol-800 border border-kallol-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-kallol-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-white hover:bg-gray-100 text-kallol-700 font-medium py-2 px-4 rounded-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-kallol-600 mt-12 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Kallol - Kali Mandir, Bangur Nagar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
