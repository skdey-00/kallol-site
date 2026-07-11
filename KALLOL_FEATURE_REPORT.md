# Kallol Website — Feature Report

**Org:** Kallol Bengali Cultural Organization / Kali Mandir, Bangur Nagar, Goregaon (Mumbai)
**Stack:** Next.js 15 App Router + React 19 + Supabase (PostgreSQL) + Tailwind + shadcn/ui + framer-motion
**Deployment:** Vercel (GitHub-connected)

---

## Pages (10)

### 1. `/` — Home
- Hero section with org name + call-to-action buttons
- Rotating welcome banner (auto-play carousel, 5s interval, prev/next arrows, dot indicators)
- 4 feature cards (Culture, Community, Events, Spiritual)
- Featured events carousel (auto-play, manual override pauses autoplay)
- Visit-us CTA section

### 2. `/upcoming-events`
- 6 hardcoded events with images
- Filterable by category: All / Social / Cultural / Educational / Community
- Featured event cards at top + filterable grid below

### 3. `/calendar`
- Month-by-month navigable calendar (prev/next month buttons)
- 8–13 events with category color-coding
- Role-gated extras:
  - 2 "member-meeting" events appear if **any** user is logged in
  - 3 "committee-meeting" events appear for **executive** members
- Category legend is also conditional on role

### 4. `/about`
- Org history, mission/vision statements
- 4 core values, 5 milestones (1985–2020 timeline)
- Kali Mandir connection narrative
- Impact stats: 500+ members, 40+ events, 200+ children

### 5. `/contact`
- Address, phone, email, social links (Facebook, Instagram, Twitter)
- Embedded Google Map iframe (Kallol Kali Mandir location)
- "Email Us Directly" mailto button

### 6. `/donate` — General Donation
- Amount picker: predefined buttons (₹500 / ₹1,000 / ₹2,500 / ₹5,000 / ₹10,000, multi-select, summed) or custom amount input
- Payment method tabs:
  - **UPI** — ID: `kallol8655852917@iob` + copy-to-clipboard button
  - **Paytm** — `+91 98765 43210` + copy-to-clipboard button
- 12-field donor form: First Name, Last Name, Gotra, Phone Number, Email, Country/Region, Street Address, Town/City, State, PIN Code, Message (optional)
- Inline validation on all required fields; email format regex validated
- On submit → simulated payment → DB insert → PDF receipt download → QR token display (if applicable)
- Form resets on success

### 7. `/donate/[pujaId]` — Puja-Specific Donation
- Item grid: toggle-selectable puja items (purpose, ₹amount, date badge); multi-select with removable selected-items list
- Offerings section: checkbox-selectable offerings (name, ₹amount, description)
- Live total = sum of selected items + offerings
- Submit button disabled until at least 1 item or offering selected
- Same 12-field donor form as general donation
- **Generates QR code on success** (unlike general donations)
- `notFound()` (404) if pujaId is invalid

### 8. `/login`
- Email/password form with show/hide password toggle
- Demo credentials hint shown (Admin + Volunteer)
- Mock auth — 1s delay, checks against hardcoded user table

### 9. `/admin` — Admin Dashboard
- **Gated:** `admin@kallol.org` only (client-side check)
- Two scrollable columns:
  - **Successful Donations** (green card)
  - **Unsuccessful Donations** (red card)
- Each record shows: Name (Gotra), Amount, Payment Method, Timestamp
- CSV export buttons (one per column) — downloads all 19 fields including JSON-stringified donation items and QR scan history
- Toast notification if no data to export

### 10. `/volunteer` — QR Validation Hub
- **Gated:** `membershipType === "volunteer"` OR admin email
- Personalized welcome greeting
- QR code scanner:
  - Camera-based (`react-qr-reader`, rear camera preferred)
  - Animated target box overlay
  - Open/Close scanner toggle
- Manual token entry fallback (Validate button)
- Color-coded scan result panel:
  - 🟢 Green = valid scan
  - 🔴 Red = invalid/error
  - 🟡 Yellow = already used
  - 🔵 Blue = scanning in progress
- Shows donor name, amount, puja purpose, category, original donation date
- "Contact Coordinator" CTA (mailto: `volunteer@kallol.org`)

---

## Navigation Structure

### Navbar (`components/navbar.tsx`)
- Fixed top header, transparent → white/blur on scroll (scrollY > 10)
- Logo links home
- Desktop links: Home, Upcoming Events, Calendar, About Us, Contact Us, Donate (INR)
- Conditional links:
  - **Volunteer** — appears for volunteer role or admin
  - **Admin** — appears for admin email only
- Mobile: hamburger menu with framer-motion animated slide-down
- Dark-mode toggle visible only in mobile nav

