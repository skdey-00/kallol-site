/**
 * Presentational event view passed from the homepage server component to the
 * "Now at Kallol" and "Puja index" sections. Derived entirely from
 * data/local-events.json via getEvents() — never hand-authored.
 */
export interface EventView {
  id: string
  title: string
  /** Short date label, e.g. "16–21 Oct 2026" */
  dateLabel: string
  /** Long date label for the featured card, e.g. "Friday, 16 October 2026" */
  longDateLabel?: string
  time?: string
  location?: string
  href: string
  note?: string
  /** ISO date of the first occurrence — ordering only */
  sortKey: string
}
