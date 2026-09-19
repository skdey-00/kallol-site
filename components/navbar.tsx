"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"

// Phase 4 IA: intent-based navigation. Five questions cover every major
// journey: What is Kallol? / What's happening? / What does Kallol do for the
// community? / Show me photos & past events. / How do I book, offer or donate?
const navGroups = [
  {
    name: "About",
    href: "/about",
    children: [
      { name: "Our Story", href: "/about" },
      { name: "Kallol Kali Mandir", href: "/kallol-kali-mandir" },
      { name: "Managing Committee", href: "/managing-committee" },
    ],
  },
  {
    name: "Puja & Events",
    href: "/upcoming-events",
    children: [
      { name: "Upcoming Events", href: "/upcoming-events" },
      { name: "Puja Calendar", href: "/calendar" },
      { name: "Amavasya Puja", href: "/amavasya-puja" },
      { name: "Durga Puja", href: "/durga-puja" },
      { name: "Kali Puja", href: "/kali-puja" },
      { name: "Lakshmi Puja", href: "/lakshmi-puja" },
      { name: "Saraswati Puja", href: "/saraswati-puja" },
      { dropdownDivider: true },
      { name: "Cultural Events", href: "/poila-baishak" },
      { name: "Rabindra Jayanti", href: "/rabindranath-tagore-birthday" },
      { name: "Special Pujas", href: "/special-puja" },
      { name: "Past Events", href: "/archives" },
    ],
  },
  {
    name: "Community",
    href: "/facilities-services",
    children: [
      { name: "Facilities & Services", href: "/facilities-services" },
      { name: "Library", href: "/library-services" },
      { name: "Medical Services", href: "/medical-services" },
      { name: "Medical Camp 2025", href: "/medical-camp" },
    ],
  },
  {
    name: "Gallery",
    href: "/photos",
    children: [
      { name: "Photos", href: "/photos" },
      { name: "Videos", href: "/videos" },
      { name: "Past Events", href: "/archives" },
    ],
  },
  {
    name: "Services",
    href: "/donate",
    children: [
      { name: "Puja Booking & Donations", href: "/donate" },
      { name: "Facility Booking", href: "/facilities-services" },
    ],
  },
  { name: "Contact", href: "/contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()
  const { totalItems, hydrated } = useCart()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close the mobile menu on route change (links also close it inline).
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const toggleMenu = () => setIsOpen(!isOpen)

  /** A group is active when the current route is its landing page or one
      of its children (Phase 4 IA trail). */
  const isGroupActive = (group: (typeof navGroups)[number]) => {
    if (pathname === group.href) return true
    return group.children?.some((c) => "href" in c && pathname === c.href) ?? false
  }

  const extraLinks = [
    ...(user && (user.membershipType === "volunteer" || user.email === "admin@kallol.org")
      ? [{ name: "Volunteer", href: "/volunteer" }]
      : []),
    ...(user?.email === "admin@kallol.org" ? [{ name: "Admin", href: "/admin" }] : []),
  ]

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ease-calm ${
        scrolled ? "bg-ivory-raised/95 shadow-raised backdrop-blur-sm" : "bg-ivory-raised border-b border-stone-line"
      }`}
    >
      {/* Top bar */}
      <div className="bg-kallol-950 text-xs tracking-caps">
        <div className="container mx-auto px-4 flex justify-between items-center h-10">
          <div className="flex gap-6">
            <a href="tel:+918655852917" className="text-ivory/80 hover:text-ivory transition-colors duration-200">
              ☎ +91-8655852917
                        </a>
            <a href="mailto:info@kallolmumbai.com" className="text-ivory/80 hover:text-ivory transition-colors duration-200 hidden sm:block">
              ✉ info@kallolmumbai.com
            </a>
          </div>
          <a
            href="https://x.com/KallolMumbai"
            target="_blank"
            rel="noreferrer"
            className="text-ivory/80 hover:text-ivory transition-colors duration-200 hidden sm:block"
          >
            Follow us on 𝕏
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Canonical logo — exact asset, locked ratio, clear space right */}
          <Link href="/" aria-label="Kallol — home" className="flex items-center pr-4 md:pr-8">
            <BrandLogo size="md" className="md:hidden" />
            <BrandLogo size="lg" className="hidden md:block" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            {navGroups.map((group) => (
              <div key={group.name} className="relative group">
                <Link
                  href={group.href}
                  aria-current={isGroupActive(group) ? "page" : undefined}
                  className="flex items-center gap-1 px-3 py-2 text-ink hover:text-kallol-600 transition-colors duration-200 ease-calm font-sans font-semibold text-sm"
                >
                  {group.name}
                  {group.children && group.children.length > 0 && (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Link>
                {/* Active indicator — echoes the logo's linked baseline */}
                <span
                  aria-hidden="true"
                  className={`absolute left-3 right-3 -bottom-0.5 h-0.5 bg-kallol-600 origin-left transition-transform duration-300 ease-calm ${
                    isGroupActive(group)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
                {group.children && group.children.length > 0 && (
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 ease-calm min-w-[220px]">
                    <div className="bg-ivory-raised shadow-dropdown rounded-md border-t-2 border-kallol-600 py-2">
                      {group.children.map((child) =>
                        "dropdownDivider" in child ? (
                          <div key="divider" className="border-t border-stone-line my-2" />
                        ) : (
                          <Link
                            key={child.name}
                            href={child.href}
                            aria-current={pathname === child.href ? "page" : undefined}
                            className={`block px-4 py-2 text-sm transition-colors duration-200 border-b border-stone-line last:border-0 ${
                              pathname === child.href
                                ? "bg-kallol-600 text-ivory"
                                : "text-ink-soft hover:bg-kallol-600 hover:text-ivory"
                            }`}
                          >
                            {child.name}
                          </Link>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {extraLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3 py-2 text-ink hover:text-kallol-600 transition-colors duration-200 ease-calm font-sans font-semibold text-sm"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/cart"
              aria-label={`Cart${hydrated && totalItems > 0 ? ` (${totalItems} items)` : ""}`}
              className="relative px-2 py-2 text-ink hover:text-kallol-600 transition-colors duration-200 ease-calm"
            >
              <ShoppingCart className="h-5 w-5" />
              {hydrated && totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-kallol-600 px-1 text-[10px] font-bold text-ivory">
                  {totalItems}
                </span>
              )}
            </Link>
            <Button
              asChild
              className="bg-kallol-600 hover:bg-kallol-700 text-ivory ml-2 rounded-md px-5 py-2 text-xs font-sans font-semibold uppercase tracking-caps transition-colors duration-200 ease-calm"
            >
              <Link href="/donate">Donate Now</Link>
            </Button>
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="flex lg:hidden items-center">
            <Link
              href="/cart"
              aria-label={`Cart${hydrated && totalItems > 0 ? ` (${totalItems} items)` : ""}`}
              className="relative px-2 py-2 text-ink hover:text-kallol-600 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {hydrated && totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-kallol-600 px-1 text-[10px] font-bold text-ivory">
                  {totalItems}
                </span>
              )}
            </Link>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMenu}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="border-kallol-600 text-kallol-700 hover:bg-kallol-50 bg-transparent ml-1"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu — CSS motion (menu-enter), no JS library.
          Kept mounted-but-hidden when closed so content stays in the a11y
          tree predictably; inert when closed. */}
      <div
        id="mobile-menu"
        hidden={!isOpen}
        className="lg:hidden bg-ivory-raised border-t border-stone-line overflow-y-auto max-h-[85dvh] menu-enter"
      >
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col">
            {navGroups.map((group) => (
              <div key={group.name} className="border-b border-stone-line py-1">
                <Link
                  href={group.href}
                  className="text-ink hover:text-kallol-600 py-3 transition-colors duration-200 font-sans font-semibold block"
                  onClick={() => setIsOpen(false)}
                >
                  {group.name}
                </Link>
                {group.children && (
                  <div className="pl-4 pb-2">
                    {group.children.map((child) =>
                      "dropdownDivider" in child ? (
                        <div key="m-divider" className="border-t border-stone-line my-2" />
                      ) : (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="text-ink-soft hover:text-kallol-600 py-2.5 text-sm block transition-colors duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ),
                    )}
                  </div>
                )}
              </div>
            ))}
            {extraLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-ink hover:text-kallol-600 py-3 transition-colors duration-200 font-sans font-semibold border-b border-stone-line"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/cart"
              className="text-ink hover:text-kallol-600 py-3 transition-colors duration-200 font-sans font-semibold border-b border-stone-line flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCart className="h-5 w-5" />
              Cart
              {hydrated && totalItems > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-kallol-600 px-1.5 text-[10px] font-bold text-ivory">
                  {totalItems}
                </span>
              )}
            </Link>
            <Button
              asChild
              className="bg-kallol-600 hover:bg-kallol-700 text-ivory mt-4 rounded-md py-3 font-sans font-semibold uppercase tracking-caps transition-colors duration-200 ease-calm"
            >
              <Link href="/donate" onClick={() => setIsOpen(false)}>Donate Now</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
