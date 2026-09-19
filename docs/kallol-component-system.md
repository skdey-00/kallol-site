# Kallol Component System

**Kallol Kali Mandir · Bangur Nagar, Goregaon West, Mumbai**
Phase 6 — the reusable interface system extracted from the Phase 5B homepage.

**Depends on:** `docs/kallol-brand-system.md` (Phase 3, LOCKED — logo, palette, fonts),
`docs/kallol-information-architecture.md` (Phase 4, authoritative — nav IA, routes),
`docs/kallol-homepage-visual-direction.md` (Phase 5B — the visual reference this
system was extracted from).

**Purpose.** One visual language for every future page. The homepage establishes
the language (editorial, asymmetric, photographic, calm, premium); this document
and `components/kallol/` turn it into reliable, reusable parts. Phase 7 applies
this system page-by-page; Phase 6 does **not** redesign those pages.

---

## PLAIN ENGLISH CHEAT SHEET

```
RULES THAT MATTER MOST (the 10-commandment version)

1.  ROWS, NOT CARD GRIDS      — lists of things = ruled hairline rows
2.  ONE PRIMARY ACTION        — maroon button per view; everything else is a
                                quiet editorial link (underline sweep)
3.  BIG + SMALL = THE DESIGN  — display/statement serif vs 13px uppercase
                                tracked captions; nothing in the middle mush
4.  REAL PHOTOS ONLY          — overflow-hidden frame, fixed crop, breathe on
                                hover, quiet caption below
5.  MAROON IS THE ANCHOR      — #832F30 (logo color, never shifted); ivory is
                                the air; kallol-950 is the ground for asks
6.  HAIRLINES EVERYWHERE      — stone-line borders carry the design; shadows
                                are whisper-quiet and rare
7.  MOTION EXPLAINS           — reveal-up / reveal-img / rule-draw, once, on
                                scroll; 200–700ms; reduced-motion kills all
8.  NAV IS FIXED              — 5 groups + Contact + Donate button (Phase 4
                                IA is LAW; do not restructure)
9.  LOGO IS IMMUTABLE         — always via <BrandLogo/>, never redrawn
10. NO NEW DEPENDENCIES       — CSS motion + one observer; no animation
                                libraries, no icon spam, no gradients
```

**Where things live**

| What | Where |
|---|---|
| Design tokens (color/type/spacing/radius/shadow) | `tailwind.config.ts` |
| CSS classes: buttons, fields, cards, motion vocabulary | `app/globals.css` |
| React components (the system) | `components/kallol/` |
| Homepage (the reference implementation) | `components/home/` |
| Live shadcn primitives kept for forms/admin | `components/ui/` (8 files) |
| Events store (one source of truth) | `data/local-events.json` via `lib/events-store.ts` |
| Canonical logo | `public/images/kallol-logo.png` via `components/brand-logo.tsx` |

---

## 1. Design tokens

All tokens live in `tailwind.config.ts` (single source of truth, no raw hex in
components) and `app/globals.css` (CSS variables + component classes). The full
token tables are in `docs/kallol-brand-system.md` §5–9 — unchanged in Phase 6.
What Phase 6 adds:

**CSS component classes** (`globals.css` `@layer components`):

| Class | Purpose |
|---|---|
| `.btn-primary` `.btn-outline` `.btn-secondary` `.btn-ghost` | buttons (§4) |
| `.field-label` `.field-input` `.field-error` `.field-help` | forms (§11) |
| `.field-input[aria-invalid="true"]` | validation state |
| `.card-kallol` | editorial card |
| `.meta-label` | small uppercase tracked metadata |
| `.section-eyebrow` `.section-title` | section heads |
| `.img-caption` | photo captions |
| `.kallol-rule` `.kallol-hr` | dividers (3-dot / single hairline) |
| `.link-editorial` | underline-sweep link |
| `.reveal-up` `.reveal-img` `.rule-draw` `.hero-enter` `.menu-enter` `.img-breathe` | motion (§15) |
| `.bengali-pattern` `.hero-gradient` `.animate-float` `.animate-spin-slow` | LEGACY — do not use in new work |

**Motion variables:** `--kallol-ease: cubic-bezier(0.25,0.46,0.45,0.94)`,
`--kallol-duration: 200ms`, per-element `--reveal-delay` (60/140/220ms stagger).

**Corner radius:** `--radius: 0.375rem` (6px) everywhere — `rounded-md`.
Editorial, never pill. Buttons/inputs/cards all share it.

**Shadows:** `card` (rest, rare), `raised` (hover), `dropdown`, `overlay`.
Borders before shadows, always.

---

## 2. Typography

Fonts and the fluid scale are LOCKED from Phase 3/5B (Source Serif 4 + Inter +
Noto Serif/Sans Bengali chains — `app/clientLayout.tsx`). The system's type
voices, big to small:

