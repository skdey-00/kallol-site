# Kallol Website — Information Architecture & UX Audit (Phase 4)

**Site:** https://kallol.369808.xyz/
**Repo:** `Kallol site latest` (Next.js 15 App Router, branch `diff-ui`)
**Date:** September 2026
**Scope:** IA / UX structure only. Visual identity (Phase 3) is LOCKED and untouched.

---

## 1. EXISTING SITE AUDIT — what was found

### Structural problems

1. **Navigation was organized by the old site's history, not by user intent.**
   The navbar had 6 top-level items: "Home" (whose dropdown actually held About pages),
   "Puja & Events", "Online Services", "Events" (a *second* events group holding cultural
   events + medical camp), "Gallery", "Contact Us". Two of six top-level items were both
   "events"; "Home" dropdown had nothing to do with the home page.

2. **Duplicate destinations under different labels.**
   "Online Services" contained "Online Puja Booking" → `/donate` and "Other Donation" →
   `/donate` — the same page twice under two names in one dropdown.

3. **"Events" group was a catch-all.** Poila Baishak + Rabindra Jayanti + Medical Camp
   (a community service archive page) were lumped together only because they didn't fit
   anywhere else.

4. **No archive existed.** 28 past events (Apr 2025 – Mar 2026) sat in
   `data/local-events.json` but were invisible — the calendar filters them out (correct)
   with no way for a visitor to see Kallol's history.

5. **Dead / no-op CTAs.** On `/upcoming-events`, the featured "Event Details" button had
   no link at all; card "View Details" linked to `/upcoming-events` itself (self-link).

6. **Misleading labels.** Homepage card "Medical & Library Facility" linked only to
   `/medical-services`; "Facility For Events" (footer) linked to the general
   facilities page; "Read More.." (trailing double dots).

7. **No sitemap.xml, no per-page metadata.** Only a global title/description in
   `app/layout.tsx` (plus generator tag "v0.dev").

8. **Legacy WordPress URLs unrecoverable.** `site-data/pages.json` (crawl of the old
   kallolmumbai.com) shows old paths (`/puja/*`, `/donation`, `/about-kallol`,
   `/facility-for-events`, `/2025-puja-calendar`, …) that 404 on the new site.

### What was already in good shape (previous phases)

- Year-specific routes already renamed to evergreen (`/durga-puja-2025` → `/durga-puja`
  etc.) with redirects in `next.config.mjs`.
- `lib/site-config.ts` centralizes `CURRENT_YEAR = 2026` and TBA labels.
- Calendar auto-hides past events; events store keeps them as the archive record.
- Brand system (Phase 3) locked in `docs/kallol-brand-system.md`.

---

## 2. CURRENT ROUTE INVENTORY (post-audit, pre-Phase-4)

**Public pages (26 routes)**