### Footer (`components/footer.tsx`)
- 4-column layout:
  1. Logo + tagline + social links (Facebook, Instagram, Twitter)
  2. Login/Logout button (conditional on user state)
  3. Quick Links
  4. Contact column (address, phone, email)
- Newsletter form (visual only — no submit handler)
- Copyright with dynamic year

### Scroll Behavior
- `clientLayout.tsx` resets `window.scrollTo(0, 0)` on every route change

---

## Backend Features

### A. Database (Supabase / PostgreSQL)

- **Single table:** `donations` (19 columns)
- Accessed exclusively via PostgREST fluent API (`supabase.from(...)`) — no raw SQL at runtime
- Client initialized with **anon key** in two server-action files:
  - `actions/donations.ts`
  - `actions/qr-validation.ts`
- No server-side auth checks — all server actions are publicly callable
- RLS is commented out in the migration script (`scripts/001_create_donations_table.sql`)

**Table Schema (inferred from code):**

| Column | Type | Notes |
|---|---|---|
| `id` | UUID (PK) | Auto-generated `uuid_generate_v4()` |
| `first_name` | TEXT, NOT NULL | |
| `last_name` | TEXT, NOT NULL | |
| `gotra` | TEXT, NOT NULL | |
| `phone_number` | TEXT, NOT NULL | |
| `email` | TEXT | *New field* |
| `country` | TEXT | *New field* |
| `street_address` | TEXT | *New field* |
| `town_city` | TEXT | *New field* |
| `state_province` | TEXT | *New field* |
| `pin_code` | TEXT | *New field* |
| `total_amount` | NUMERIC(10,2) | Inserted as `.toFixed(2)` string |
| `payment_method` | TEXT, NOT NULL | Values: `"upi"`, others |
| `message` | TEXT, nullable | |
| `status` | TEXT, NOT NULL | `"success"` or `"failure"` |
| `timestamp` | TIMESTAMPTZ | `DEFAULT NOW()`, used for ordering |
| `qr_code_token` | TEXT, UNIQUE | `crypto.randomUUID()`, indexed |
| `donation_items` | JSONB | Array of `{purpose, category, amount, date?}` |
| `qr_code_scans` | JSONB | Array of `{timestamp, itemIndex}` |

**All Queries (5 total):**

| Operation | Location | Pattern |
|---|---|---|
| INSERT | `donations.ts` (`submitDonation`) | `.insert([data]).select().single()` |
| SELECT all | `donations.ts` (`getDonations`) | `.select("*").order("timestamp", {ascending: false})` |
| SELECT filtered | `donations.ts` (`exportDonationsToCsv`) | `.select("id, first_name, ...").eq("status", type)` |
| SELECT by token | `qr-validation.ts` (`validateQrCode`) | `.select("*").eq("qr_code_token", token).single()` |
| UPDATE | `qr-validation.ts` (`validateQrCode`) | `.update({qr_code_scans: [...]}).eq("id", donation.id)` |

No DELETE, UPSERT, or `.rpc()` calls exist.

---

### B. Payment Simulation

- `Math.random() > 0.2` → **~80% success rate**
- Status stored as `"success"` or `"failure"`
- Failed payments **are still inserted** to DB (with `status: "failure"`)
- No real payment gateway integration

---

### C. PDF Receipt Generation (pdf-lib)

- **Format:** A4 Landscape
- **Layout:**
  - Kallol logo top-left
  - Receipt ID (from DB-generated UUID), date, time
  - Donor info block including gotra + full address (email, street, town/city, state, PIN, country)
  - Itemized donation details (each puja/offering line item with amount)
  - Thank-you text
  - QR code bottom-right with "Scan for verification" caption (if applicable)
- Returned as base64 → decoded to Blob → auto-downloaded in browser
- Filename: `Kallol_Donation_Receipt_YYYY-MM-DD.pdf`

---

### D. One-Time QR Code System

> The headline backend feature — enables on-site puja verification via scannable QR codes.

#### Token Generation
- `crypto.randomUUID()` generates a unique UUID per puja donation
- Stored in `qr_code_token` column (UNIQUE, indexed)
- QR image rendered via `qrcode` library: `qrcode.toDataURL(token, {errorCorrectionLevel: "H", margin: 1, scale: 4})`
- The QR encodes **only the raw UUID token string** — no donor data, no URL, no embedded info
- **Error correction level "H"** (highest — 30% recoverable) for durability on printed receipts

#### When QR is Generated
- **Only** when the donation includes at least one item where `category !== "General Offering"`
- General donations (no puja items) → **no QR token** (`null`)
- Offering-only donations → **no QR token** (offerings are tagged `"General Offering"`)
- Puja donations (Durga/Kali/Saraswati/Lakshmi Puja items) → **QR token generated**

