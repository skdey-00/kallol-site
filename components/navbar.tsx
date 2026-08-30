"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"

const navGroups = [
  {
    name: "Home",
    href: "/",
    children: [
      { name: "About Kallol", href: "/about" },
      { name: "Kallol Kali Mandir", href: "/kallol-kali-mandir" },
      { name: "Facilities & Services", href: "/facilities-services" },
      { name: "Library Services", href: "/library-services" },
      { name: "Medical Services", href: "/medical-services" },
      { name: "Managing Committee", href: "/managing-committee" },
    ],
  },
  {
    name: "Puja & Events",
    href: "/upcoming-events",
    children: [
      { name: "Amavasya Puja 2025", href: "/amavasya-puja-2025" },
      { name: "Durga Puja 2025", href: "/durga-puja-2025" },
      { name: "Kali Puja 2025", href: "/kali-puja-2025" },
      { name: "Lakshmi Puja", href: "/lakshmi-puja-2025" },
      { name: "Saraswati Puja 2025", href: "/saraswati-puja-2025" },
      { name: "Special Puja", href: "/special-puja" },
    ],
  },
  {
    name: "Online Services",
    href: "/calendar",
    children: [
      { name: "2025 Puja Calendar", href: "/calendar" },
      { name: "Puja Offerings", href: "/shop" },
      { name: "Online Puja Booking", href: "/donate" },
      { name: "Other Donation", href: "/donate" },
    ],
  },
  {
    name: "Events",
    href: "/poila-baishak",
    children: [
      { name: "Poila Baishak", href: "/poila-baishak" },
      { name: "Rabindranath Tagore Birthday", href: "/rabindranath-tagore-birthday" },
      { name: "Medical Camp", href: "/medical-camp" },
    ],
  },
  {
    name: "Gallery",
    href: "/photos",
    children: [
      { name: "Photos", href: "/photos" },
      { name: "Videos", href: "/videos" },
    ],
  },
  { name: "Contact Us", href: "/contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()
  const { totalItems, hydrated } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  const extraLinks = [
    ...(user && (user.membershipType === "volunteer" || user.email === "admin@kallol.org")
      ? [{ name: "Volunteer", href: "/volunteer" }]
      : []),
    ...(user?.email === "admin@kallol.org" ? [{ name: "Admin", href: "/admin" }] : []),
  ]

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 shadow-md backdrop-blur-sm" : "bg-white shadow-sm"
      }`}
    >
      {/* Top bar */}
      <div className="bg-gray-50 border-b border-gray-100 text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center h-10">
          <div className="flex gap-6">
            <a href="tel:+918658852917" className="text-gray-700 hover:text-kallol-700 transition-colors">
              ☎ +91-8655852917
            </a>
            <a href="mailto:info@kallolmumbai.com" className="text-gray-700 hover:text-kallol-700 transition-colors hidden sm:block">
              ✉ info@kallolmumbai.com
            </a>
          </div>
          <a
            href="https://x.com/KallolMumbai"
            target="_blank"
            rel="noreferrer"
            className="text-gray-700 hover:text-kallol-700 transition-colors hidden sm:block"
          >
            Follow us on 𝕏
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/kallol-logo-header.jpg"
              alt="Kallol Mumbai"
              className="h-12 md:h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navGroups.map((group) => (
              <div key={group.name} className="relative group">
                <Link
                  href={group.href}
                  className="flex items-center gap-1 px-3 py-2 text-gray-800 hover:text-kallol-700 transition-colors font-semibold text-sm"
                >
                  {group.name}
                  {group.children && group.children.length > 0 && (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Link>
                {group.children && group.children.length > 0 && (
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[220px]">
                    <div className="bg-white shadow-xl rounded-md border-t-2 border-kallol-700 py-2">
                      {group.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-kallol-700 hover:text-white transition-colors border-b border-gray-50 last:border-0"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {extraLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3 py-2 text-gray-800 hover:text-kallol-700 transition-colors font-semibold text-sm"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/cart"
              aria-label={`Cart${hydrated && totalItems > 0 ? ` (${totalItems} items)` : ""}`}
              className="relative px-2 py-2 text-gray-800 hover:text-kallol-700 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {hydrated && totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-kallol-700 px-1 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
            <Button
              asChild
              className="bg-kallol-700 hover:bg-red-500 text-white ml-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wide"
            >
              <Link href="/donate">Donate Now</Link>
            </Button>
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="flex lg:hidden items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMenu}
              className="border-kallol-700 text-kallol-700 hover:bg-kallol-50 bg-transparent"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-y-auto max-h-[80vh]"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col">
                {navGroups.map((group) => (
                  <div key={group.name} className="border-b border-gray-50 py-1">
                    <Link
                      href={group.href}
                      className="text-gray-800 hover:text-kallol-700 py-2 transition-colors font-semibold block"
                      onClick={() => setIsOpen(false)}
                    >
                      {group.name}
                    </Link>
                    {group.children && (
                      <div className="pl-4 pb-2">
                        {group.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="text-gray-600 hover:text-kallol-700 py-1.5 text-sm block"
                            onClick={() => setIsOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {extraLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-800 hover:text-kallol-700 py-2 transition-colors font-semibold border-b border-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/cart"
                  className="text-gray-800 hover:text-kallol-700 py-2 transition-colors font-semibold border-b border-gray-50 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Cart
                  {hydrated && totalItems > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-kallol-700 px-1.5 text-[10px] font-bold text-white">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <Button
                  asChild
                  className="bg-kallol-700 hover:bg-red-500 text-white mt-4 rounded-full py-3 font-bold uppercase"
                >
                  <Link href="/donate" onClick={() => setIsOpen(false)}>Donate Now</Link>
                </Button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
