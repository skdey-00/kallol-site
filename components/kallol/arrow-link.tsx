import Link from "next/link"

/**
 * ArrowLink — editorial link with quiet arrow (Phase 6).
 *
 * The Phase 5B "invitation, not a button" link: uppercase tracked
 * label with the link-editorial underline sweep and a right arrow
 * that nudges on hover. Used when an action is exploratory, not
 * primary (a primary action uses btn-primary).
 */

export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={`group inline-flex items-center gap-2 ${className ?? ""}`}>
      <Link
        href={href}
        className="link-editorial text-sm font-semibold uppercase tracking-caps text-kallol-700 hover:text-kallol-800"
      >
        {children}
      </Link>
      <span
        aria-hidden="true"
        className="text-kallol-600 transition-transform duration-300 ease-calm group-hover:translate-x-1"
      >
        →
      </span>
    </span>
  )
}
