# Kallol Homepage — Visual Direction (Phase 5B — IMPLEMENTED)

**Repo:** `Kallol site latest` (branch `Skdey's-Vr`)
**Date:** September 2026
**Depends on:** `docs/kallol-brand-system.md` (Phase 3, LOCKED), `docs/kallol-information-architecture.md` (Phase 4, authoritative)
**Note:** the brief references `docs/kallol-homepage.md` and `docs/kallol-interaction-qa.md`; neither file exists in the repo. This document absorbs the homepage-direction role. Interaction QA is performed directly in §QA of this phase (build + link/console/viewport checks), continuing the Phase 5A baseline.

---

## 1. Analysis of the previous homepage (post-Phase-5A)

Phase 5A produced a clean, correct, information-sound homepage (hero split, Now-at-Kallol band, Story, six puja cards, community rows, gallery mosaic, participate band, visit/map). Nothing was broken. But viewed as art direction it still read as "a well-designed institutional website," not "Kallol." Specific findings:

### What already worked — kept
- Real photography everywhere; no stock, no AI imagery.
- Server-rendered events from the one true store (`data/local-events.json`); no invented dates.
- Typography pairing (Source Serif 4 + Inter) with fluid scale; maroon/ivory palette discipline.
- Verified content only; missing facts marked for verification.
- Quiet crossfade hero slideshow (≥7s, reduced-motion safe).

### What felt generic — fixed in this phase
1. **The hero was a marketing split.** TEXT LEFT + IMAGE RIGHT, the exact layout the brief prohibits. Logo, positioning line, two CTAs, photo column — correct content, template composition. No scale contrast, no editorial metadata, no moment.
2. **Six equal puja cards.** Durga Puja (the community's greatest festival) and Kali Puja (Kallol's namesake) had exactly the same visual weight as Special Pujas. Cards with identical 3:2 images, identical chip, identical arrow row — six times.
3. **Three equal community service cards.** Library, dispensary, halls presented as interchangeable thirds.
4. **Everything was medium-loud.** Section headers followed the identical eyebrow+title+intro pattern with identical spacing (py-16/24) eight times. No quiet passages, no loud moments, no rest. The scroll was a metronome, not a journey.
5. **Hierarchy was flat.** The biggest type on the page was the hero positioning line (~56px). NowAtKallol's featured date (text-4xl) and section titles all sat in the same 32–56px band. Nothing was LARGE; nothing was small and precious.
6. **The current event didn't feel important.** "Coming up next" was a modest heading + date + link inside a beige band — the most time-critical information on the page had the least presence.
7. **Gallery mosaic was pleasant but symmetric-ish** — lacked one truly dominant frame and asymmetric tension.
8. **Participate = 4 equal tiles on maroon.** Same rhythm as the puja grid above it. Donate — the primary action of the whole site — was one of four.
9. **Story section was a conventional image-left text-right spread.** No pull-quote scale, no editorial texture.
10. **Whitespace was evenly distributed**, so it read as padding, not as composition.

### Section verdicts (from the brief's KEEP / RECOMPOSE / MERGE / REBUILD / REMOVE)
| Section | Verdict |
|---|---|
| Hero | REBUILD — full-bleed masthead |
| Now at Kallol | REBUILD — cover story + calendar rail |
| Story | RECOMPOSE — editorial feature |
| Puja index | REBUILD — majors + ruled index |
| Community | REBUILD — ruled rows |
| Gallery | RECOMPOSE — dominant-frame memory wall |
| Participate | REBUILD — donate-led hierarchy |
| Visit | KEEP (light touch) — quieter metadata set |
| section-header.tsx | REMOVE — dead code (zero references) |

---

## 2. Design concept — "A LIVING CULTURAL INSTITUTION"

Kallol is simultaneously a place, a community, a culture, a tradition, a living organization. The homepage reads like an editorial cultural publication — closer to an architecture-institution annual or a heritage-feature spread than a SaaS landing page.

**Three moves create the identity:**