| Route | Type | In old nav? | Notes |
|---|---|---|---|
| `/` | evergreen | yes | Homepage |
| `/about` | evergreen | dropdown | Our story |
| `/kallol-kali-mandir` | evergreen | dropdown | The mandir |
| `/managing-committee` | evergreen (year-sensitive members) | dropdown | Committee list |
| `/upcoming-events` | year-specific content, evergreen URL | yes | Hardcoded event cards |
| `/calendar` | evergreen shell, dated data | yes | Reads `local-events.json` |
| `/amavasya-puja` | evergreen | dropdown | Monthly recurring |
| `/durga-puja` | evergreen page, dated schedule | dropdown | 2026 schedule on page |
| `/kali-puja` | evergreen page, dated schedule | dropdown | |
| `/lakshmi-puja` | evergreen page, dated schedule | dropdown | |
| `/saraswati-puja` | evergreen page, dated schedule | dropdown | (was missing from new nav — restored) |
| `/special-puja` | evergreen | dropdown | Satyanarayan, Shanidev, others |
| `/poila-baishak` | evergreen page, dated content | old "Events" group | Cultural |
| `/rabindranath-tagore-birthday` | evergreen page, dated content | old "Events" group | Cultural |
| `/medical-camp` | ARCHIVE (March 2025 event) | old "Events" group | Marked "(Archive)" |
| `/medical-services` | evergreen | dropdown | Dispensary + inline camp archive |
| `/library-services` | evergreen | dropdown | |
| `/facilities-services` | evergreen | dropdown | Hall + campus booking |
| `/photos` | evergreen | yes | Static gallery ~50 imgs |
| `/videos` | evergreen (placeholder "Coming Soon") | yes | |
| `/shop` | evergreen | dropdown | Puja offerings + cart |
| `/cart`, `/checkout`, `/checkout/thank-you` | functional | cart icon | Shop flow |
| `/donate`, `/donate/[pujaId]`, `/donate/thank-you` | functional | dropdown ×2 | Instamojo/UPI/Paytm |
| `/contact` | evergreen | yes | |
| `/privacy-policy` | evergreen | footer | |
| `/archives` | **NEW (Phase 4)** | nav + footer | Past events hub |

**Internal / gated**

| Route | Notes |
|---|---|
| `/login` | Admin/volunteer login |
| `/admin` | Donations + events management (gated) |
| `/volunteer` | Gated: volunteers + admin only |
| `/api/donations/instamojo/{return,webhook}` | Payment integration |
| `/api/photos/[photoId]` | Photo API |

---

## 3. PAGE-BY-PAGE CLASSIFICATION

| Page | Classification | Reason |
|---|---|---|
| `/` | KEEP + RESTRUCTURE (links only) | Section order is sound; fixed card labels/destinations, CTA text |
| `/about` | KEEP + REWRITE (Phase 5+) | Evergreen story; needs founding-date facts from Kallol |
| `/kallol-kali-mandir` | KEEP | Core religious identity page |
| `/managing-committee` | KEEP + annual refresh cycle | Members change yearly — treat as year-specific content with evergreen URL |
| `/upcoming-events` | KEEP + RESTRUCTURE | Fixed dead CTAs, deep-linked each card to its real page |
| `/calendar` | KEEP | Working dated calendar fed by events store |
| `/amavasya-puja` | KEEP | Recurring monthly — evergreen by nature |
| `/durga-puja` | KEEP | Schedule block is 2026 — update per year via content pass |
| `/kali-puja` | KEEP | Same annual-refresh model |
| `/lakshmi-puja` | KEEP | Same |
| `/saraswati-puja` | KEEP | Same (was accidentally unlinked — restored to nav) |
| `/special-puja` | KEEP | Umbrella for Satyanarayan/Shanidev/other pujas |
| `/poila-baishak` | KEEP (under Puja & Events → Cultural) | Recurring cultural event page |
| `/rabindranath-tagore-birthday` | KEEP (under Puja & Events → Cultural) | Recurring cultural event page |
| `/medical-camp` | ARCHIVE | One-time March 2025 event; linked from /archives + Community |
| `/medical-services` | KEEP | Ongoing dispensary = core community service |
| `/library-services` | KEEP | Ongoing service |
| `/facilities-services` | KEEP | Hall/campus booking — also a "service" |
| `/photos` | KEEP | Working gallery |
| `/videos` | KEEP (placeholder) | "Coming Soon" — content gap flagged |
| `/shop` | KEEP | Functional offerings + cart + checkout |
| `/donate` + `/donate/[pujaId]` | KEEP | Functional (Instamojo/UPI/Paytm) |
| `/contact` | KEEP | |
| `/privacy-policy` | KEEP | |
| `/archives` | **CREATE (done)** | Missing archive hub — now exists, fed by real past-event data |
| `/sitemap.xml` | **CREATE (done)** | SEO gap — now generated |
| `/login`, `/admin`, `/volunteer` | KEEP (ungated from nav) | Internal; remain reachable via footer login + role gating |

