import Link from "next/link"

/**
 * Participate — dignified participation band on deep maroon.
 * Only actions that actually exist: Donate (Instamojo/UPI/Paytm flow),
 * Puja Offerings (shop), Book a Puja (donate/[pujaId] flows), and
 * Facility Booking (contact-driven). No claims about what funds.
 */
const ACTIONS = [
  {
    title: "Donate",
    body: "Support the mandir and Kallol's community activities — online, by UPI, or through Instamojo.",
    href: "/donate",
    label: "Make a donation",
  },
  {
    title: "Puja Offerings",
    body: "Sponsor Anna Bhog, puja materials, or festival offerings through the offerings shop.",
    href: "/shop",
    label: "Browse offerings",
  },
  {
    title: "Book a Puja",
    body: "Offer a special puja in your name and gotra — bookable online, from anywhere.",
    href: "/donate",
    label: "Book a puja",
  },
  {
    title: "Book a Facility",
    body: "The conference hall and campus are available for functions at moderate donation rates.",
    href: "/facilities-services",
    label: "Facility booking",
  },
] as const

export function Participate() {
  return (
    <section aria-labelledby="participate-heading" className="bg-kallol-950">
      <div className="container py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="section-eyebrow text-kallol-300">Participate</p>
            <h2
              id="participate-heading"
              className="section-title mt-3 text-ivory"
            >
              Take part in Kallol
            </h2>
            <p className="mt-4 text-body-lg text-ivory/80">
              Worship, celebrate, serve, or support — there are several ways
              to be part of the community.
            </p>
            <div className="kallol-rule mt-8 hidden lg:flex">
              <span />
            </div>
          </div>

          <div className="lg:col-span-8">
            <ul className="grid gap-px overflow-hidden rounded-md border border-ivory/15 bg-ivory/15 sm:grid-cols-2">
              {ACTIONS.map((action) => (
                <li key={action.title} className="bg-kallol-950">
                  <Link
                    href={action.href}
                    className="group flex h-full flex-col p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-300 focus-visible:ring-offset-2 focus-visible:ring-offset-kallol-950"
                  >
                    <h3 className="font-display text-h3 text-ivory group-hover:text-kallol-300 transition-colors">
                      {action.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ivory/70">
                      {action.body}
                    </p>
                    <span className="mt-4 text-sm font-semibold uppercase tracking-caps text-kallol-300 group-hover:text-ivory transition-colors">
                      {action.label}
                      <span
                        aria-hidden="true"
                        className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