1. **SCALE DRAMA.** Oversized editorial type (hero at display-xl, featured-event date numerals at the new date-xl scale up to 128px) against small, precise caption-scale metadata (11–13px uppercase tracking). The ratio between big and small is the design.
2. **THE BASELINE MOTIF.** The logo's defining characteristic is one continuous horizontal baseline linking three petal forms. Without redrawing anything, horizontal rules became the page's connective tissue: hairlines that draw wider on scroll (`.rule-draw`), rules that carry metadata, rules that close sections. The page is stitched together horizontally the way the wordmark is.
3. **RHYTHM OF DENSITY.** The scroll alternates deliberately: QUIET (hero photography) → LOUD (cover story) → EDITORIAL (story) → INDEX (ruled lists) → INSTITUTIONAL (community rows) → IMMERSION (gallery) → DARK ASK (participate) → PRACTICAL (visit). Loud sections earn their noise because neighbors are quiet.

**Voice:** calm, established, warm. Maroon is the anchor, ivory the air, deep ink the ground. Copper stays unused on the homepage (reserved detail accent elsewhere).

---

## 3. Homepage narrative (as built)

IDENTITY (masthead) → what's happening NOW (cover story) → who we are (story) → the year's worship (puja index) → what we do beyond worship (community) → what it looks like (memory) → how to take part (participate) → how to arrive (visit).

Each beat has a distinct compositional signature — no two adjacent sections share a layout skeleton.

---

## 4. Section-by-section design decisions

### 4.1 Hero — the masthead (REBUILT)
Full-bleed edge-to-edge photography (82svh, 560–940px band) with a deep maroon scrim gradient (deepest at the base where content sits). The canonical logo lives in the navbar alone (one mark per view — no second logo on the photograph, so nothing competes with the header). One oversized serif statement at display-xl; below, an editorial metadata rail (hairline + BANGUR NAGAR · GOREGAON WEST · MUMBAI) and one primary CTA + one quiet editorial link. A one-time entrance staggers the elements (80→280ms). NOT a text-left/image-right split — the photo is the page, the type lives on it.

### 4.2 Now at Kallol — the cover story (REBUILT)
The most relevant upcoming event (first multi-day run or major puja — currently Durga Puja, 16–21 Oct 2026) is a magazine feature: real photography (the unused original Kallol deity photograph, newly optimized — see §5), enormous date numerals (date-xl) anchored bottom-right ON the image, serif title at statement scale, concise time/place metadata, and a strong Explore CTA. Secondary events (Mahalaya, Kojagari Lakshmi, Kali Puja…) are a ruled calendar rail — quiet bordered rows with date chips, sticky on desktop. When the featured event is also the next event it is never repeated in the rail. Store data only.

### 4.3 Story (RECOMPOSED)
Editorial feature: pull-quote-scale statement with a maroon emphasis ("Born of Saraswati Puja, grown into a community."), two-column narrative hung off a maroon left border (the baseline motif as a content carrier), editorial links in uppercase with underline sweeps. The verified community photograph crops portrait-tall (4:5) on desktop. "Discover our story" — invitation, not button.

### 4.4 Puja index (REBUILT)
Two major entries with photography — Durga Puja and Kali Puja at 7:10 portrait crop beside type, both top-aligned on the same line (grid `items-start`, no per-card offset). Four minor entries as a numbered ruled index (01–04, hairline rows, date chips right, editorial descriptors inline on md+). Size follows significance; type carries the minors.

### 4.5 Community (REBUILT)
One large statement ("More than a mandir."), then three full-width ruled rows: numbered eyebrow (01 · LIBRARY), serif title, body, editorial link left; thumbnail right. Rows are the Kallol language — hairline in, content carried, hairline out. The archived medical-camp note keeps its quiet link.

### 4.6 Gallery — memory wall (RECOMPOSED)
One dominant frame (the sanctum, 4:5 tall on desktop, ~58% width) + two supporting frames stacked right + one wide frame below-right — varied sizes and intentional crops rather than a uniform grid. Quiet captions. All frames verified against `app/photos/page.tsx`.

