# Kallol Brand System

**Kallol Kali Mandir · Bangur Nagar, Goregaon West, Mumbai**
Phase 3 — Brand identity & visual design system for kallolmumbai.com

---

## 1. Canonical logo

> **The supplied Kallol logo is the sole official brand mark.**

| | |
|---|---|
| **Asset** | `public/images/kallol-logo.png` |
| **Dimensions** | 2193 × 568 px |
| **Ratio** | 2193:568 ≈ 3.86 : 1 |
| **Format** | PNG, transparent background |
| **Colors** | Kallol Maroon `#832F30` (petal forms) · White `#FEFEFE` (letterforms K·L·O) |

The logo is three solid maroon petal/flame forms, each carrying a white
letterform (K, L, O), linked on one continuous horizontal baseline. It is
one unbroken wordmark — treat it as a single indivisible object.

**Prohibited — always, for everyone:**

- redrawing, redrafting, simplifying, or "modernising" any part of it
- creating a "K" icon, monogram, shortened mark, or alternative wordmark
- cropping, stretching, compressing, or rotating
- recoloring, adding gradients, or outlining
- rebuilding it in HTML text or an approximation font
- using it as a repeating pattern or decorative motif

**In code:** always render through `components/brand-logo.tsx`
(`<BrandLogo />`). It is the only sanctioned path to the asset and locks
the 2193:568 ratio at every size.

---

## 2. Logo usage — where and how

The same exact asset appears across the entire site. Because the white
letters sit **inside** solid maroon forms, the logo reads correctly on
light ivory backgrounds, on white, and on deep maroon/charcoal surfaces —
no variants, no color modes, no exceptions.

| Location | Size | Notes |
|---|---|---|
| Navbar — mobile | `size="md"` (44px) | scales proportionally; navbar redesigns around it |
| Navbar — desktop | `size="lg"` (56px) | inside h-16/h-20 bar, clear space right |
| Footer | `size="lg"` (56px) | anchors the contact column on `kallol-950` |
| Homepage hero | `size="hero"` (120px+) | Phase 4 will place it; never over busy image areas without scrim |
| Page mastheads (About, Puja, Events…) | `size="xl"` (80px) | Phase 4+ |
| Loading states | `size="sm"`–`xl"` | quiet pulse on ivory |
| Favicon/OG image | from same asset | no geometry changes when cropping to square — use contained scale-down, not fill-crop |

**Loading states:** `app/loading.tsx` shows the logo centered on ivory
with a breathing baseline bar. Route-level loading states may reuse this
pattern.

**Do not** make the logo disappear on any background — redesign the
surrounding interface (scrim, band, or panel) so the mark stays visible.

---

## 3. Logo clear space

Minimum clear space on all sides: **0.25 × logo height** (`h/4`).

- sm (32px) → 8px · md (44px) → 11px · lg (56px) → 14px · xl (80px) → 20px · hero (120px) → 30px

Never allow text, navigation, buttons, images, or decorative graphics to
enter this zone. The navbar enforces it with `pr-4 md:pr-8` after the
logo; all placements reserve the zone via container padding.

**Minimum size:** 32px height (mobile contexts). Below this the white
letterforms lose legibility.

---

## 4. Logo sizing rules

- Height-driven only: width is always `h × (2193/568)` — the component computes it; never set width independently.
- Never set both width and height in CSS — that is how stretching happens.
- Desktop → tablet → mobile: the same logo scales down proportionally; **there is no shortened mobile mark**. If space is tight, reduce height or restructure the navbar — never the logo.
- `max-w-none` is applied so wide mobile viewports never clip it; at 375px the md logo (44px → ~170px wide) fits with room for the cart + menu buttons.

---

## 5. Color palette

Derived from the logo. Maroon is the anchor; everything else supports it.

### Primary
| Token | Hex | Use |
|---|---|---|
| `kallol-600` | `#832F30` | **Kallol Maroon — the logo color.** Primary actions, active states, links |
| `kallol-700` | `#6F2627` | hover/pressed |
| `kallol-800` | `#591F20` | deep emphasis |
| `kallol-900` | `#3E1617` | large dark surfaces |
| `kallol-950` | `#2A0E0F` | footer, top bar (near-black with maroon warmth) |
| `kallol-50…300` | `#FBF5F5 → #D7A9AA` | tints: selection, washes, hovers |

### Dark
| Token | Hex | Use |
|---|---|---|
| `ink` | `#231F20` | body text, headings |
| `ink-soft` | `#3B3536` | secondary text |
| `ink-mute` | `#6E6667` | captions, metadata |
| `ink-faint` | `#A39B9C` | placeholders (large text only) |

