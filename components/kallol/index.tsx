/**
 * Kallol component system (Phase 6).
 *
 * The shared, reusable presentation layer extracted from the Phase
 * 5B homepage, the single visual language every page will consume
 * in Phase 7. Import from "@/components/kallol" or the individual
 * files; both work.
 *
 * Documentation: docs/kallol-component-system.md
 */

export { Reveal } from "./reveal"
export { PageHeader } from "./page-header"
export type { Crumb, PageHeaderProps } from "./page-header"
export { Section } from "./section"
export { Figure } from "./figure"
export { ArrowLink } from "./arrow-link"
export { MetaList } from "./meta-list"
export type { MetaItem } from "./meta-list"
export { RuledIndex } from "./ruled-index"
export type { RuledIndexEntry } from "./ruled-index"
export { FeatureRowList } from "./feature-row"
export type { FeatureRowData } from "./feature-row"
export { CtaBand } from "./cta-band"
export { EventRail } from "./event-rail"
export { EventMeta } from "./event-meta"
export { FeaturedEvent, splitDateLabel } from "./featured-event"
export { ArchiveList, formatArchiveDate } from "./archive-list"
export type { ArchiveEntry } from "./archive-list"
export type { EventView } from "./event-view"
export { eventHref, CATEGORY_LABELS, nextAmavasyaEvent } from "./event-view"
export { NextAmavasyaDate, amavasyaLongDate } from "./next-amavasya-date"
export type { AmavasyaTarget } from "./next-amavasya-date"