| Voice | Class | Use |
|---|---|---|
| Hero display | `text-display-xl` | homepage masthead only |
| Date numerals | `text-date-xl` | featured-event dates on imagery (decorative scale) |
| Display | `text-display` | none currently; reserved |
| **Page title** | `PageHeader` → `text-statement md:text-h1` | every interior page's h1 |
| **Section title** | `Section` → `.section-title` (`text-h2`) | section h2 |
| **Editorial statement** | `text-statement` | section-opening statements, archive years |
| **Row/entry title** | `text-h2`/`text-h3` serif | ruled rows, feature rows |
| **Body** | base 1rem Inter / `text-body-lg` intros | prose |
| **Metadata** | `.meta-label` / `.img-caption` (13px, +4% tracking) | dates, venues, captions |
| **UI** | `text-sm font-semibold uppercase tracking-caps` | nav, buttons, labels |

Rules:
- No arbitrary `text-3xl`-style sizes in new work — use the voices above.
- The big-to-small ratio IS the design; avoid mid-scale mush.
- Bengali: `lang="bn"` or `.font-bengali`, ≥16px, line-height 1.75, never
  italicised or letter-spaced. The font chains route Bengali glyphs in mixed
  headlines automatically.

---

## 3. Colors

From the brand system (LOCKED). Working rules:

- **kallol-600 `#832F30`** — logo color, primary actions, active states, links.
- **kallol-950 `#2A0E0F`** — footer, participate/CTA bands, navbar top strip.
- **ivory / ivory-raised / ivory-sun / stone-*** — backgrounds in rhythm.
- **ink / ink-soft / ink-mute / ink-faint** — text hierarchy.
- **copper** — decorative detail only, never small text (3.45:1 fails AA).
- Section tones (`Section` `tone` prop): `ivory · sun · paper · warm · raised · maroon`.
- Never raw `#44233b`, `gray-*`, or any hex outside `tailwind.config.ts`.

---

## 4. Buttons

CSS classes, not a new React component (they style `Link` or `button` alike):

| Variant | Class | Use |
|---|---|---|
| PRIMARY | `.btn-primary` | maroon fill — ONE per view |
| SECONDARY | `.btn-outline` | maroon line, kallol-50 hover |
| TEXT/LINK | `.link-editorial` (+ ArrowLink) | exploratory actions |
| UTILITY | shadcn `Button` | admin/gated tooling only |

All variants: uppercase Inter semibold `tracking-caps`, `rounded-md`, 200ms
`ease-calm` color transitions, 2px maroon focus ring with ivory offset,
`disabled:opacity-50 disabled:pointer-events-none`. Hover states: primary
kallol-600→700, outline gains kallol-50 fill, ghost gains kallol-50.
Sentence-case labels ("Donate", "Contact Kallol") — no "Read More..".

---

## 5. Links

| Kind | Treatment |
|---|---|
| Inline prose link | `link-editorial text-kallol-700` |
| Navigation link | navbar/footer treatments (maroon hover, baseline indicator) |
| Arrow link | `ArrowLink` — uppercase label + nudge arrow |
| External | plain `<a>` + `target="_blank" rel="noreferrer"` |
| On dark (kallol-950) | `text-ivory/90 hover:text-ivory` |

Rules: every link is visibly a link (underlined on hover via the sweep, or
colored + underlined). Nothing that looks like a link may be non-interactive.
No `cursor-pointer` on non-links.

---

## 6. Page headers

`components/kallol/page-header.tsx` — `PageHeader`.

**Purpose.** The single interior-page header, replacing the legacy purple
PageBanner everywhere. Eyebrow (IA group) → serif h1 → optional intro →
drawing rule → breadcrumbs above.

- **default variant** — text-only, tone ivory/sun. Used on all 17 pages now.
- **image variant** — adds portrait photography right on lg (4:5). Available
  now; adoption per-page happens in Phase 7 (puja pages carry strong tiles,
  but their bodies already show that photo — avoid duplication).

WHEN NOT TO USE: the homepage (its Hero is the masthead), or modal/admin
contexts. Breadcrumbs: every interior page; never on the homepage.

**Responsive:** title `text-statement → md:text-h1`; crumbs wrap; image drops
above title on <lg.

---

## 7. Sections

`components/kallol/section.tsx` — `Section`.

Wraps interior-page sections: `<section aria-labelledby>`, container, the
standard spacing rhythm (`py-16 md:py-24 lg:py-28`, compact `py-12 md:py-16`),
the typographic head (eyebrow + h2 + intro + rule-draw), an `actions` slot,
and six background tones for the quiet→loud rhythm.

