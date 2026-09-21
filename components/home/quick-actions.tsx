import Link from "next/link"
import { Reveal } from "@/components/kallol/reveal"

/**
 * QUICK ACTIONS, the task index (UX plan Phase 3).
 *
 * Four common visitor journeys as ruled editorial rows directly
 * below the hero — discovery, booking, visiting and donating are
 * identifiable without scrolling or interpreting the navbar.
 * Type carries the rows (no icon cards); the whole row is the
 * touch target. Two columns on md+, one column on mobile.
 */
const ACTIONS = [
  {
    title: "Upcoming pujas",
    href: "/upcoming-events",
    note: "Dates and timings for every puja and festival",
    cue: "Calendar",
  },
  {
    title: "Book or sponsor a puja",
    href: "/donate",
    note: "Offerings and sponsorship for specific pujas",
    cue: "Book",
  },
  {
    title: "Visit the mandir",
    href: "/contact",
    note: "Timings, directions and how to reach Bangur Nagar",
    cue: "Visit",
  },
  {
    title: "Donate",
    href: "/donate#general-donation",
    note: "Support the mandir with a general contribution",
    cue: "Donate",
  },
]

export function QuickActions() {
  return (
    <section aria-labelledby="quick-actions-heading" className="bg-stone-paper">
      <div className="container py-10 md:py-12">
        <Reveal>
          <div className="rule-draw h-px bg-kallol-600/60" aria-hidden="true" />
          <h2 id="quick-actions-heading" className="section-eyebrow mt-6">
            What would you like to do?
          </h2>
          <ul className="mt-4 md:grid md:grid-cols-2 md:gap-x-12">
            {ACTIONS.map((action) => (
              <li key={action.cue}>
                <Link
                  href={action.href}
                  className="group flex items-center justify-between gap-6 border-b border-stone-line py-4 transition-colors hover:bg-kallol-50/60 md:py-5"
                >
                  <span className="min-w-0">
                    <span className="block font-display text-h3 text-ink transition-colors group-hover:text-kallol-700">
                      {action.title}
                    </span>
                    <span className="mt-1 block text-sm text-ink-mute">
                      {action.note}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-caption uppercase tracking-caps text-kallol-700">
                    {action.cue}
                    <span
                      aria-hidden="true"
                      className="text-base transition-transform duration-300 ease-calm group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
