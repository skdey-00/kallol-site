import Link from "next/link"
import { Reveal } from "@/components/kallol/reveal"

/**
 * PARTICIPATE — the dignified closing ask (Phase 5B).
 *
 * One hierarchy, not four tiles: DONATE is the dominant action
 * with a real button; the other genuine ways to take part sit
 * beneath as quiet ruled links. No claims about where funds go,
 * no manipulative language — an invitation, not an advertisement.
 */
const QUIET_ACTIONS = [
  {
    label: "Book a puja",
    href: "/donate",
    note: "Offer a puja in your name and gotra",
  },
  {
    label: "Browse offerings",
    href: "/donate",
    note: "Sponsor Anna Bhog or festival offerings",
  },
  {
    label: "Book a facility",
    href: "/facilities-services",
    note: "Conference hall & campus for functions",
  },
] as const

export function Participate() {
  return (
    <section aria-labelledby="participate-heading" className="bg-kallol-950">
      <div className="container py-16 md:py-24 lg:py-28">
        <Reveal className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* The dominant ask */}
          <div className="lg:col-span-6">
            <p className="section-eyebrow text-kallol-300">Participate</p>
            <h2
              id="participate-heading"
              className="reveal-up mt-6 font-display text-statement text-ivory"
              style={{ ["--reveal-delay" as string]: "60ms" }}
            >
              Take part in the life of Kallol.
            </h2>
            <p
              className="reveal-up mt-5 max-w-prose text-body-lg text-ivory/80"
              style={{ ["--reveal-delay" as string]: "140ms" }}
            >
              Worship, celebrate, serve, or support — there are several ways
              to be part of the community.
            </p>
            <div
              className="reveal-up mt-10 flex flex-wrap items-center gap-6"
              style={{ ["--reveal-delay" as string]: "220ms" }}
            >
              <Link href="/donate" className="btn-primary">
                Donate
              </Link>
              <Link
                href="/contact"
                className="link-editorial text-sm font-semibold uppercase tracking-caps text-ivory/90 transition-colors hover:text-ivory"
              >
                Contact Kallol
              </Link>
            </div>
          </div>

          {/* Quiet ruled links — the other genuine ways in */}
          <div className="lg:col-span-6 lg:pl-12 lg:border-l lg:border-ivory/15">
            <p className="text-caption uppercase tracking-caps text-ivory/50">
              Also
            </p>
            <ul>
              {QUIET_ACTIONS.map((action) => (
                <li key={action.label} className="border-b border-ivory/15">
                  <Link
                    href={action.href}
                    className="group flex items-baseline justify-between gap-6 py-5 transition-colors hover:bg-ivory/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-300 focus-visible:ring-offset-4 focus-visible:ring-offset-kallol-950"
                  >
                    <span className="font-display text-h3 text-ivory transition-colors group-hover:text-kallol-300">
                      {action.label}
                    </span>
                    <span className="text-right text-sm text-ivory/60 transition-colors group-hover:text-ivory/90">
                      {action.note}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
