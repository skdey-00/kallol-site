import Link from "next/link"
import { Reveal } from "./reveal"

/**
 * FeatureRow, full-width ruled row with thumbnail (Phase 6).
 *
 * The Phase 5B homepage community treatment generalized: eyebrow +
 * serif title + body + editorial link left, thumbnail right
 * (thumbnail moves above on mobile). Rows are the Kallol language:
 * hairline in, content carried, hairline out.
 *
 * Use for: service/facility rows, community features, any paired
 * content + image list on interior pages.
 * Not for: peers in a compact index (RuledIndex) or event lists
 * (EventRail).
 */

export interface FeatureRowData {
  eyebrow: string
  title: string
  body: string
  href: string
  linkLabel: string
  image: string
  alt: string
}

export function FeatureRowList({
  rows,
  className,
}: {
  rows: FeatureRowData[]
  className?: string
}) {
  return (
    <Reveal className={className}>
      <div className="rule-draw h-px bg-stone-line" aria-hidden="true" />
      {rows.map((row, i) => (
        <article key={row.eyebrow} className="border-b border-stone-line">
          <Link
            href={row.href}
            className="group grid gap-6 py-8 transition-colors hover:bg-kallol-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-600 focus-visible:ring-offset-4 focus-visible:ring-offset-stone-warm md:grid-cols-12 md:items-center md:gap-10 md:py-10"
          >
            <div className="md:col-span-8 lg:col-span-9">
              <p className="text-caption uppercase tracking-caps text-kallol-700">
                {String(i + 1).padStart(2, "0")} · {row.eyebrow}
              </p>
              <h3 className="mt-2 font-display text-h2 text-ink transition-colors group-hover:text-kallol-700">
                {row.title}
              </h3>
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-soft">
                {row.body}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-kallol-700">
                <span className="link-editorial">{row.linkLabel}</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 ease-calm group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </div>
            <div className="md:col-span-4 lg:col-span-3">
              <div className="overflow-hidden">
                <img
                  src={row.image}
                  alt={row.alt}
                  width={640}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="reveal-img img-breathe aspect-[3/2] w-full object-cover"
                />
              </div>
            </div>
          </Link>
        </article>
      ))}
    </Reveal>
  )
}
