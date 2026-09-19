# Kallol Site — Page File Map & Localhost Guide

One repo: **github.com/skdey-00/kallol-site** (folder: `Kallol site latest`).
Every page = one folder inside `app/`, and the page's text lives in that folder's `page.tsx`.

## All page files

### Main pages
| Page | File |
|---|---|
| Homepage | `app/page.tsx` |
| About | `app/about/page.tsx` |
| Contact | `app/contact/page.tsx` |
| Calendar | `app/calendar/page.tsx` |
| Gallery | `app/gallery/page.tsx` |
| Photos | `app/photos/page.tsx` |
| Videos | `app/videos/page.tsx` |
| Archives | `app/archives/page.tsx` |
| Upcoming events | `app/upcoming-events/page.tsx` |
| Volunteer | `app/volunteer/page.tsx` |
| Donate (main) | `app/donate/page.tsx` |
| Donate per-puja | `app/donate/[pujaId]/page.tsx` |
| Donate thank-you | `app/donate/thank-you/page.tsx` |
| Shop | `app/shop/page.tsx` |
| Cart | `app/cart/page.tsx` |
| Checkout | `app/checkout/page.tsx` |
| Checkout thank-you | `app/checkout/thank-you/page.tsx` |
| Admin | `app/admin/page.tsx` |
| Login | `app/login/page.tsx` |
| Privacy policy | `app/privacy-policy/page.tsx` |

### Puja & event pages
| Page | File |
|---|---|
| Durga Puja | `app/durga-puja/page.tsx` |
| Kali Puja | `app/kali-puja/page.tsx` |
| Lakshmi Puja | `app/lakshmi-puja/page.tsx` |
| Saraswati Puja | `app/saraswati-puja/page.tsx` |
| Amavasya Puja | `app/amavasya-puja/page.tsx` |
| Special Puja | `app/special-puja/page.tsx` |
| Poila Boishakh | `app/poila-baishak/page.tsx` |
| Rabindra Jayanti | `app/rabindranath-tagore-birthday/page.tsx` |
| Kallol Kali Mandir | `app/kallol-kali-mandir/page.tsx` |
| Managing Committee | `app/managing-committee/page.tsx` |

### Medical / facilities
| Page | File |
|---|---|
| Medical Camp | `app/medical-camp/page.tsx` |
| Medical Services | `app/medical-services/page.tsx` |
| Library Services | `app/library-services/page.tsx` |
| Facilities & Services | `app/facilities-services/page.tsx` |

### Shared (edit once → changes on EVERY page)
| What | File |
|---|---|
| Top navbar | `components/navbar.tsx` |
| Footer | `components/footer.tsx` |
| `<html lang="...">` + fonts | `app/clientLayout.tsx` |

### Data files (content not hardcoded in pages)
| Content | File |
|---|---|
| Calendar events | `data/local-events.json` (also editable at `/admin`) |
| Puja donation items & dates | `lib/puja-data.ts` |

Each `page.tsx` also has a `metadata` block near the top (title + description
shown in Google results and the browser tab) — update it when you rename a page.

## Homepage sections (each its own file)
Hero, slideshow, story, puja index, gallery, community, participate, visit etc.
live in `components/home/` (one file per section).

## How to see your edits on localhost

The dev server watches every file. The normal loop is just:

1. Edit the `page.tsx` (in VS Code or any editor) and **Save** (Ctrl+S).
2. Look at the browser tab with `http://localhost:3001` — it refreshes itself
   within ~1–2 seconds. If it doesn't, press **F5**.
3. That's it. No build, no restart needed — for text/style edits.

### Starting the server yourself (after a reboot, or if it's not running)
Open Command Prompt on Windows and run:

    cd "C:\Users\sanme\Desktop\Kallol site latest"
    set PORT=3001 && pnpm dev

Then open `http://localhost:3001`. First page load after starting takes a few
extra seconds (Next.js compiles each route on first visit — normal in dev mode).

### Stopping the server
Click the Command Prompt window and press **Ctrl+C**.

### Troubleshooting
- **Page feels stuck / spins forever** → hard refresh: **Ctrl+Shift+R**
  (the browser can cache a hung request).
- **Edited but nothing changed** → make sure the file actually saved, and that
  you edited the page you're looking at (check the URL path matches the folder).
- **Every page suddenly shows an error after editing `tailwind.config.ts`** →
  known glitch: stop the server (Ctrl+C), run `mkdir %TEMP%\node-jiti`, start
  it again.
- **`EADDRINUSE` / port already in use** → an old server is still running
  somewhere. Close old Command Prompt windows, or ask the agent to sweep ports.
- **Do NOT delete** `suppressHydrationWarning` in `app/clientLayout.tsx` —
  the site's reveal animations depend on it.
