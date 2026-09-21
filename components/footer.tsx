import Link from "next/link"
import { Facebook, Instagram, Mail, Phone, MapPin, Clock } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"

/**
 * Footer (UX plan Phase 8).
 *
 * Task-focused and compact: contact details with directions, mandir
 * timings, the two time-sensitive puja links, Donate, and a short
 * explore list. Festival pages live in the main navigation and the
 * calendar, so they are not repeated here. Text opacities keep WCAG
 * AA contrast on kallol-950 (ivory/60 ≈ 6:1 for the smallest text).
 */

const TIMINGS = (
  <>
    Morning 6:00 AM &ndash; 12:30 PM · Evening 5:00 PM &ndash; 9:00 PM
    <br />
    <span className="text-ivory/60">
      (Tue, Sat &amp; Sun until 1:00 PM / 9:30 PM)
    </span>
  </>
)

export function Footer() {
  return (
    <footer className="bg-kallol-950 text-ivory/80">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Contact & directions */}
          <div>
            {/* Canonical logo, same exact asset as the navbar. The ivory chip
                carries the blue logo on the dark ground. */}
            <Link href="/" aria-label="Kallol, home" className="inline-block mb-6">
              <span className="inline-block rounded-lg bg-ivory px-4 py-3">
                <BrandLogo size="md" />
              </span>
            </Link>
            <p className="mb-2 flex items-center gap-2">
              <Phone className="h-4 w-4 text-ivory/60" aria-hidden="true" />
              <a href="tel:+918655852917" className="hover:text-ivory transition-colors duration-200">+91-8655852917</a>
            </p>
            <p className="mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4 text-ivory/60" aria-hidden="true" />
              <a href="mailto:info@kallolmumbai.com" className="hover:text-ivory transition-colors duration-200">info@kallolmumbai.com</a>
            </p>
            <p className="mb-2 flex items-start gap-2">
              <MapPin className="h-4 w-4 text-ivory/60 mt-1" aria-hidden="true" />
              <span>
                Kallol Kali Mandir Complex, Bangur Nagar,<br />
                Goregaon West, Mumbai - 400104{" "}
                <a
                  href="https://maps.app.goo.gl/2AbY2NxYEX1fgfWHA"
                  target="_blank"
                  rel="noreferrer"
                  className="link-editorial whitespace-nowrap text-ivory/90 hover:text-ivory"
                >
                  Directions
                </a>
              </span>
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.facebook.com/kallolkalimandir/"
                target="_blank"
                rel="noreferrer"
                aria-label="Kallol on Facebook"
                className="text-ivory/60 hover:text-ivory transition-colors duration-200"
              >
                <Facebook className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://www.instagram.com/kallolkalimandir/"
                target="_blank"
                rel="noreferrer"
                aria-label="Kallol on Instagram"
                className="text-ivory/60 hover:text-ivory transition-colors duration-200"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Timings & time-sensitive actions */}
          <div>
            <h2 className="font-sans text-xs font-semibold uppercase tracking-caps text-ivory/60 mb-5">
              Mandir timings
            </h2>
            <p className="text-sm leading-relaxed">
              <Clock className="mb-1 h-4 w-4 text-ivory/60" aria-hidden="true" />
              {TIMINGS}
            </p>
            <h2 className="font-sans text-xs font-semibold uppercase tracking-caps text-ivory/60 mb-5 mt-8">
              Pujas &amp; participation
            </h2>
            <ul className="space-y-2.5">
              <li><Link href="/upcoming-events" className="hover:text-ivory transition-colors duration-200">Upcoming Events</Link></li>
              <li><Link href="/calendar" className="hover:text-ivory transition-colors duration-200">Puja Calendar</Link></li>
              <li><Link href="/donate" className="hover:text-ivory transition-colors duration-200">Donate</Link></li>
              <li><Link href="/contact" className="hover:text-ivory transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h2 className="font-sans text-xs font-semibold uppercase tracking-caps text-ivory/60 mb-5">
              Explore
            </h2>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="hover:text-ivory transition-colors duration-200">About Kallol</Link></li>
              <li><Link href="/kallol-kali-mandir" className="hover:text-ivory transition-colors duration-200">Kallol Kali Mandir</Link></li>
              <li><Link href="/facilities-services" className="hover:text-ivory transition-colors duration-200">Facilities &amp; Services</Link></li>
              <li><Link href="/library-services" className="hover:text-ivory transition-colors duration-200">Library</Link></li>
              <li><Link href="/medical-services" className="hover:text-ivory transition-colors duration-200">Medical Services</Link></li>
              <li><Link href="/photos" className="hover:text-ivory transition-colors duration-200">Photo Gallery</Link></li>
              <li><Link href="/videos" className="hover:text-ivory transition-colors duration-200">Videos</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ivory/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-ivory/60 text-xs tracking-caps">
          <p>COPYRIGHT &copy; {new Date().getFullYear()}, KALLOL KALI MANDIR, GOREGAON, MUMBAI. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-ivory transition-colors duration-200 uppercase">
              Privacy Policy
            </Link>
            <span className="font-bengali text-sm normal-case" lang="bn">শ্রী শ্রী কালী</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
