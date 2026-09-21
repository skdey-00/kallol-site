import Link from "next/link"
import type { EventView } from "./event-view"

/**
 * EventRail, the ruled calendar rail (Phase 6).
 *
 * Quiet bordered rows with the date right-aligned, the exact
 * treatment the Phase 5B homepage established for secondary events
 * ("Also ahead this season"). This is the default way to list
 * upcoming events anywhere on the site: ruled rows, not cards.
 *
 * Use for: upcoming-event sidebars, "also ahead" rails, compact
 * event lists on service/community pages.
 * Not for: past events (use ArchiveList) or a featured event (that
 * is a full editorial feature, not a rail).
 */

export interface EventRailProps {
  label?: string
  events: EventView[]
  /** Links under the rail, e.g. "View all events" */
  footerLinks?: Array<{ label: string; href: string }>
  emptyMessage?: string
  className?: string
}

export function EventRail({
  label,
  events,
  footerLinks,
  emptyMessage = "No further dated events published yet.",
  className,
}: EventRailProps) {
  return (
    <div className={className}>
      <div className="border-t-2 border-kallol-600 pt-6">
        {label && <p className="meta-label">{label}</p>}
        <ul>
          {events.length > 0 ? (
            events.map((event) => (
              <li key={event.id}>
                <Link
                  href={event.href}
                  className="group flex items-baseline justify-between gap-6 border-b border-stone-line py-4 transition-colors hover:bg-kallol-50/60"
                >
                  <span className="text-sm font-medium text-ink transition-colors group-hover:text-kallol-700">
                    {event.title}
                  </span>
                  <span className="whitespace-nowrap text-caption uppercase tracking-caps text-ink-mute transition-colors group-hover:text-kallol-700">
                    {event.dateLabel}
                  </span>
                </Link>
              </li>
            ))
          ) : (
            <li className="border-b border-stone-line py-4 text-sm text-ink-mute">
              {emptyMessage}
            </li>
          )}
        </ul>
        {footerLinks && footerLinks.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="link-editorial text-sm font-semibold text-kallol-700 hover:text-kallol-800"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
