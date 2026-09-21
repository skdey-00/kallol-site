import Link from "next/link"
import { Reveal } from "@/components/kallol/reveal"
import type { EventView } from "@/components/kallol/event-view"

/**
 * NOW AT KALLOL, the cover story (Phase 5B).
 *
 * The most relevant upcoming event lands like a magazine feature:
 * enormous date numerals, serif title, real photography, a strong
 * CTA. Secondary events become a ruled calendar rail, quiet rows,
 * not cards, so time-critical information finally has the most
 * presence on the page.
 *
 * Featured selection: first multi-day run or major puja (Durga,
 * Kali, Lakshmi, Saraswati) among next+upcoming; else the next
 * dated event. Store data only, nothing invented.
 */

const MAJOR = ["durga", "kali", "laxmi", "lakshmi", "saraswati"]

function isMajor(title: string): boolean {
  const t = title.toLowerCase()
  return MAJOR.some((m) => t.includes(m))
}

function isFeaturedCandidate(e: EventView): boolean {
  if (e.dateLabel.includes("\u2013")) return true
  return isMajor(e.title)
}

/** "16–21 Oct 2026" → { days: "16–21", month: "Oct", year: "2026" } */
function splitLabel(label: string): { days: string; month: string; year: string } {
  const parts = label.split(" ")
  if (parts.length >= 3) {
    return { days: parts[0], month: parts[1], year: parts[2] }
  }
  return { days: label, month: "", year: "" }
}

/** Proper display name for the featured CTA, derived from its route. */
const HREF_NAMES: Record<string, string> = {
  "/durga-puja": "Durga Puja",
  "/kali-puja": "Kali Puja",
  "/lakshmi-puja": "Lakshmi Puja",
  "/saraswati-puja": "Saraswati Puja",
  "/amavasya-puja": "Amavasya Puja",
  "/special-puja": "the special pujas",
  "/poila-baishak": "Poila Baishakh",
  "/rabindranath-tagore-birthday": "Rabindra Jayanti",
  "/upcoming-events": "the programme",
}

export function NowAtKallol({
  next,
  upcoming,
}: {
  next: EventView | null
  upcoming: EventView[]
}) {
  const pool = next ? [next, ...upcoming] : upcoming
  const featured = pool.find(isFeaturedCandidate) ?? next

  return (
    <section aria-labelledby="now-heading" className="bg-ivory">
      <div className="container py-10 md:py-12 lg:py-16">
        <div className="max-w-4xl">
          {/* ── Cover story ─────────────────────────────────── */}
          <Reveal>
            {featured ? (
              <article>
                <p className="section-eyebrow">Now at Kallol</p>
                <div className="group mt-6">
                  <Link
                    href={featured.href}
                    className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-600 focus-visible:ring-offset-4 focus-visible:ring-offset-ivory"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src="/assets/kali-mandir-deity-1600-featured.webp"
                        alt="Maa Kali at the Kallol Kali Mandir sanctum"
                        width={1200}
                        height={800}
                        loading="lazy"
                        decoding="async"
                        className="reveal-img img-breathe aspect-[3/2] w-full object-cover"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute bottom-0 right-0 hidden select-none p-5 md:block"
                      >
                        <p className="font-display text-date-xl leading-none text-ivory drop-shadow-[0_2px_12px_rgba(14,14,42,0.55)]">
                          {splitLabel(featured.dateLabel).days}
                          <span className="ml-2 align-baseline font-sans text-caption font-semibold uppercase tracking-caps text-ivory/90">
                            {splitLabel(featured.dateLabel).month}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
                <h2 id="now-heading" className="sr-only">
                  Now at Kallol
                </h2>
                <p className="mt-8 font-display text-statement text-ink">
                  <Link
                    href={featured.href}
                    className="link-editorial hover:text-kallol-700"
                  >
                    {featured.title}
                  </Link>
                </p>
                <p className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm text-ink-soft">
                  <span className="font-semibold text-kallol-700">
                    {featured.dateLabel}
                  </span>
                  {featured.time ? <span>{featured.time}</span> : null}
                  {featured.location ? (
                    <span className="text-ink-mute">{featured.location}</span>
                  ) : null}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href={featured.href} className="btn-primary">
                    Explore {HREF_NAMES[featured.href] ?? "the event"}
                  </Link>
                </div>
              </article>
            ) : (
              <div className="max-w-prose">
                <h2 id="now-heading" className="section-title">
                  The year at Kallol
                </h2>
                <p className="mt-6 leading-relaxed text-ink-soft">
                  Pujas and observances are added to the calendar as the
                  committee announces them. See the full picture on the{" "}
                  <Link
                    href="/calendar"
                    className="link-editorial text-kallol-700"
                  >
                    Puja Calendar
                  </Link>
                  .
                </p>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