Not every section needs the head — pass only `tone`+`children` for plain
content blocks. Not every section is a card grid — in fact, prefer rows.
Editorial asymmetry (offset images, 7/5 splits, sticky rails) is composed with
gradients of these primitives, exactly as the homepage does.

---

## 8. Cards

`.card-kallol` CSS class + composition. Cards exist ONLY where grouping
genuinely helps: archive "preserved in full" highlights, shop products,
admin tables. The homepage uses almost no cards — rows and figures instead.
No universal mega-card with 20 conditional props; compose small parts.
`card-kallol`: ivory-raised, 1px stone-line, 6px radius, no resting shadow,
`shadow-raised` on hover only.

---

## 9. Events

Data: `data/local-events.json` → `getEvents()` → `EventView`
(`components/kallol/event-view.ts` — the merged, single interface;
`eventHref()` routes titles to Phase 4 pages; `buildHomepageEvents()` in
`components/home/events-view.ts` collapses festival runs into ranges).

| Component | Treatment | Use |
|---|---|---|
| `FeaturedEvent` | cover story: photo, date-xl numerals, statement title, btn-primary | the one event that matters now |
| `EventRail` | ruled rows, date right, sticky-capable | upcoming lists everywhere |
| `RuledIndex` | numbered 01–n rows, inline note, date chip | minor pujas / service indexes |
| `EventMeta` | date maroon + time/venue muted line | under any event title |
| `ArchiveList` | year-grouped ruled rows, serif year | past events |

The same event renders identically across homepage / events / archives — same
store, same components, same classes.

---

## 10. Gallery

`components/kallol/figure.tsx` — `Figure` (+ the homepage `GalleryTeaser`
composition as reference). Treatment: overflow-hidden frame, fixed aspect from
the crop vocabulary (4/5 portrait editorial · 3/2 landscape · 4/3 standard ·
21/9 wide), `img-breathe` hover (1.02, 600ms), quiet caption below
(`.img-caption`), `reveal-img` entrance. Crops are intentional and varied —
NOT a uniform 3-col grid. `/photos` keeps its working lightbox (Phase 7 will
re-skin it with `Figure`).

---

## 11. Forms

Presentation classes only — every existing form's logic/validation/payment
flow untouched. `field-label`, `field-input` (ivory-raised, stone-line border,
maroon focus ring), `field-error` / `field-help`, `aria-invalid` styling.
shadcn `Input/Textarea/Select/Label/Tabs` remain the interactive primitives
in donate/checkout/admin — they already inherit the token palette via CSS
variables. Phase 7 re-skins form pages with these classes; Phase 6 changes
nothing functional.

---

## 12. Navigation (navbar)

`components/navbar.tsx`. Phase 4 IA is authoritative and unchanged:
ABOUT / PUJA & EVENTS / COMMUNITY / GALLERY / SERVICES / CONTACT + DONATE.

Phase 6 refinements: maroon baseline indicator now persists on the ACTIVE
group (`aria-current="page"`), dropdown marks the current child, mobile menu
rebuilds on CSS (`menu-enter`, `hidden` toggle, `aria-expanded` +
`aria-controls`, body-scroll lock, auto-close on route change) — framer-motion
removed from the navbar. Logo via `BrandLogo` (immutable). Keyboard: dropdowns
open on focus-within as before; all items are real links.

---

## 13. Footer

`components/footer.tsx` — unchanged structure (Phase 4): contact column with
canonical logo, Explore / Puja & Events / Participate columns, hairline
`border-ivory/10` dividers, Bengali sign-off শ্রী শ্রী কালী. No overload, no
new columns. Phase 7 may re-skin link treatments only.

---

## 14. Breadcrumbs

Built into `PageHeader` (crumbs render above the eyebrow, `nav[aria-label=
"Breadcrumb"]`, `aria-current="page"` on the leaf, `→` separators, Home
prepended automatically). Deeper pages pass their IA trail, e.g. Durga Puja:
Home → Puja & Events → Durga Puja. Never on the homepage.

---

## 15. Motion

Extracted from Phase 5B — CSS classes + one small `Reveal` observer
(`components/kallol/reveal.tsx`), no libraries.

| Class | Behavior |
|---|---|
| `.reveal-up` | +14px rise + fade, 600ms, once, `--reveal-delay` stagger |
| `.reveal-img` | image mask-up inside overflow-hidden frame, 700ms |
| `.rule-draw` | hairline scaleX 0→1 origin-left, 550ms — the baseline motif |
| `.hero-enter` | one-time load entrance, staggered 80→380ms |
| `.menu-enter` | mobile-menu fade, 300ms |
| `.link-editorial` | underline sweep on hover/focus, 300ms |
| `.img-breathe` | hover scale 1.02, 600ms |
| hero crossfade | ≥7s/slide (homepage slideshow, kept) |

