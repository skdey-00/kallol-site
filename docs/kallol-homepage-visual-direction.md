# Kallol Homepage — Visual Direction (Phase 5B)

**Repo:** `Kallol site latest` (branch `Skdey's-Vr`)
**Date:** September 2026
**Depends on:** `docs/kallol-brand-system.md` (Phase 3, LOCKED), `docs/kallol-information-architecture.md` (Phase 4, authoritative)
**Note:** the brief references `docs/kallol-homepage.md` and `docs/kallol-interaction-qa.md`; neither file exists in the repo. This document absorbs the homepage-direction role. Interaction QA is performed directly in §QA of this phase (build + link/console/viewport checks), continuing the Phase 5A baseline.

---

## 1. Analysis of the current homepage (post-Phase-5A)

Phase 5A produced a clean, correct, information-sound homepage (hero split, Now-at-Kallol band, Story, six puja cards, community rows, gallery mosaic, participate band, visit/map). Nothing is broken. But viewed as art direction it still reads as "a well-designed institutional website," not "Kallol." Specific findings:

### What already works — keep
- Real photography everywhere; no stock, no AI imagery.
- Server-rendered events from the one true store (`data/local-events.json`); no invented dates.
- Typography pairing (Source Serif 4 + Inter) with fluid scale; maroon/ivory palette discipline.
- Verified content only; missing facts marked for verification.
- Quiet crossfade hero slideshow (≥7s, reduced-motion safe).

### What feels generic / repetitive — fix
1. **The hero is a marketing split.** TEXT LEFT + IMAGE RIGHT, the exact layout the brief prohibits. Logo, positioning line, two CTAs, photo column — correct content, template composition. No scale contrast, no editorial metadata, no moment.
2. **Six equal puja cards.** Durga Puja (the community's greatest festival) and Kali Puja (Kallol's namesake) have exactly the same visual weight as Special Pujas. Cards with identical 3:2 images, identical chip, identical arrow row — six times.
3. **Three equal community service cards.** Library, dispensary, halls presented as interchangeable thirds. The brief: "Do NOT turn them into four generic icon cards" — this is three, but still a card row.
4. **Everything is medium-loud.** Section headers follow the identical eyebrow+title+intro pattern with identical spacing (py-16/24) eight times. No quiet passages, no loud moments, no rest. The scroll is a metronome, not a journey.
5. **Hierarchy is flat.** The biggest type on the page is the hero positioning line (~56px). NowAtKallol's featured date (text-4xl) and section titles all sit in the same 32–56px band. Nothing is LARGE; nothing is small and precious.
6. **The current event doesn't feel important.** "Coming up next" is a modest heading + date + link inside a beige band — the most time-critical information on the page has the least presence. On 12 Sept 2026 the next events are Mahalaya (10 Oct) and Durga Puja (16–21 Oct) — Durga Puja should land like a cover story.
7. **Gallery mosaic is pleasant but symmetric-ish** — a 2x2 dominant + 4/3s; lacks one truly dominant frame and asymmetric tension.
8. **Participate = 4 equal tiles on maroon.** Same rhythm as the puja grid above it. Donate — the primary action of the whole site — is one of four.
9. **Story section is a conventional image-left text-right spread.** Two paragraphs + links; no pull-quote scale, no archival texture.
10. **Whitespace is evenly distributed**, so it reads as padding, not as composition. Nothing disappears into whitespace because nothing is allowed to be quiet.

### Where the user loses interest
Between Story and PujaIndex the page becomes predictable: header → grid → header → grid. After the third grid the eye stops scanning headers. There is no surprise after the hero.

---

## 2. Design concept — "A LIVING CULTURAL INSTITUTION"

Kallol is simultaneously a place, a community, a culture, a tradition, a living organization. The homepage should read like an editorial cultural publication — closer to an architecture-institution annual or a heritage-feature spread than a SaaS landing page.

**Three moves create the identity:**

1. **SCALE DRAMA.** Oversized editorial type (display-xl up to 72px+, dates set enormous), against small, precise caption-scale metadata (11–13px uppercase tracking). The ratio between big and small is the design.
2. **THE BASELINE MOTIF.** The logo's defining characteristic is one continuous horizontal baseline linking three petal forms. Without redrawing anything, horizontal rules become the page's connective tissue: hairlines that enter from the left, carry metadata, and stop; rules that animate wider on scroll. The page is stitched together horizontally the way the wordmark is.
3. **RHYTHM OF DENSITY.** The scroll alternates deliberately: QUIET (hero) → EVENT (cover-story) → STORY (editorial) → INDEX (information) → COMMUNITY (institutional) → PHOTOGRAPHY (immersion) → PARTICIPATE (dark, dignified) → ARRIVE (quiet, practical). Loud sections earn their noise because neighbors are quiet.

**Voice:** calm, established, warm. Maroon is the anchor, ivory the air, deep ink the ground. Copper appears only as hairline detail.

---

## 3. Section-by-section direction (new hierarchy)

