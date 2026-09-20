import Link from "next/link"

/**
 * Figure — the Kallol photographic primitive (Phase 6).
 *
 * Standardizes real Kallol photography treatment from Phase 5B:
 * an overflow-hidden frame, fixed aspect ratio, object-cover, the
 * img-breathe hover, and a quiet caption. Never decorative frames,
 * gold borders, or watermarks.
 *
 * - `href` wraps the frame in a link (gallery teasers, event entries).
 * - `aspect` uses Kallol's crop vocabulary: 4/5 portrait editorial,
 *   3/2 landscape, 4/3 standard, 21/9 wide (with md: variants via
 *   `aspectMd`).
 * - Eager + priority is reserved for above-the-fold heroes; all
 *   below-fold figures load lazy by default.
 */

export interface FigureProps {
  src: string
  alt: string
  caption?: string
  href?: string
  aspect?: "4/5" | "3/2" | "4/3" | "21/9" | "1/1"
  /** Breakpoint-specific crop for the same frame, e.g. "4/3" at md */
  aspectMd?: "4/5" | "3/2" | "4/3" | "21/9" | "1/1"
  width: number
  height: number
  /** Eager-load for above-the-fold frames (LCP); default lazy */
  priority?: boolean
  className?: string
  imgClassName?: string
}

const ASPECT_CLASS: Record<string, string> = {
  "4/5": "aspect-[4/5]",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
  "21/9": "aspect-[21/9]",
  "1/1": "aspect-square",
}

export function Figure({
  src,
  alt,
  caption,
  href,
  aspect = "3/2",
  aspectMd,
  width,
  height,
  priority = false,
  className,
  imgClassName,
}: FigureProps) {
  const body = (
    <>
      <div className="overflow-hidden">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={`reveal-img img-breathe ${ASPECT_CLASS[aspect]} ${
            aspectMd ? `md:${ASPECT_CLASS[aspectMd]}` : ""
          } w-full object-cover ${imgClassName ?? ""}`}
        />
      </div>
      {caption && <figcaption className="img-caption mt-2">{caption}</figcaption>}
    </>
  )

  const focusRing =
    "block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kallol-600 focus-visible:ring-offset-4 focus-visible:ring-offset-ivory"

  return (
    <figure className={`group ${className ?? ""}`}>
      {href ? (
        href.startsWith("/") ? (
          <Link href={href} className={focusRing}>
            {body}
          </Link>
        ) : (
          <a href={href} className={focusRing}>
            {body}
          </a>
        )
      ) : (
        body
      )}
    </figure>
  )
}
