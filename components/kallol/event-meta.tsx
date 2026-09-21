/**
 * EventMeta, event metadata line (Phase 6).
 *
 * The Phase 5B cover-story metadata treatment: date emphasized in
 * maroon, time and venue muted, one quiet flex line. Used directly
 * under event titles on feature cards and event pages.
 */

export function EventMeta({
  date,
  time,
  location,
  className,
}: {
  date: string
  time?: string
  location?: string
  className?: string
}) {
  return (
    <p className={`flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm text-ink-soft ${className ?? ""}`}>
      <span className="font-semibold text-kallol-700">{date}</span>
      {time && <span>{time}</span>}
      {location && <span className="text-ink-mute">{location}</span>}
    </p>
  )
}