| # | Section | Concept | Structure (not cards) |
|---|---|---|---|
| 1 | **Hero** | The masthead | Oversized wordmark-scale logo + huge serif positioning statement over/against full-bleed photography with deep scrim; editorial metadata rail (location · identity · since-marker omitted—unverified); one primary + one quiet secondary CTA |
| 2 | **Now / Cover story** | "This is what is happening at Kallol right now" | Enormous date numerals + serif event title + image + EXPLORE; following events as a ruled horizontal list (a "calendar rail"), not cards |
| 3 | **Story** | Editorial feature | Big pull-quote-scale statement, narrow measure narrative, portrait photograph with caption, "Read the story" as an underlined editorial link |
| 4 | **Puja & Events index** | The year, indexed | Asymmetric editorial list: Durga + Kali as major entries with photography; Lakshmi/Saraswati/Amavasya/Special as a ruled index list with date chips — no images for minor entries |
| 5 | **Community** | "More than a mandir" | One large statement; three services as full-width ruled rows (eyebrow + title + text + thumbnail right), not thirds |
| 6 | **Gallery** | Visual memory | One dominant frame (large, 21:9-ish) + three supporting frames asymmetric; quiet captions; VIEW ALL PHOTOS |
| 7 | **Participate** | Dignified closing ask | Dark maroon band; DONATE as the dominant action with a real button; offerings/booking/facility as quiet ruled links beneath — one hierarchy, not four tiles |
| 8 | **Visit / Arrive** | The practical close | Address set as quiet metadata columns; timings; map; CONTACT + MAPS buttons; hairline rules carrying into the footer |

---

## 4. Typography decisions
- Display scale becomes the loudest voice: featured-event date numerals at display-xl scale; section statements at display scale; h2 only for conventional section titles.
- Metadata becomes the smallest: 11–13px uppercase Inter with wide tracking, always paired with a hairline or a maroon tick.
- Line lengths: narrative ≤ 65ch; statements can run wider with tighter leading (1.05–1.15).
- Bengali: unchanged chains (Noto Serif/Sans Bengali); any Bengali set ≥16px, never italicised, never tracked. Existing Bengali usage (footer sign-off) untouched.

## 5. Photography decisions
- All imagery remains real Kallol photography from `public/assets/` (verified against `app/photos/page.tsx` and existing sections). No stock, no AI, no new claims.
- Hero keeps the existing 5-frame slow crossfade set (community, mandir, aarti, programme, flowers) — full-bleed with stronger scrim for type legibility.
- Story keeps the verified community photograph; gallery keeps its verified frames with a new asymmetric composition; puja tiles reuse the four verified festival images only where photography earns size (Durga, Kali); minor pujas get no image (type + rule carry them).
- Captions remain caption-scale, factual, present-tense-neutral. No invented occasions/credits.

## 6. Motion decisions (subtle, distinctive)
- Baseline rules that draw wider on first scroll-into-view (CSS transition on width/transform, 500ms ease-calm, once).
- Image mask-up reveals on entry (translate + fade, 500–600ms), staggered ≤120ms within groups.
- Hero: keep ≥7s crossfade; add one-time entrance (fade/rise of the statement + logo) ≤700ms.
- Hover: underline sweeps on editorial links (background-size transition); image scale ≤1.02; no glow, no bounce, no parallax libraries.
- All scroll-reveal via a tiny IntersectionObserver hook; `prefers-reduced-motion: reduce` disables everything (global guard already enforces 0.01ms durations; the hook also no-ops).

## 7. Responsive decisions
- 375–430px: single column; hero statement scales by clamp; date numerals clamp down; puja major entries stack image-over-text; ruled lists keep their hairlines; CTA buttons full-width where needed.
- 768–1024px: two-column puja majors; community rows keep thumbnail-right; gallery dominant frame full-width, supports 2-up.
- ≥1280px: full editorial composition; asymmetric grids engaged; max content width stays 1200px per brand system.
- No horizontal scroll at any breakpoint (verify 375).

## 8. Accessibility decisions
- Semantic order preserved: one h1 (sr-only hero), h2 per section, h3 inside entries.
- All new interactive text links keep visible focus rings (maroon, offset). Reveal animations never gate content (no-JS = visible; observer adds a class only).
- Contrast: ivory on kallol-950/scrims ≥7:1; ink on ivory 13.8:1; metadata ink-mute on ivory ≈5.6:1 (AA for the sizes used).
- Alt text descriptive on content images; decorative overlays aria-hidden.

## 9. Performance decisions
- No new libraries. Reveals are CSS + ~40-line hook. No WebGL, no video, no parallax scroll handlers (IO only, passive).
- Images stay `<img>` with width/height + lazy (below fold); hero first slide eager. No new image files added; existing optimized webp/pngs reused.
- Server components unchanged; only two small client components (slideshow, reveal wrapper).

## 10. Content requiring verification (unchanged from IA doc §14)
- Founding year, "150 life members" etc. — not used on homepage in new copy.
- Phone display `+91-8655852917` vs masked `tel:+918****2917` — pre-existing, flagged, not altered here.
- Gallery/puja photo occasions follow existing captions; no new claims.

---

## 11. QA plan
1. `pnpm run lint` + `pnpm run build` (Windows side).
2. Serve production build; check homepage HTML contains all sections; all internal hrefs resolve (200).
3. Console errors check via browser tools if available (no Chrome/Edge on this machine — fallback: static HTML + build checks; user runs visual pass).
4. Viewport overflow check at 375/390/430/768/1024/1280/1440 (CSS-driven audit of fixed widths + rendered HTML).
5. Reduced-motion: global guard verified in globals.css.

---

*Phase 5B deliverable. Homepage only — no other pages redesigned (see brief §23–28).*