#### QR in the Receipt
- PNG embedded bottom-right of the PDF receipt
- Caption: "Scan for verification"
- Donor brings the printed receipt (or shows digital copy) to the temple

#### Scanning / Validation Flow (`actions/qr-validation.ts`)

1. Volunteer opens scanner on `/volunteer` page
2. `react-qr-reader` uses rear camera (`facingMode: "environment"`), 500ms scan delay
3. On successful scan (or manual token entry) → calls `validateQrCode(token)` server action
4. Server action:
   - Looks up donation by `qr_code_token` (SELECT by token)
   - If not found → **"Invalid QR Code"**
   - Filters `donationItems` to scannable items (excludes `"General Offering"`)
   - Filters out already-scanned items (tracked by `itemIndex` in `qr_code_scans` JSONB array)
   - **Prioritizes today's date:** finds an unscanned item whose scheduled `date` equals today
   - If found → appends `{timestamp: now, itemIndex}` to `qr_code_scans` → UPDATEs DB → returns **success** with donor + item info
   - If all scannable items already scanned → **"QR Code fully used"** + lists all scan timestamps
   - If unscanned items exist but none scheduled for today → **fails** with nearest available date suggestion

#### Multi-Scan Design
- A **single QR can be scanned multiple times** — once per puja service day
- Example: An 8-item Durga Puja donation (Saptami, Ashtami, Navami, Sandhi Puja, etc.) can be scanned on each respective puja day
- Scan history tracked in `qr_code_scans` JSONB column as an array of `{timestamp, itemIndex}` objects
- Each scan is tied to a specific puja item by its index in the `donation_items` array
- No same-day dedup beyond the item-index filter

#### What the Volunteer Sees
- Color-coded result box:
  - 🟢 **Green** = valid scan (shows donor name, amount, purpose, category, scan timestamp)
  - 🔴 **Red** = invalid token or error
  - 🟡 **Yellow** = QR fully used / no item for today
  - 🔵 **Blue** = scanning in progress
- Scanner auto-hides on valid scan

---

### E. CSV Export

- Fetches donations filtered by status (`success` or `failure`)
- Outputs 19 columns including JSON-stringified `donation_items` and `qr_code_scans`
- Proper CSV escaping (commas, quotes handled)
- Browser download with date-stamped filename: `successful_donations_YYYY-MM-DD.csv` / `unsuccessful_donations_YYYY-MM-DD.csv`
- Toast notification if no data to export

---

### F. Auth System (Mock)

- **5 hardcoded users** with plaintext passwords, stored in `hooks/use-auth.tsx`:

| Email | Password | Name | Role | Join Date |
|---|---|---|---|---|
| `admin@kallol.org` | `admin123` | Kallol Admin | life | 1985 |
| `member@kallol.org` | `member123` | Rajesh Chatterjee | life | 1990 |
| `executive@kallol.org` | `executive123` | Priya Banerjee | executive | 2010 |
| `life@kallol.org` | `life123` | Subhash Bose | life | 1995 |
| `volunteer@kallol.org` | `volunteer123` | Anjali Das | volunteer | 2023 |

- Login page shows only Admin + Volunteer demo credentials; other 3 discoverable from source
- User object stored in `localStorage` as `kallol_user`
- **No Supabase Auth, no JWT, no session tokens**
- Gating is **client-side only** — all server actions bypass auth

**What's gated:**
- `/admin` — email must === `admin@kallol.org`
- `/volunteer` — `membershipType === "volunteer"` OR admin email
- Navbar: Volunteer link (volunteer/admin), Admin link (admin only)
- Calendar: role-gated event visibility (see Calendar page above)

---

### G. Toast Notifications

- Custom system (`hooks/use-toast.tsx`)
- 4 variants: success, error, warning, default
- 5-second auto-dismiss
- Bottom-right fixed position
- Manual close button

---

## Puja Catalog (`lib/puja-data.ts`)

### 1. Durga Puja (`durga-puja`)
**Items (8):**
| Item | Amount | Date |
|---|---|---|
| Saptami Special Puja | ₹2,000 | 2025-09-29 |
| Saptami Evening Puja | ₹2,000 | 2025-09-29 |
| Ashtami Special Puja | ₹2,000 | 2025-09-30 |
| Ashtami Evening Puja | ₹2,000 | 2025-09-30 |
| Navami Special Puja | ₹2,000 | 2025-10-01 |
| Navami Evening Puja | ₹2,000 | 2025-10-01 |
| Sandhi Puja | ₹21,000 | 2025-10-02 |
| Dummy Puja (test) | ₹2,000 | 2025-07-12 |

