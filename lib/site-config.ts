// Central site-wide constants for year-sensitive content.
// Update CURRENT_YEAR once per year here instead of editing dozens of components.

/** The current calendar year the site content is maintained for. */
export const CURRENT_YEAR = 2026

/** Neutral label used when a festival/event date has not been announced yet. */
export const DATE_TBA = "Date to be announced"

/** Label for schedules that the committee will publish for the upcoming season. */
export const SCHEDULE_TBA = "Schedule to be updated"

/** The latest puja-calendar year published by Kallol (used for archive labelling). */
export const LAST_PUBLISHED_CALENDAR_YEAR = 2026

/**
 * Prefix used to clearly mark historical schedule blocks on evergreen pages,
 * e.g. "Last celebrated: Oct 20, 2025 (Deepavali Amavasya)".
 */
export function archived(label: string): string {
  return `${label} (archive)`
}