Nothing was removed. No historical content was deleted.

---

## 4. EVERGREEN vs YEAR-SPECIFIC CONTENT MODEL

**Evergreen (write once, rarely touches):** About, Kali Mandir, Facilities, Library,
Medical Services, Contact, Privacy, Special Puja descriptions, Amavasya Puja pattern.

**Year-specific (refresh each year, no restructure):**
- Durga/Kali/Lakshmi/Saraswati schedule blocks (pages stay, dates update)
- `lib/puja-data.ts` donation items & dates (already commented with Bangabda years)
- `data/local-events.json` calendar events (admin UI or file edit)
- Committee list (verify each term)
- `lib/site-config.ts` → `CURRENT_YEAR` (single switch)

**Annual update runbook (next maintainer):**
1. Bump `CURRENT_YEAR` in `lib/site-config.ts`.
2. Replace dated schedule blocks on the 4 major puja pages.
3. Update `lib/puja-data.ts` items/dates when the committee publishes offerings.
4. Clear/replace dated events in `local-events.json` (past ones remain = archive).
5. Re-verify committee list with Kallol.

No route changes are needed year-to-year — evergreen URLs + dated content blocks.

---

## 5. FINAL SITEMAP

```
HOME
│
├── ABOUT (nav group)
│   ├── Our Story                        /about
│   ├── Kallol Kali Mandir               /kallol-kali-mandir
│   └── Managing Committee               /managing-committee
│
├── PUJA & EVENTS (nav group)
│   ├── Upcoming Events                  /upcoming-events
│   ├── Puja Calendar                    /calendar
│   ├── Amavasya Puja                    /amavasya-puja
│   ├── Durga Puja                       /durga-puja
│   ├── Kali Puja                        /kali-puja
│   ├── Lakshmi Puja                     /lakshmi-puja
│   ├── Saraswati Puja                   /saraswati-puja
│   ├── ── (divider) ──
│   ├── Cultural Events                  /poila-baishak
│   ├── Rabindra Jayanti                 /rabindranath-tagore-birthday
│   ├── Special Pujas                    /special-puja
│   └── Past Events                      /archives
│
├── COMMUNITY (nav group)
│   ├── Facilities & Services            /facilities-services
│   ├── Library                          /library-services
│   ├── Medical Services                 /medical-services
│   └── Medical Camp 2025 (archive)      /medical-camp
│
├── GALLERY (nav group)
│   ├── Photos                           /photos
│   ├── Videos                           /videos
│   └── Past Events                      /archives
│
├── SERVICES (nav group)
│   ├── Puja Offerings (Shop)            /shop
│   ├── Puja Booking & Donations         /donate
│   └── Facility Booking                 /facilities-services
│
├── CONTACT                              /contact
│
├── DONATE (navbar button, always visible)
│
└── Internal (not in nav): /login /admin /volunteer /cart /checkout
    + /privacy-policy (footer)
```

Footer columns mirror this: **Explore** (About/Mandir/Committee/Facilities/Library/Medical),
**Puja & Events** (all pujas + cultural + Past Events), **Participate** (Donate/Offerings/
Gallery/Facility booking/Contact/Privacy).

---

## 6. NAVIGATION HIERARCHY (as implemented)

5 groups + Contact + Donate button. Every group answers one user question:

| Nav item | User question it answers |
|---|---|
| About | "What is Kallol?" |
| Puja & Events | "What's happening / when is X puja?" |
| Community | "What does Kallol do for people?" |
| Gallery | "Show me Kallol." |
| Services | "How do I book / offer / donate?" |
| Contact | "How do I reach them?" |
| Donate (button) | "I want to support." |

Changes from old nav:
- "Home" group → **About** (dropdown contents now match the label).
- "Online Services" → **Services**; duplicate `/donate` entries collapsed; shop is primary.
- "Events" group dissolved: cultural events moved under **Puja & Events → Cultural**,
  Medical Camp moved under **Community**.
