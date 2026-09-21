# Header–Hero Alignment Fix (Sep 2026)

## Plain-English Cheat Sheet

- **What was wrong:** The same KALLOL logo appeared TWICE at the top — once small in the navbar, then again HUGE (up to 463px wide) on the hero photo right below it. Two logos stacked = the cluttered, competing top you saw.
- **What I did:** Deleted the big logo from the hero. The navbar logo is now the only one. Made the navbar slightly taller (96px) with a properly-sized logo (68px), aligned every edge to one shared grid, and made the hero start exactly where the header ends — to the pixel, at every screen size.
- **The photo is now the star of the hero.** Nothing overlaps, nothing is cropped, the logo file itself was never touched.
- **Everything still works:** all 24 nav links live (200), dropdowns open by mouse AND keyboard, mobile menu opens/closes/locks scroll, no console errors, build passes.

## Root cause (traced in code)

1. `components/home/hero.tsx` rendered a second `<BrandLogo size="hero">` (inline-overridden up to 104px tall / 463px wide) inside the hero photo block — measured at y=241 directly under the navbar logo at y=52–108 (1440px). This was the "oversized KALLOL artwork" competing with the header.
2. `app/clientLayout.tsx` padded `<main>` with hand-maintained magic numbers (`pt-[104px] md:pt-[120px]`) that were 1px short of the real header height (40+80+1=121px desktop) — a sub-pixel overlap by construction, coupled by hand across two files.
3. The navbar bar was 80px with a 56px logo (below the 88–96px / 66–72px spec), and used `container mx-auto px-4 md:px-6` while the hero and all homepage sections use the configured `.container` — so the navbar logo and the hero text sat on different left edges at lg+.
4. No negative margins, transforms, or z-index wars existed — the header is one `fixed` element at z-50, in normal flow otherwise. The collision was purely the doubled logo plus the magic-number padding.

## Changes

| File | Change |
|---|---|
| `components/home/hero.tsx` | Removed the second `BrandLogo` + its entrance wrapper; renumbered entrance stagger to 80/180/280ms. Content, photography, scrim, CTAs untouched. |
| `components/navbar.tsx` | Nav bar `h-16 md:h-20` → `h-16 md:h-24` (64/96px); desktop logo `size="lg"` (56px) → `height={68}` (68px, ratio-locked exact asset); utility bar + nav bar now use the configured `.container` (was ad-hoc `mx-auto px-4 md:px-6`); chevrons now `text-ink-faint`, `aria-hidden`, with a subtle rotate on hover/focus-within; item gap 1 → 1.5. IA, routes, dropdowns, cart, Donate Now untouched. |
| `app/clientLayout.tsx` | `<main>` padding now exact: `pt-[105px] md:pt-[137px]` (utility 40 + bar 64/96 + border 1), with a lockstep comment. |
| `docs/kallol-homepage-visual-direction.md` | §4.1 updated to reflect one-logo-per-view. |

Not touched: `brand-logo.tsx` (the exact asset, never redrawn), utility bar contents, footer, all other sections.

## Measured verification (Playwright, real geometry)

| Width | Header bottom | Hero top | Overlap | Second logo | H-overflow |
|---|---|---|---|---|---|
| 1440 | 137px | 137px | 0 | none | no |
| 1280 | 137px | 137px | 0 | none | no |
| 1024 | 137px | 137px | 0 | none | no |
| 768  | 137px | 137px | 0 | none | no |
| 430  | 105px | 105px | 0 | none | no |
| 390  | 105px | 105px | 0 | none | no |
| 375  | 105px | 105px | 0 | none | no |

- Heading clearance below header: 257px @1440, 175px @1280, 194px @1024 — ample.
- Desktop logo (68px) centered in the 96px bar: 14px clear above and below — fully inside, no crop.
- All 24 navbar routes return HTTP 200 (incl. /donate, /cart, /contact).
- Dropdown: opens on hover (3 links) AND on keyboard focus (`:focus-within`).
- Mobile menu: opens (680px panel), locks body scroll, closes, doesn't clip; hero heading fully visible below fixed header.
- Console: zero errors/warnings, zero hydration mismatches (7 viewports × homepage + interaction passes).
- `pnpm run build`: exit 0, all routes compiled.

## Remaining concerns (honest list)

1. **Inner utility pages double-pad (pre-existing):** `app/admin`, `app/calendar`, `app/cart`, `app/checkout`, `app/login`, `app/volunteer`, `app/contact`, `app/donate` (+ thank-you pages) render their own `pt-20` `<main>` INSIDE the globally padded `<main>` — nested mains with stacked top padding. The taller desktop header adds ~17px more there. Not caused by this fix; worth a separate cleanup (drop their local `pt-20`).
2. **Brand doc size table** (`docs/kallol-brand-system.md` §logo) still lists a `hero` size usage — the table documents available sizes; the hero placement is retired. Left as-is deliberately.
3. The 82svh hero means on short landscape windows the heading sits close to the fold — pre-existing behavior, min-h 560px guards it.