**Guards (non-negotiable):** initial hidden states scoped to `html.js` (no-JS
sees everything); one IntersectionObserver per section wrapper, once-only;
global `prefers-reduced-motion` collapse to 0.01ms; motion never gates clicks,
content, or layout (transform/opacity only); no scroll handlers, no parallax.

---

## 16. Responsive rules

Breakpoints: Tailwind defaults (sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536).
Container caps at 1200px, gutters 16→24→32px.

- **Type** scales via clamps — no breakpoint font overrides.
- **Grids**: 12-col mental model at lg; editorial splits are 7/5; puja majors
  2-up at md with offset; cards 3→2→1; ruled rows stay rows (never become
  cards) — the hairline survives every width.
- **Images** crop by aspect class, never stretch; hero is full-bleed with
  bottom-anchored content; thumbnails move above text on mobile.
- **Navbar**: desktop bar → lg; hamburger below; menu = full overlay panel
  with the same group structure incl. dividers.
- **Buttons** stack full-width on mobile (flex-col gap); CTAs never shrink
  below 44px touch target.
- **Spacing**: section rhythm scales py-16→24→28; container padding as above.
- Verified at 1440/1280/1024/768/430/390/375 — no horizontal overflow (§QA).

---

## 17. Accessibility

- Semantic HTML first: real `<nav>/<header>/<footer>/<section>/<figure>/<dl>`,
  one h1 (PageHeader) then h2/h3 in order; ARIA only where HTML can't express
  it (aria-current, aria-expanded, breadcrumb nav label).
- Keyboard: all interactive elements are links/buttons; visible 2px maroon
  focus rings with ivory offset everywhere (never removed); dropdowns
  focus-within; mobile menu is a labeled region; Escape closes lightboxes.
- Contrast: ink/ivory 13.8:1, maroon/ivory 8.1:1, ivory/kallol-950 ≥7:1 —
  AA+ throughout; copper never below 24px text.
- Motion: full reduced-motion guard; reveals never gate content.
- Touch targets ≥44px; alt text descriptive; decorative overlays aria-hidden.
- Bengali at ≥16px / 1.75 line-height.

---

## 18. Component usage guidelines (quick matrix)

| Component | Purpose | When to use | When NOT | Responsive |
|---|---|---|---|---|
| `Reveal` | scroll-reveal wrapper | section entrances | above-the-fold heroes (use hero-enter) | same |
| `PageHeader` | interior page h1 block | every inner page | homepage, modals | title scales, image stacks |
| `Section` | section wrapper + head | all interior sections | homepage (has own) | padding rhythm |
| `Figure` | standardized photo | any photography | decorative bg (plain img) | crop via aspect |
| `ArrowLink` | editorial link + arrow | secondary actions | primary actions | wraps |
| `MetaList` | dl metadata set | contact/visit/practical | prose | stacks |
| `RuledIndex` | numbered ruled list | peer entries | dated upcoming events | note hides <md |
| `FeatureRowList` | content+thumb rows | services/community | compact indexes | thumb above <md |
| `CtaBand` | maroon closing ask | page ends | mid-page | quiet col stacks |
| `EventRail` | upcoming-event rows | sidebars, rails | past events | rows |
| `EventMeta` | date/time/place line | under event titles | non-events | wraps |
| `FeaturedEvent` | cover-story event | the featured event | lists | date numerals ≥md |
| `ArchiveList` | year-grouped history | /archives | future events | rows wrap |

**Anti-patterns (rejected):** SaaS dashboards, icon-card grids, gradient
banners, glassmorphism, neon, pill chips, uniform 3-col everything, text-left/
image-right marketing splits, invented content, logo redraws, animation
libraries.

---

## Phase 6 audit decisions (record)

| Item | Verdict |
|---|---|
| navbar, footer, brand-logo, events store, 8 live ui primitives | KEEP |
| PageBanner (purple, 17 pages) | REPLACE → `PageHeader` (done) |
| EventView ×2, Reveal, eventHref duplication | MERGE → `components/kallol/` (done) |
| home/reveal.tsx, home/types.ts | REMOVE (done) |
| 41 unused shadcn ui files (sidebar tree, carousel, chart, form…) | REMOVE (done) |
| navbar framer-motion | REPLACE with CSS (done) |
| /archives | REBUILT with ArchiveList (done) |
| inner-page bodies (About, pujas, Gallery, Services…) | UNTOUCHED — Phase 7 |

**Known limitations:** inner-page bodies still carry legacy gray/purple styling
until Phase 7; phone `tel:` masking bug pre-existing (flagged Phase 4 §14);
`/videos` still "Coming Soon"; donate/checkout/admin pages still use
framer-motion + shadcn skins (functional, untouched by design); PageHeader
image variant documented but not yet applied to puja pages (their bodies
already show the photo — Phase 7 composes properly).
