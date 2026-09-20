# Bug-Fix Log — Full Site Audit (Sept 2026)

Plain-English summary of every bug found and fixed in the site-wide debug pass.
The site now passes a full production build **with type-checking switched back on**.

---

## The Big Ones

### 1. Donation receipt PDFs crashed every time
- **File:** `lib/donation-service.ts`
- **What was wrong:** The code asked for a page size named `A4_LANDSCAPE` — that
  doesn't exist in the PDF library. Any attempt to download a donation receipt
  would crash with an error.
- **Fix:** Build the landscape page from A4's portrait dimensions instead.
- **Verified:** Ran the PDF generation code directly — produces a valid
  landscape A4 page (841.89 × 595.28).

### 2. Type-checking was switched OFF — bugs shipped silently
- **File:** `next.config.mjs`
- **What was wrong:** `ignoreBuildErrors: true` told the build to ignore every
  coding mistake it found. That's how bugs #1 and #3 got through.
- **Fix:** Switched it back to `false`. The build now refuses to finish if
  there's a type error. (Full build passes — 38 pages.)

### 3. Photo API route used outdated Next.js style
- **File:** `app/api/photos/[photoId]/route.ts`
- **What was wrong:** Written in the old Next 14 style; Next 15 requires
  `await params`. Would fail type-checking (and eventually break).
- **Fix:** Updated to the Next 15 pattern.
- **Verified:** `/api/photos/test-id` returns proper JSON.

### 4. Every page had the same browser-tab title (SEO bug)
- **What was wrong:** 28 pages had no title of their own, so Google showed the
  same generic "Kallol Kali Mandir" title for every page on the site.
- **Fix:** Every page now has its own unique title + description
  (e.g. "Durga Puja in Goregaon West — Maha Sashti to Vijaya Dashami").
  Regular pages got a `metadata` block; interactive pages got a small
  `layout.tsx` file next to them (Next.js requires this for those).
- **Verified:** All 18 sampled routes show unique titles.

## Smaller Fixes

- **Admin page** had its own duplicate, conflicting definition of what an
  event looks like. Removed it; now uses the single shared definition from
  `lib/events-store.ts`.
- **`lib/db.ts`** — pool error handler now properly typed; added a
  `RowResult<T>` helper so the database query helper accepts clean row types.
- **Installed missing type packages** `@types/qrcode` and `@types/pg` — the
  code was using those libraries blind, with no error checking.

## Verified Clean (no bugs found)

- All 33 pages return HTTP 200; 404 page works correctly
- Zero broken links, zero missing images, every image has alt text
- Zero JavaScript console errors on shop, cart, donate, calendar, checkout,
  volunteer pages
- Amavasya date feature intact — "Saturday, 10 October 2026" shows on all
  4 placements, no countdown remnants

## Known & Left Alone (on purpose)

- Inner pages still have the older purple styling — that's a redesign task
  (Phase 7), not a bug.
- `eslint.ignoreDuringBuilds` is still on (lint warnings only, cosmetic).

## One-Time Hiccup (already solved)

During this session the dev server was stopped mid-write, which corrupted
some Next.js files inside `node_modules`. Fixed by deleting `node_modules`
completely and running `pnpm install` fresh. If you ever see
"Cannot find module" errors that make no sense, do the same:
delete `node_modules`, run `pnpm install`.
