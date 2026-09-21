# Editorial Sections Redesign — Puja Index & Community (Sep 2026)

## PLAIN-ENGLISH CHEAT SHEET

- **What changed:** The "pujas of the Bengali year" section used to be two identical image+text blocks side by side; Community was three identical rows. Both now read like a curated magazine spread, but with Kallol's own existing photos, words, and links — nothing new was invented.
- **Puja section now:** Durga Puja (the big festival) gets one large portrait photo like a magazine cover plate; its text sits beside it. Kali Puja is the companion feature — smaller photo, smaller headline, pinned to the same bottom line as the Durga photo, separated by a thin rule. Not twins anymore; the big one is clearly the big one.
- **Community section now:** Library, Medical, and Facilities each get their OWN shape instead of three clones: Library = tall bookshelf photo + wide text; Medical = text on the LEFT with a wide banner photo on the right (flipped); Facilities = big hall photo beside a narrow column. Big ghost numbers 01/02/03 mark the sequence.
- **Photos:** same real Kallol photos, no stock, no AI. Crops were chosen by measuring where each photo's detail actually sits (analysis in the decisions table). The Durga/Kali tiles show at their native shape — zero cropping of the deities.
- **Everything still works:** all 13 links live (200), keyboard focus visible on every link, images load, no horizontal overflow, zero console errors — checked at 1440/1280/1024/768/430/390/375px. Build passes.

## What was changed (files)

| File | Change |
|---|---|
| `components/home/puja-index.tsx` | Majors recomposed from twin blocks → one featured/companion spread (details below). Minor ruled index, heading, dates, copy, View-all link untouched. |
| `components/home/community.tsx` | Recomposed from three identical rows → three distinct silhouettes on one 12-col grid + ghost numerals. Copy, links, photos, routes untouched. |
| `components/kallol/figure.tsx` | Added `"7/10"` to the crop vocabulary (the festival tiles' native ratio — displays them uncropped). |

Untouched: hero, navbar, footer, story, now-at-kallol, gallery, participate, visit, all other pages, the logo, all copy.

## Puja index — composition

**Desktop (lg+):** 12-col grid. Durga plate (native 7:10 portrait, capped 560px wide) spans 7 cols and 2 rows. Right column (5 cols): Durga's date/headline/note/arrow top; Kali Puja pinned to the bottom baseline via `lg:self-end` — a stone-line hairline above it, smaller image (7:10), `text-h3` vs Durga's `text-h2`. Measured baseline delta ≤6px at 1440/1280, 1px at 1024.

**Tablet (md):** 2-up — Durga plate + Durga type side by side; Kali full-width beneath with hairline.

**Mobile:** natural stack. Kali keeps its internal image-left/text-right arrangement (image 38% — narrower than the old 44% so the note wraps less).

**Why 560px cap:** the source tiles are 350×500 PNGs; at 657px display they upscaled 1.88× and read soft. Capped at 560px (1.61×) with the residual track as whitespace. The visual-direction doc already lists high-res festival portraits under "photography still required".

## Community — composition

| # | Silhouette | Grid (lg) | Image treatment |
|---|---|---|---|
| 01 Library | Lead feature | 4:5 portrait 5 cols + text 7 cols | `object-top` (shelves' detail is top-weighted, 42%) |
| 02 Medical | Reversed spread | text LEFT 5 cols + 21:9 banner RIGHT 7 cols | native 20:9 shape kept (1600×720), `object-top` (70% of detail top band) |
| 03 Facilities | Broad close | 3:2 landscape 7 cols + rail 5 cols | near-native 3:2 (1600×1040), `object-top` (empty floor at bottom, 54% detail top-left) |

Ghost numerals `01/02/03`: `clamp(3.5rem,7vw,6rem)` maroon at 15% opacity, aria-hidden, in-flow flex (no absolute positioning, no negative offsets). Hairlines only — no card borders, shadows, or radius.

## Image decisions (measured, not guessed)

Luminance/edge-density profiles located each photo's subject mass:

- Durga/Kali tiles: 39–49% of detail in the top quarter → `object-top` everywhere; shown at native 7:10 (no crop at all).
- Library: left-weighted, top-heavy → 4:5 + `object-top`.
- Medical webp: extreme banner (1600×720) with the dispensary signage in the top band → kept 21:9, `object-top`. Cropping it portrait would destroy it.
- Conference hall: detail top-left, empty floor bottom → 3:2 + `object-top` trims the dead floor only.

**Human review wanted:** confirm the crops flatter the actual photos in a real browser (screenshots: `/tmp/editorial-puja-1440.png`, `/tmp/editorial-community-1440.png`, `/tmp/editorial-mobile-375.png`). Confirm the ghost-numeral opacity (15% maroon) reads as intended on the stone-warm background.

## Verification record

- Build: `pnpm run build` → exit 0 (dev stopped first; running both corrupts `.next`).
- All 7 widths: horizontal overflow = none; all 5 section images load after scroll; ghost numerals scale 96px→56px; heading order H1→H2→H3 clean.
- Links (13 unique): /durga-puja, /kali-puja, /lakshmi-puja, /saraswati-puja, /amavasya-puja, /special-puja, /upcoming-events, /cultural-events, /library-services, /medical-services, /facilities-services, /medical-camp, /archives — all HTTP 200.
- Keyboard: Tab sweep reaches every link in both sections with `:focus-visible` true (maroon ring, offset preserved).
- Console/page errors: zero at all widths; no hydration warnings.
- Durga type stays within the plate's column height at lg+ (`durgaTextWithinColumn: true` at 1440/1280/1024; at <lg the stack order is image → type → Kali, by design).

## Remaining limitations

1. **Source resolution:** festival tiles are 350×500. The 560px cap keeps the upscale at 1.61× — acceptable, not crisp. The doc's standing request for higher-res portrait festival photography stands; when it arrives, remove the `lg:max-w-[560px]` cap and let the plate fill 7 columns.
2. Kali's note text column is 237px at 1440 — set small (`text-sm`) deliberately as the companion voice; readable but narrow. If it feels cramped, widen `w-[42%]` to 46%.
3. Ghost numerals sit inline before the eyebrow; on 375px they take 56px of row width — intentional anchor, but review mobile screenshots to confirm taste.
4. Vision-model QA was unavailable this session (API quota); crop decisions rest on the measured luminance/edge profiles above plus saved screenshots — worth a human glance.
