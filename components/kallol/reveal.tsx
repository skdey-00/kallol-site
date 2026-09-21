"use client"

import { useEffect, useRef } from "react"

/**
 * Reveal, the Kallol scroll-motion primitive (extracted from the
 * Phase 5B homepage).
 *
 * A single IntersectionObserver per wrapper: when it enters the
 * viewport it gains `.is-inview`, and CSS handles the rest
 * (`.reveal-up`, `.reveal-img`, `.rule-draw` children, including
 * per-element `--reveal-delay` staggering).
 *
 * - Once only (observer disconnects after firing).
 * - No-ops without JS: hidden initial states are scoped to `html.js`
 *   (inline script in clientLayout sets that class before paint).
 * - No-ops under reduced motion: the global guard in globals.css
 *   collapses all transitions/animations to 0.01ms.
 * - Content is never gated: the default (non-JS) styles show everything.
 *
 * Use `<Reveal as="li">…</Reveal>` for list items (native semantics
 * inside <ul>); the default is a plain <div> wrapper.
 */
export function Reveal({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode
  className?: string
  /** Render element, "div" (default) or "li" for use inside <ul>/<ol>. */
  as?: "div" | "li"
}) {
  const ref = useRef<HTMLDivElement | HTMLLIElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-inview")
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview")
            io.unobserve(entry.target)
          }
        }
      },
      // Trigger slightly before fully on-screen so the motion is seen,
      // but late enough that it never runs offscreen.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const Tag = as
  return (
    <Tag ref={ref as React.Ref<HTMLDivElement & HTMLLIElement>} className={className}>
      {children}
    </Tag>
  )
}