**Offerings (12):**
| Offering | Amount |
|---|---|
| Durga Protima | ₹1,00,001 |
| Durga Maa Dress | ₹51,000 |
| Laxmi Mata Dress | ₹15,000 |
| Saraswati Mata Dress | ₹15,000 |
| Ganesha Dress | ₹15,000 |
| Kartikeya Dress | ₹15,000 |
| Lotus 108 | ₹25,000 |
| Hom Materials | ₹11,000 |
| Kumari Puja | ₹15,000 |
| Kumari Saree | ₹15,000 |
| Dashami Puja | ₹10,000 |
| Kanakanjali | ₹35,000 |

### 2. Kali Puja (`kali-puja`)
**Items (1):** Special Puja — ₹2,000 (2025-11-12)
**Offerings (3):** Saree ₹35,000 | Mahakali Puja ₹51,000 | Mahakali Bhog ₹85,000

### 3. Saraswati Puja (`saraswati-puja`)
**Items (1):** Special Puja — ₹2,000 (2026-02-14)
**Offerings (1):** Saraswati Maa Dress ₹20,000

### 4. Lakshmi Puja (`lakshmi-puja`)
**Items (1):** Special Puja — ₹2,000 (2025-10-28)
**Offerings (2):** Saree ₹15,000 | Lakshmi Protima ₹25,000

---

## Other Notable Features

### Animations (framer-motion)
- Fade-in-up on section mounts with stagger delays
- Carousel slide transitions
- Mobile menu AnimatePresence
- Success-receipt reveal animation
- Custom CSS keyframes: `float`, `spin-slow`, `bengali-pattern` (SVG plus-sign background)

### Responsive Design
- Tailwind grid breakpoints throughout (1 → 2 → 3/4 columns)
- Mobile hamburger navigation
- Tabs/grids collapse on small screens

### Dark Mode
- `next-themes` ThemeProvider (class strategy, defaultTheme "light", enableSystem)
- Dark CSS variables defined
- Toggle exposed **only** in mobile nav (missing on desktop)
- Most pages hardcode light-only styling (`bg-white`, `text-gray-900`) — dark mode is incomplete

### Cultural Specificity
- Bengali cultural content: Durga/Kali/Saraswati/Lakshmi Puja, Poila Boishakh, Rabindra Jayanti
- Gotra field in donor form
- Sandhi Puja, Kumari Puja, Kanakanjali offerings
- INR-only pricing, UPI/Paytm payment methods
- Indian phone number formatting

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- No `.env` files committed (configured in Vercel deployment)

---

## Known Issues

1. **Server actions have zero auth** — donation data and CSV export are publicly reachable
2. **Supabase RLS commented out** — table is world-readable/writable with anon key
3. **Payment is simulated** (`Math.random`) — not connected to a real payment gateway
4. **Some event images** reference non-existent `/images/*.png` paths
5. **Dark mode toggle missing** on desktop navigation
6. **Newsletter form** has no submit handler
7. **"Recognition Donors"** section on donate pages is a static heading with no data
8. **SQL migration script stale** — `scripts/001_create_donations_table.sql` is missing the 6 new columns (`email`, `country`, `street_address`, `town_city`, `state_province`, `pin_code`)
9. **Supabase client duplicated** in 2 files (not a shared `lib/supabase.ts` module)
10. **Live Supabase table** may be missing the 6 new address/email columns — form submissions will fail if not added via Supabase SQL Editor

---

## Data Flow Summary

### WRITE Path (Donation Submission)
```
Donor fills form (/donate or /donate/[pujaId])
  → Client-side validation
  → submitDonation(formData) Server Action
  → Parse FormData (12 fields + amount + payment method + donation items)
  → Simulate payment (Math.random > 0.2)
  → Generate QR token if puja items present (crypto.randomUUID)
  → INSERT into donations table (Supabase)
  → Generate PDF receipt (pdf-lib) with embedded QR
  → Return {success, message, receiptPdfBase64, qrCodeToken}
  → Client shows success box + Download Receipt button
  → Form resets
```

### READ Path (Admin Dashboard)
```
/admin page loads
  → getDonations() Server Action
  → SELECT * FROM donations ORDER BY timestamp DESC
  → Split into successful / unsuccessful arrays (client-side)
  → Render two scrollable columns
  → CSV export on button click (exportDonationsToCsv)
```

### QR VALIDATION Path
```
/volunteer page
  → Scan QR (camera) OR enter token manually
  → validateQrCode(token) Server Action
  → SELECT * FROM donations WHERE qr_code_token = token
  → Filter scannable items (exclude "General Offering")
  → Filter out already-scanned items (by itemIndex)
  → Find unscanned item scheduled for TODAY
  → If found: append {timestamp, itemIndex} to qr_code_scans → UPDATE DB → return success
  → If all scanned: return "fully used"
  → If none for today: return nearest-date suggestion
  → Display color-coded result to volunteer
```

---

*Report generated from source code analysis of all project files.*
