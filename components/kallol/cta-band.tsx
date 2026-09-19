import Link from "next/link"
import { Reveal } from "./reveal"

/**
 * CtaBand — the closing invitation band (Phase 6).
 *
 * The Phase 5B Participate treatment generalized: deep maroon ground,
 * serif statement, one primary action + one quiet editorial link,
 * optional ruled quiet-links column. Dignified close for interior
 * pages — an invitation, not an advertisement. No invented claims
 * about where donations go.
 */

export interface CtaAction {
  label: string
  href: string
}

export function CtaBand({
  eyebrow = "Participate",
  title,
  body,
  primary,
  secondary,
  quietActions,
  className,
}: {
  eyebrow?: string
  title: string
  body?: string
  /** Primary action — rendered as btn-primary */
  primary: CtaAction
  /** Quiet editorial link beside the button */
  secondary?: CtaAction
  /** Ruled quiet links (right column on lg) */
  quietActions?: Array<{ label: string; href: string; note?: string }>
  className?: string
}) {
  return (
    <section aria-labelledby="cta-heading" className={`bg-kallol-950 ${className ?? ""}`}>
      <div className="container py-16 md:py-24 lg:py-28">
        <Reveal className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className={quietActions ? "lg:col-span-6" : "lg:col-span-8"}>
            <p className="section-eyebrow text-kallol-300">{eyebrow}</p>
            <h2
              id="cta-heading"
              className="reveal-up mt-6 font-display text-statement text-ivory"
              style={{ ["--reveal-delay" as string]: "60ms" }}
            >
              {title}
            </h2>
            {body && (
              <p
                className="reveal-up mt-5 max-w-prose text-body-lg text-ivory/80"
                style={{ ["--reveal-delay" as string]: "140ms" }}
              >
                {body}
              </p>
            )}
            <div
              className="reveal-up mt-10 flex flex-wrap items-center gap-6"
              style={{ ["--reveal-delay" as string]: "220ms" }}
            >
              <Link href={primary.href} className="btn-primary">
                {primary.label}
              </Link>
              {secondary && (
                <Link
                  href={secondary.href}
                  className="link-editorial text-sm font-semibold uppercase tracking-caps text-ivory/90 transition-colors hover:text-ivory"
                >
                  {secondary.label}
                </Link>
              )}
            </div>
          </div>

          {quietActions && quietActions.length > 0 && (
            <div className="lg:col-span-6 lg:pl-12 lg:border-l lg:border-ivory/15">
              <p className="text-caption uppercase tracking-caps text-ivory/50">
                Also
              </p>
              <ul>
                {quietActions.map((action) => (
                  <li key={action.label} className="border-b border-ivory/15">
                    <Link
                      href={action.href}
                      className="group flex items-baseline justify-between gap-6 py-5 transition-colors hover:bg-ivory/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-300 focus-visible:ring-offset-4 focus-visible:ring-offset-kallol-950"
                    >
                      <span className="font-display text-h3 text-ivory transition-colors group-hover:text-kallol-300">
                        {action.label}
                      </span>
                      {action.note && (
                        <span className="text-right text-sm text-ivory/60 transition-colors group-hover:text-ivory/90">
                          {action.note}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
