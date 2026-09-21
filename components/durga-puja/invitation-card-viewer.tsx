"use client"

import { useState, useCallback, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"

/**
 * InvitationCardViewer — the Durgotsab 2026 invitation card, page by page.
 *
 * Four pages from the printed card (cover art, Bengali invitation,
 * English invitation, puja schedule) shown as a flipbook: one large
 * page with a thumbnail rail beneath. Clicking the page (or the zoom
 * control) opens a full-screen lightbox — the card carries dense
 * Bengali/English text, so devotees must be able to read every word.
 */

interface CardPage {
  src: string
  thumb: string
  caption: string
}

const PAGES: CardPage[] = [
  {
    src: "/assets/durga-invitation-cover.webp",
    thumb: "/assets/durga-invitation-cover-thumb.webp",
    caption: "Cover — Durgotsab 2026",
  },
  {
    src: "/assets/durga-invitation-bengali.webp",
    thumb: "/assets/durga-invitation-bengali-thumb.webp",
    caption: "নিমন্ত্রণ — বাংলা | Invitation in Bengali",
  },
  {
    src: "/assets/durga-invitation-english.webp",
    thumb: "/assets/durga-invitation-english-thumb.webp",
    caption: "Invitation in English",
  },
  {
    src: "/assets/durga-invitation-schedule.webp",
    thumb: "/assets/durga-invitation-schedule-thumb.webp",
    caption: "Puja Schedule — all rituals & timings",
  },
]

export function InvitationCardViewer({ headingId }: { headingId?: string }) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)

  const prev = useCallback(
    () => setActive((i) => (i - 1 + PAGES.length) % PAGES.length),
    [],
  )
  const next = useCallback(() => setActive((i) => (i + 1) % PAGES.length), [])

  // Keyboard: ← → to flip, Esc to dismiss zoom
  useEffect(() => {
    if (typeof window === "undefined") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev()
      else if (e.key === "ArrowRight") next()
      else if (e.key === "Escape") setZoom(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [prev, next])

  const page = PAGES[active]

  return (
    <section aria-labelledby={headingId} className="bg-ivory">
      <div className="container py-16 md:py-24 lg:py-28">
        <div className="max-w-2xl">
          <p className="section-eyebrow">Durgotsab 2026</p>
          <h2
            id={headingId}
            className="reveal-up section-title mt-3"
            style={{ ["--reveal-delay" as string]: "60ms" }}
          >
            The invitation card
          </h2>
          <p className="mt-5 text-body-lg leading-relaxed text-ink-soft">
            Kallol&apos;s invitation to Durgotsab 2026 — flip through the card
            below. Tap any page to read it full-screen.
          </p>
          <div className="rule-draw mt-8 h-px bg-kallol-600/60" aria-hidden="true" />
        </div>

        {/* Main page */}
        <figure className="mt-12">
          <button
            type="button"
            onClick={() => setZoom(true)}
            aria-label={`Open full-screen view — ${page.caption}`}
            className="group relative mx-auto block w-full max-w-4xl cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-600 focus-visible:ring-offset-4 focus-visible:ring-offset-ivory"
          >
            <img
              src={page.src}
              alt={`Durgotsab 2026 invitation card — ${page.caption}`}
              width={2000}
              height={1545}
              loading="lazy"
              decoding="async"
              className="w-full rounded-lg object-contain shadow-xl ring-1 ring-stone-line transition-transform duration-500 ease-calm group-hover:scale-[1.01]"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-kallol-950/80 px-4 py-2 text-caption font-semibold uppercase tracking-caps text-ivory backdrop-blur-sm transition-opacity group-hover:opacity-100 md:opacity-0"
            >
              <ZoomIn className="h-4 w-4" />
              View full screen
            </span>
          </button>
          <figcaption className="mt-4 text-center text-sm text-ink-mute">
            {page.caption}
            <span className="ml-3 text-ink-faint">
              {active + 1} / {PAGES.length}
            </span>
          </figcaption>
        </figure>

        {/* Thumbnail rail */}
        <div className="mt-8">
          <ul className="grid grid-cols-4 gap-3 md:gap-4" role="tablist" aria-label="Invitation card pages">
            {PAGES.map((p, i) => (
              <li key={p.src}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={p.caption}
                  onClick={() => setActive(i)}
                  className={`group block w-full overflow-hidden rounded-md ring-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-600 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory ${
                    i === active
                      ? "ring-2 ring-kallol-600"
                      : "ring-stone-line hover:ring-kallol-400"
                  }`}
                >
                  <img
                    src={p.thumb}
                    alt=""
                    width={800}
                    height={618}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[3300/2550] w-full object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
          {/* Flip controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous page"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-line text-ink transition-colors hover:border-kallol-600 hover:text-kallol-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-600"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <p className="text-caption uppercase tracking-caps text-ink-mute">
              Page {active + 1} of {PAGES.length}
            </p>
            <button
              type="button"
              onClick={next}
              aria-label="Next page"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-line text-ink transition-colors hover:border-kallol-600 hover:text-kallol-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-600"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Full-screen reader */}
      {zoom && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Invitation card — full screen"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-kallol-950/95 p-4 md:p-8"
          onClick={() => setZoom(false)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setZoom(false)
            }}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-ivory/30 text-ivory transition-colors hover:bg-ivory/10"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label="Previous page"
            className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/30 text-ivory transition-colors hover:bg-ivory/10 md:left-6"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <img
            src={page.src}
            alt={`Durgotsab 2026 invitation card — ${page.caption}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full rounded-md object-contain"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            aria-label="Next page"
            className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/30 text-ivory transition-colors hover:bg-ivory/10 md:right-6"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-ivory/70">
            {page.caption} · {active + 1} / {PAGES.length}
          </p>
        </div>
      )}
    </section>
  )
}
