import { cn } from "@/lib/utils"

/**
 * Shared homepage section header — Phase 3 pattern:
 * eyebrow (uppercase maroon) + serif section title + optional intro.
 */
export function SectionHeader({
  eyebrow,
  title,
  intro,
  dark = false,
  className,
}: {
  eyebrow: string
  title: string
  intro?: string
  dark?: boolean
  className?: string
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className={cn("section-eyebrow", dark && "text-kallol-300")}>{eyebrow}</p>
      <h2 className={cn("section-title mt-3", dark && "text-ivory")}>{title}</h2>
      {intro && (
        <p className={cn("mt-4 text-body-lg", dark ? "text-ivory/80" : "text-ink-soft")}>
          {intro}
        </p>
      )}
    </div>
  )
}
