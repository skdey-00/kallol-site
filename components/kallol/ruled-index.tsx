import Link from "next/link"
import { Reveal } from "./reveal"

/**
 * RuledIndex, the numbered ruled index (Phase 6).
 *
 * The Phase 5B homepage's minor-puja treatment generalized: numbered
 * rows (01–n), hairline in/out, title + optional inline note, date
 * right. Type carries the entries, no images, no cards.
 *
 * Use for: minor pujas, service indexes, any list where entries are
 * peers but not individually photographic.
 * Not for: upcoming events with live dates (EventRail) or past
 * events (ArchiveList).
 */

export interface RuledIndexEntry {
  title: string
  href: string
  /** Inline descriptor shown next to the title on md+ */
  note?: string
  /** Right-aligned metadata, usually a date chip */
  meta?: string
}

export interface RuledIndexProps {
  entries: RuledIndexEntry[]
  /** Footnote rendered below the list */
  footnote?: React.ReactNode
  className?: string
}

export function RuledIndex({ entries, footnote, className }: RuledIndexProps) {
  return (
    <div className={className}>
      <div className="rule-draw h-px bg-stone-line" aria-hidden="true" />
      <ul>
        {entries.map((entry, i) => (
          <li key={entry.href}>
            <Link
              href={entry.href}
              className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-stone-line py-5 transition-colors hover:bg-kallol-50/60"
            >
              <span className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                <span className="w-8 text-caption text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-h3 text-ink transition-colors group-hover:text-kallol-700">
                  {entry.title}
                </span>
                {entry.note && (
                  <span className="hidden text-sm text-ink-mute md:inline">
                    {entry.note}
                  </span>
                )}
              </span>
              {entry.meta && (
                <span className="text-caption uppercase tracking-caps text-ink-mute transition-colors group-hover:text-kallol-700">
                  {entry.meta}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      {footnote && <div className="mt-8 text-sm text-ink-mute">{footnote}</div>}
    </div>
  )
}