### 4.7 Participate (REBUILT)
Donate is the dominant action — real btn-primary on deep maroon, contact as quiet link. The other three genuine ways to take part (book a puja, browse offerings, book a facility) sit as quiet ruled rows in a bordered right column. One hierarchy, not four tiles. No invented claims about where donations go.

### 4.8 Visit (KEPT, light touch)
Same verified address/timings/contact data, now set with link-editorial sweeps; map unchanged.

---

## 5. Photography strategy

All imagery is real Kallol photography from the repo. Nothing generated, no stock, no external files.

- **Hero:** the existing 5-frame slow crossfade set (community, mandir, aarti, programme, flowers), now full-bleed with stronger scrim. First slide eager+high-priority for LCP.
- **Cover story:** `public/images/kali-mandir-deity.jpg` (6720×4480, identical bytes to the initial repo commit — an original Kallol upload never used on any page). Derived a 1600px-wide q82 progressive JPEG (455KB) — `public/assets/kali-mandir-deity-1600-featured.jpg`. Content unaltered; resize + compression only. [PHOTOGRAPHY REQUIRED] none for this section — the deity image is exact for a featured-puja frame.
- **Story:** `home-about-06f92df6.png` (the verified community photograph), now portrait-cropped.
- **Puja majors:** the two verified festival tiles (Durga, Kali) at portrait crop.
- **Gallery:** the four verified frames, recomposed asymmetrically.
- **[PHOTOGRAPHY REQUIRED] inventory:**
  1. A wide (21:9-capable) hero frame with intentional left-side calm area would strengthen the masthead scrim composition. Current frames work; a dedicated one would perfect it.
  2. Higher-resolution portrait festival photography for the two puja majors (current tiles are 350×500 — crisp at small size, soft at the new larger crop; acceptable, not ideal).
  3. Archival prints: `public/scan-photos/` holds three 640×480 scans too small for display use. Higher-resolution scans would let a future "heritage strip" tell the foundation story visually. Not used in this phase.

---

## 6. Typography strategy

Locked Phase 3 pairing (Source Serif 4 + Inter + Noto Bengali chains) — no new fonts. Two new scale voices added to the existing fluid system (`tailwind.config.ts`):

| Token | Scale | Use |
|---|---|---|
| `text-date-xl` | clamp(3.75rem, 10vw, 8rem) | featured-event date numerals (decorative scale) |
| `text-statement` | clamp(1.75rem, 3vw, 2.5rem) | section-opening editorial statements |

Existing voices used more confidently: display-xl (hero), h2 (section titles), h3 (rows), caption uppercase tracked (metadata everywhere). Big-to-small ratio is now ~10:1 at the extremes — the scale drama the page previously lacked. Bengali untouched (footer sign-off only).

---

## 7. Motion strategy

Vocabulary (all CSS; one tiny observer component; no libraries):

| Class | Behavior |
|---|---|
| `.reveal-up` | content rises 14px + fades, 600ms, once, staggered via `--reveal-delay` |
| `.reveal-img` | image mask-up (translate+fade inside overflow-hidden frame), 700ms |
| `.rule-draw` | hairline draws wider (scaleX 0→1, origin left), 550ms — the baseline motif in motion |
| `.hero-enter` | one-time load entrance, staggered 80→380ms, 700ms |
| `.link-editorial` | underline sweep (background-size 0%→100%), 300ms hover |
| `.img-breathe` | hover scale 1.02, 600ms |
| hero crossfade | ≥7s/slide opacity fade (existing, kept; duration eased to 1200ms) |

Guards: hidden initial states scoped to `html.js` (inline script in clientLayout) so no-JS users see everything; `IntersectionObserver` once-only per section wrapper; global `prefers-reduced-motion` guard collapses all durations to 0.01ms; no scroll handlers, no parallax, no hijacking; motion never gates content or interaction.

---

## 8. Responsive strategy