### Light
| Token | Hex | Use |
|---|---|---|
| `ivory` | `#FAF6F0` | page background |
| `ivory-raised` | `#FFFDF9` | cards, navbar, dropdowns |
| `ivory-sun` | `#F3EAD9` | alternating sections |

### Neutrals
| Token | Hex | Use |
|---|---|---|
| `stone-warm` | `#EDE6DC` | quiet section fills |
| `stone-line` | `#DDD3C6` | borders, dividers |
| `stone-paper` | `#F6F1E9` | paper panels |

### Accent (restrained)
| Token | Hex | Use |
|---|---|---|
| `copper` | `#B0793F` | decorative rules/lines and hover detail only. Contrast on ivory is 3.45:1 — NOT AA for small text; never use for text below 24px (18px bold). |
| `copper-deep` | `#8C5D2E` | accent hover |

**Avoid:** neon, bright saturated red, gold-dominant schemes, gradient-heavy
compositions, generic temple-site palettes.

---

## 6. Typography — English

An editorial pairing: serif display voice + sans utility.

| Role | Font | Classes | Notes |
|---|---|---`|---|
| DISPLAY | Source Serif 4 | `font-display`, `text-display-xl` / `text-display` | headlines, hero titles, pull quotes |
| H1 | Source Serif 4 | `text-h1` | page titles |
| H2 | Source Serif 4 | `text-h2` | section headings |
| H3 | Inter SemiBold | `text-h3` | cards, subsections |
| BODY | Inter | `font-sans` base 1rem/1.7 | long-form reading; `text-body-lg` for intros |
| UI | Inter SemiBold | `tracking-caps uppercase text-xs–sm` | nav, buttons, labels |
| CAPTION | Inter | `text-caption` (13px, +4% tracking) | dates, metadata, photo credits |

All sizes are fluid clamps (see `tailwind.config.ts → fontSize`) so no
breakpoint-specific font overrides are needed.

---

## 7. Typography — Bengali

Bengali is a first-class language on this site, not a fallback case.

| Role | Font |
|---|---|
| Display/headings (Bengali) | **Noto Serif Bengali** |
| Body/UI (Bengali) | **Noto Sans Bengali** |

- Font stacks are chained: `--font-display → --font-bengali-serif → serif`,
  so any Bengali glyph in a serif headline automatically renders in Noto
  Serif Bengali — same for sans. **No ugly browser fallbacks.**
- Use `font-bengali` or `lang="bn"` for Bengali-only text blocks; the CSS
  raises line-height to 1.75 for correct matra/conjunct spacing.
- Bengali text is never italicised, never letter-spaced (tracking-caps
  applies to Latin only), never set below 16px.
- Example usage in production: footer sign-off `শ্রী শ্রী কালী`.

---

## 8. Grid

- **Max content width:** `container` capped at **1200px** (`2xl: 1200px`), centered.
- **Gutters:** 16px mobile → 24px sm → 32px lg+ (`container.padding` tokens).
- **Desktop grid:** 12-col mental model; use Tailwind grid utilities at `lg:`/`xl:` breakpoints.
- **Tablet:** 2-col cards, 1-col prose (`md:`).
- **Mobile:** single column stack; full-bleed imagery allowed with `px-4` inset for text.
- **Prose measure:** `max-w-prose` (44rem ≈ 70–75ch) for articles; `max-w-prose-wide` (56rem) for image+text editorial spreads.

## 9. Spacing & rhythm

Tailwind's 4px scale is the spacing system — no arbitrary values.

- **Section spacing:** `py-16 md:py-24` standard; `py-12 md:py-16` compact.
- **Card grid gaps:** `gap-6` standard, `gap-4` dense grids.
- **Vertical rhythm inside sections:** header → content `mt-8`, content → footer rule `mt-12`.
- **Component padding:** cards `p-6`; masthead inner `py-10 md:py-16`.
- **Breakpoints:** sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536 (Tailwind defaults).
- **Transitions:** 200ms `ease-calm` for colors/opacity; 300ms for transforms; reduced-motion kills all.

---

## 10. Components — visual language

**Principle: editorial, not floating.** Borders, alignment, whitespace and
typography carry the design. Shadows are whisper-quiet and rare.

- **NAVBAR** — ivory-raised bar, maroon-950 top strip (contact info), canonical logo left, Inter semibold nav with a maroon baseline underline that scales in on hover (echoes the logo's linked baseline), maroon Donate button right, cart + hamburger on mobile. Dropdowns: ivory panel, 2px maroon top border, stone-line row dividers.
- **BUTTONS** — `btn-primary` (maroon fill), `btn-outline` (maroon line), `btn-secondary` (ink fill), `btn-ghost`. Uppercase Inter semibold with `tracking-caps`, `rounded-md` (6px), 200ms color transitions, visible maroon focus ring with ivory offset. Radix `Button` variants map to the same tokens via `--primary`.
- **CARDS** — `card-kallol`: ivory-raised, 1px stone-line border, 6px radius, no resting shadow; on hover a `shadow-raised` (0 2px 8px / 7%) may appear. Image top + text bottom; caption row uses `text-caption` with a thin maroon date tick.
- **SECTION HEADERS** — eyebrow (uppercase maroon, `tracking-caps`) above a serif `text-h2` title; optional `.kallol-rule` divider (three maroon dots on a stone line — the logo's three petal forms abstracted).
- **FORMS** — `field-label` + `field-input`: ivory-raised inputs, stone-line borders, maroon focus ring at 60% alpha. Never remove focus rings.
- **TIMELINES / EVENT METADATA** — thin stone-line spine; maroon node dots (3-dot motif); date in `text-caption` uppercase, venue in body text.
- **GALLERY** — uniform aspect ratios (4:3 or 3:2), 2px ivory gaps, caption strip below on hover-reveal or static `img-caption`.
- **EVENT LABELS** — small uppercase maroon tags with 1px maroon/40 border on ivory; never pill-shaped chips with heavy color fills.
- **FOOTER** — `kallol-950`, canonical logo, ivory/50 uppercase column headers, ivory/80 links, hairline `border-ivory/10` dividers, Bengali sign-off.

---

## 11. Photography direction

**Real Kallol imagery first, always.** The mandir, pujas, festivals,
community programs, medical camps, historical photos, people.

- Feel: authentic, documentary, warm, human, architectural.
- Prefer natural light; no heavy filters, no dramatic color grades, no vignettes.
- Aspect ratios: hero 21:9–16:9; cards 4:3 or 3:2; gallery uniform per grid; portraits 3:4.
- Treatment: consistent modest contrast; scrim `bg-kallol-950/40–60` under text on photos — never place the logo or headlines on busy unscrimmed areas.
- Captions: `img-caption` class, name the people/place/occasion ("Kali Puja 2024, Kallol Kali Mandir"), credit photographers when known.
- Never use the logo as a photo overlay watermark; never apply decorative gold frames.

---

## 12. Motion principles

*(Principles only — full motion system arrives in a later phase.)*

- Restrained, elegant, intentional. Motion explains; it never entertains.
- Durations: 200ms micro (hover/focus), 300–500ms reveals, 600–800ms hero entrances at most.
- Easing: `--kallol-ease` (cubic-bezier(0.25, 0.46, 0.45, 0.94)) — calm in/out.
- Vocabulary (future): horizontal line reveals (baseline motif), image mask-up reveals, gentle opacity fades, slow (≥6s) hero crossfades (already in place), subtle logo entrance (fade/mask only — **never** geometry animation, morphing, or redrawing of the mark).
- `prefers-reduced-motion: reduce` disables everything (enforced globally in globals.css).

---

## 13. Accessibility

- **Contrast:** ink-on-ivory 13.8:1, maroon-600-on-ivory 8.1:1, ivory-on-maroon-600 8.1:1, ivory/80-on-kallol-950 ≥ 7:1 — all pass WCAG AA (most pass AAA for large text).
- **Focus:** visible 2px maroon focus rings with ivory offset on all interactive elements; never `outline: none` without replacement.
- **Type:** fluid scale, ≥16px body, Bengali ≥16px with 1.75 line-height.
- **Semantics:** logo uses descriptive alt text; icon-only buttons carry `aria-label`; heading hierarchy h1→h3 without skips; nav landmarks are native `<nav>/<header>/<footer>`.
- **Motion:** global reduced-motion guard.
- **Alt text:** describe the scene ("Devotees at Kali Puja aarti, Kallol Kali Mandir") — decorative images get `alt=""`.

---

## Quick-reference file map

| What | Where |
|---|---|
| Design tokens (color/type/spacing/shadows) | `tailwind.config.ts` |
| CSS variables + base styles + component classes | `app/globals.css` |
| Canonical logo asset | `public/images/kallol-logo.png` |
| Logo React component (ratio-locked) | `components/brand-logo.tsx` |
| Fonts (Source Serif 4, Inter, Noto Serif/Sans Bengali) | `app/clientLayout.tsx` |
| Navbar / Footer implementations | `components/navbar.tsx`, `components/footer.tsx` |
| Loading state | `app/loading.tsx` |
