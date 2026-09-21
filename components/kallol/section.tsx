import { Reveal } from "./reveal"

/**
 * Section, the Kallol section primitive (Phase 6).
 *
 * Wraps every interior-page section: <section> with aria-labelledby,
 * a container, the Phase 5B rhythm of section spacing, and the
 * standard head pattern (eyebrow → title → optional intro → rule).
 *
 * The head is typographic and ruled, NOT icon cards, not centered
 * marketing headings. Optional `actions` slot places an editorial
 * link at the right end of the head (as on the homepage puja index).
 *
 * TONES set the editorial rhythm (quiet → loud alternation):
 *   ivory (default) · sun · paper · warm · raised · maroon
 */

type Tone = "ivory" | "sun" | "paper" | "warm" | "raised" | "maroon"

const TONE_CLASS: Record<Tone, string> = {
  ivory: "bg-ivory",
  sun: "bg-ivory-sun",
  paper: "bg-stone-paper",
  warm: "bg-stone-warm/60",
  raised: "bg-ivory-raised",
  maroon: "bg-kallol-950",
}

export interface SectionProps {
  /** id of the section's h2, wired to aria-labelledby */
  labelledBy?: string
  tone?: Tone
  /** Compact sections (py-12/16) vs standard (py-16/24/28) */
  compact?: boolean
  /** Standard section head: eyebrow, title, optional intro, rule */
  eyebrow?: string
  /** Section title, rendered as h2 */
  title?: string
  /** One-to-two-line introduction below the title */
  intro?: string
  /** Editorial link rendered right of the head (e.g. "View all events") */
  actions?: React.ReactNode
  /** When head renders, this id is used for the h2 (required if labelledBy given) */
  id?: string
  children?: React.ReactNode
  className?: string
}

export function Section({
  labelledBy,
  tone = "ivory",
  compact = false,
  eyebrow,
  title,
  intro,
  actions,
  id,
  children,
  className,
}: SectionProps) {
  const pad = compact
    ? "py-12 md:py-16"
    : "py-16 md:py-24 lg:py-28"
  const hasHead = Boolean(eyebrow || title)

  return (
    <section
      id={id}
      aria-labelledby={labelledBy ?? (title ? `${id}-heading` : undefined)}
      className={`${TONE_CLASS[tone]} ${className ?? ""}`}
    >
      <div className={`container ${pad}`}>
        {hasHead && (
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
                {title && (
                  <h2
                    id={labelledBy ?? `${id}-heading`}
                    className={`section-title ${eyebrow ? "mt-3" : ""} ${
                      !eyebrow && !title ? "" : ""
                    }`}
                  >
                    {title}
                  </h2>
                )}
                {intro && (
                  <p className="mt-4 max-w-prose text-body-lg text-ink-soft">
                    {intro}
                  </p>
                )}
              </div>
              {actions && <div className="pb-1">{actions}</div>}
            </div>
            <div className="rule-draw mt-8 h-px bg-kallol-600/60" aria-hidden="true" />
          </Reveal>
        )}
        {children}
      </div>
    </section>
  )
}
