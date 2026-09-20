import Link from "next/link"
import { Reveal } from "./reveal"

/**
 * PageHeader — the standard interior-page header (Phase 6).
 *
 * Replaces the legacy PageBanner (purple #44233b block, centered,
 * framer-motion fade) with the Phase 5B editorial language:
 * eyebrow metadata, serif statement title, a drawing baseline rule,
 * and a breadcrumb trail. Left-aligned, editorial — not a
 * marketing banner.
 *
 * VARIANTS
 *   default — eyebrow + statement title + rule + optional intro
 *             (About, Services, Community pages, Archives…)
 *   image   — adds real photography beside the title (right column
 *             on lg, portrait crop) for puja/mandir pages
 *
 * The global <main> already pads for the fixed navbar, so no negative
 * margins — the header begins flush below it.
 */

export interface Crumb {
  label: string
  href?: string
}

export interface PageHeaderProps {
  /** Small uppercase label above the title, e.g. "Puja" */
  eyebrow?: string
  title: string
  /** One-sentence page introduction, max ~2 lines */
  intro?: string
  /** Breadcrumb trail (omit "Home"; it is prepended automatically) */
  crumbs?: Crumb[]
  /** photography for the image variant */
  image?: { src: string; alt: string }
  /** Section background tone; default ivory */
  tone?: "ivory" | "sun"
  /** Accessible id for the title heading. Defaults to "page-header". */
  headingId?: string
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  crumbs,
  image,
  tone = "ivory",
  headingId = "page-header",
}: PageHeaderProps) {
  const bg = tone === "sun" ? "bg-ivory-sun" : "bg-ivory"
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...(crumbs ?? [])]

  return (
    <header className={bg}>
      <div className="container py-12 md:py-20 lg:py-24">
        {image ? (
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-7">
              <HeaderBody
                eyebrow={eyebrow}
                title={title}
                intro={intro}
                trail={trail}
                headingId={headingId}
              />
            </Reveal>
            <figure className="lg:col-span-5">
              <div className="overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  width={880}
                  height={1100}
                  loading="eager"
                  decoding="async"
                  className="reveal-img aspect-[4/3] w-full object-cover lg:aspect-[4/5]"
                />
              </div>
            </figure>
          </div>
        ) : (
          <Reveal>
            <HeaderBody
              eyebrow={eyebrow}
              title={title}
              intro={intro}
              trail={trail}
              headingId={headingId}
            />
          </Reveal>
        )}
      </div>
    </header>
  )
}

function HeaderBody({
  eyebrow,
  title,
  intro,
  trail,
  headingId,
}: {
  eyebrow?: string
  title: string
  intro?: string
  trail: Crumb[]
  headingId: string
}) {
  return (
    <div className="max-w-3xl">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-caption uppercase tracking-caps">
          {trail.map((crumb, i) => {
            const last = i === trail.length - 1
            return (
              <li key={crumb.label} className="flex items-center gap-2">
                {crumb.href && !last ? (
                  <Link
                    href={crumb.href}
                    className="link-editorial text-ink-mute hover:text-kallol-700"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    aria-current={last ? "page" : undefined}
                    className="text-ink-mute"
                  >
                    {crumb.label}
                  </span>
                )}
                {!last && (
                  <span aria-hidden="true" className="text-ink-faint">
                    →
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
      <h1
        id={headingId}
        className="mt-3 font-display text-statement text-ink md:text-h1"
      >
        {title}
      </h1>
      {intro && (
        <p className="mt-5 max-w-prose text-body-lg leading-relaxed text-ink-soft">
          {intro}
        </p>
      )}
      <div className="rule-draw mt-8 h-px bg-kallol-600/60" aria-hidden="true" />
    </div>
  )
}