- Saraswati Puja restored to the Puja & Events dropdown (was orphaned).
- "Contact Us" → **Contact** (shorter, consistent).
- Divider in dropdown separates recurring pujas from cultural/special/archive.
- Mobile menu renders the same structure incl. dividers.

## 7. HOMEPAGE CONTENT HIERARCHY (informational, not visual)

Current order (kept — it is correct for Kallol's purpose):
1. **Identity** — Hero: who Kallol is (mandir + cultural org) + CTAs
2. **Announcement banner** — AnimatedBanner
3. **About intro** — story teaser + Read More
4. **Key destinations** — 4 cards (Mandir / Facilities / Library & Medical / Calendar)
5. **Puja & Events grid** — 6 puja tiles
6. **Featured events** — carousel of the next major celebrations
7. **Quick access** — Upcoming Events / Calendar / About / Donate
8. **Visit CTA** — invitation + Contact
9. Footer

Fixed in Phase 4: card 3 label/destination mismatch ("Medical & Library Facility" →
"Community: Library & Medical", now links to Library), "Facility for Events" →
"Facilities & Services", "Read More.." → "Read More".
Recommendation for Phase 5: fold sections 5–7 into fewer, stronger modules; the
informational order itself needs no change.

## 8. USER JOURNEYS (post-Phase-4 click counts)

| # | Journey | Path | Clicks | Friction removed in Phase 4 |
|---|---|---|---|---|
| A | First-time visitor | Home → About | 1–2 | About now a top-level group |
| B | Puja seeker | Home → Puja & Events → specific puja → Book Offerings | 3 | Event cards now deep-link to real pages; Book CTA goes to `/donate/<puja>` directly |
| C | Participant | Home → Upcoming Events → event → details | 2–3 | Dead "Event Details" button fixed |
| D | Donor | Home → Donate (navbar button) | 1 | unchanged |
| E | Community-services seeker | Home → Community → Library/Medical/Facilities | 2 | Community group now exists; cross-links added between Library ↔ Medical ↔ Facilities |
| F | Existing member | Home → Calendar / Upcoming / Contact | 1–2 | unchanged |
| G | Researcher / nostalgic visitor | Home → Puja & Events → Past Events → year | 2 | `/archives` created (was impossible) |
| H | Shopper | Home → Services → Shop → cart → checkout | 4 | unchanged (functional flow preserved) |
| I | Facility booker | Home → Services → Facility Booking → phone number | 2 | clearer label + placement |
| J | Legacy inbound link | old WP URL → 301 → evergreen page | 0 | 22 redirects added |

## 9. ARCHIVE STRATEGY

- **Page:** `/archives` — server-rendered from `data/local-events.json`, filters to
  past events, groups by calendar year (currently 2025 + 2026 sections), newest first.
- **No invented history:** only dated events already in the store appear. A
  "[VERIFY WITH KALLOL] / [CONTENT REQUIRED]" card marks where older records can be
  added when the committee supplies them.
- **Dedicated archive pages** (`/medical-camp`) are linked from the archive hub.
- **Annual flow:** each year, past events automatically accumulate here — no
  restructuring needed. If a year grows large, add `/archives/[year]` later; the data
  model already supports it (Low priority, see §10).
- Calendar page stays future-only (already correct).

## 10. MISSING CONTENT / PAGES

**HIGH PRIORITY**
1. Per-page SEO metadata (title/description) — sitemap done; metadata pending (Phase 5).
2. Videos page has no content ("Coming Soon") — [CONTENT REQUIRED].
3. Committee term/year on `/managing-committee` — [VERIFY WITH KALLOL].
4. Directions / map embed on Contact — [VERIFY WITH KALLOL: preferred map pin].

**MEDIUM PRIORITY**
5. Donation transparency block (how funds are used) — [VERIFY WITH KALLOL].
6. FAQs (timings, booking, facilities) — draft from existing page facts only.
7. `/archives/[year]` sub-pages when content volume justifies.

**LOW / FUTURE**
8. News/announcements section (yearly reports).
9. Volunteer public signup page (currently gated internal tool).
10. Bengali-language toggle.

## 11. TERMINOLOGY DECISIONS

| Term | Standard | Rejected variants |
|---|---|---|
| Section name | **Puja & Events** | "Events", "Festivals", "Online Services" |
| Booking/offerings | **Puja Offerings** (shop) / **Puja Booking & Donations** (donate) | "Other Donation", "Online Puja Booking" |
| Cultural events | **Cultural Events** + specific names (Rabindra Jayanti, Poila Baishakh) | "Events" group, full "Rabindranath Tagore Birthday" in nav |
| History | **Past Events** (nav label) at `/archives` | "Archive" as a nav word |
| Community section | **Community** with items Facilities & Services / Library / Medical Services | "Library Services", "Medical & Library Facility" |
| Poila Baishakh spelling | **Poila Baishakh** (footer label; page title "Poila Baishak" unchanged pending committee preference) | — |
| CTA grammar | "Read More" (no double dots), sentence case buttons | "Read More.." |

Culturally meaningful names (puja names, "Kallol Kali Mandir", Bengali terms) untouched.

## 12. ROUTE CHANGES (Phase 4)

| Change | Type |
|---|---|
| `/archives` | NEW page |
| `/sitemap.xml` | NEW (app/sitemap.ts) |
| All existing routes | UNCHANGED (no route moves — IA changed at navigation/link level) |

## 13. REDIRECTS / COMPATIBILITY

`next.config.mjs` now returns 27 permanent redirects:
- 5 pre-existing: `/-2025` puja URLs → evergreen routes
- 22 NEW legacy WordPress paths (from `site-data/pages.json` crawl):
  `/about-kallol`, `/donation`, `/other-donation`, `/puja/*` (6), `/special-puja-services`,
  `/narayan-puja`, `/facility-for-events`, `/medical-library-facility`,
  `/2025-puja-calendar`, `/privacy-policy-2`, `/events`, `/events-2`, `/other-events`,
  `/other-festivals`.

All forms, Instamojo webhooks/return, cart/checkout flow, auth gating untouched.

## 14. ITEMS REQUIRING HUMAN VERIFICATION (Kallol)

1. Phone `+91-8655852917` display shows as `+91-8****2917` in `tel:` hrefs (navbar,
   footer) — likely a masking bug from migration; confirm number and fix format.
2. Founding year / full history facts for About — [VERIFY WITH KALLOL].
3. Committee member list + term year — [VERIFY WITH KALLOL].
4. 2026–27 dates already on pages came from the committee calendar (Bangabda 1433);
   re-confirm before each season.
5. Whether older archive records (pre-2025 photos, programmes) should be published —
   [CONTENT REQUIRED].
6. Preferred spelling: "Poila Baishak" vs "Poila Baishakh" (site currently mixed).
7. Videos: YouTube channel/links — [CONTENT REQUIRED].
8. Social handle on X (`@KallolMumbai`) active? FB/IG links correct?
9. "150 life members / lakhs of well-wishers / thousands of devotees" claims on About —
   [VERIFY WITH KALLOL].

## 15. FUTURE RECOMMENDATIONS

- Phase 5: homepage experience + per-page metadata + fold redundant homepage sections.
- Move hardcoded event cards (upcoming-events, featured-events) into the events store
  so one edit updates calendar + homepage + events page together.
- Consider `/archives/[year]` when any year exceeds ~25 events.
- Add JSON-LD (Organization + Temple + Event) structured data.
- Admin: bulk year-rollover tool for the annual update runbook.

---

*Phase 4 deliverable. Phase 5 (Homepage Experience + Content Structure) should NOT
begin until this document is reviewed.*