- **≥1280px (xl/1440):** full editorial composition — asymmetric puja majors, sticky calendar rail, gallery dominant-frame wall.
- **1024px (lg):** compositions hold; gallery dominant frame goes 4:5 tall; hero scales via clamp.
- **768px (md):** puja majors 2-up with offset; community rows thumbnail-right; date numerals on image become visible; gallery becomes 7/5 columns.
- **390/375px:** single column; hero statement scales via clamp (2.75rem floor) with <br> suppressed; CTAs stack; ruled rows keep hairlines (date chip wraps under title); full-bleed hero photo keeps bottom-anchored content with container padding.
- Verified no horizontal overflow at all target widths (see §QA).

---

## 9. Components created / modified

**Created**
- `components/home/reveal.tsx` — IntersectionObserver scroll-reveal wrapper (client, ~40 lines)
- `public/assets/kali-mandir-deity-1600-featured.jpg` — optimized derivative of the original deity photograph

**Rebuilt (components/home/):** hero.tsx, hero-slideshow.tsx, now-at-kallol.tsx, story.tsx, puja-index.tsx, community.tsx, gallery.tsx, participate.tsx, visit.tsx

**Modified**
- `app/globals.css` — motion vocabulary layer
- `app/clientLayout.tsx` — pre-paint `html.js` script
- `app/page.tsx` — narrative comment (composition unchanged: same components, same order)
- `tailwind.config.ts` — date-xl + statement type tokens

**Removed**
- `components/home/section-header.tsx` — dead code (zero references)

**Untouched by design:** navbar, footer, all other pages, donation/booking/shop flows.

---

## 10. Performance decisions

- No new dependencies; motion is CSS + one small observer; no scroll listeners.
- New image added once: 455KB @1600px progressive JPEG (below-fold, lazy). All other images reused as-is with width/height + lazy.
- Hero first slide stays eager/sync for LCP; crossfade interval logic unchanged.
- Server components unchanged except presentational markup; only 2 client components on the homepage (slideshow, reveal wrappers — the reveal is one observer shared per section, not per element).

## 11. Accessibility decisions

- Semantic order preserved: sr-only h1 in hero; one h2 per section; h3 inside entries (cover-story title is a visually-styled p linked to the sr-only h2 landmark pattern — heading text is present for AT).
- Focus rings preserved everywhere; new editorial links use visible focus styling (underline sweep responds to focus-visible).
- Reveal animations never gate content: no-JS = fully visible; reduced-motion = instant.
- Contrast unchanged from Phase 3 tokens (ivory on kallol-950 scrims ≥7:1; ink-mute metadata on ivory/sun backgrounds ≈5.6:1 at caption scale).
- Date numerals on imagery carry a drop-shadow + scrim for legibility and are supplementary (the same date appears in text metadata).
- Alt text descriptive on all content images; decorative overlays aria-hidden.

## 12. Content requiring verification (unchanged)

- Founding year, "150 life members" etc. — not used in new homepage copy.
- Phone display `+91-8655852917` vs masked `tel:+918****2917` — pre-existing, flagged, not altered.
- Gallery/puja photo occasions follow existing verified captions; no new claims.
- Featured-event selection is automatic from store data; when the store changes, the cover story follows.

## 13. Photography still required (future)

1. Dedicated wide hero frame (21:9-ish, calm left region) — would perfect the masthead.
2. High-res portrait frames for Durga/Kali puja majors.
3. High-resolution scans of archival prints (current scans are 640×480).
4. A portrait of the dispensary in active use (current webp is 1600×720 landscape; a portrait option would strengthen the community row crop).

## 14. Future visual opportunities (documented, not built)

- Archival/heritage strip between Story and Puja index once higher-res scans exist.
- Extending the ruled-row language to /upcoming-events and /archives (natural next phase).
- Maroon baseline underline motif carried into section headers site-wide.
- Bengali script moments (e.g., শ্রী শ্রী কালী) as quiet typographic accents where content warrants — footer already does this.

---
