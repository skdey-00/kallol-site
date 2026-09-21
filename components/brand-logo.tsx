import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * BrandLogo, the canonical Kallol brand mark.
 *
 * The blue wave logo from kallolmumbai.com (transparent PNG derived
 * from KALLOL-LOGO-BLUE, 1022×268) is the sole official brand asset.
 * It is NEVER redrawn, cropped, recolored, or restretched. This
 * component guarantees correct proportions by locking the aspect
 * ratio at every size.
 *
 * Usage sizes (height-driven):
 *   sm    32px , compact headers, loading states
 *   md    44px , navbar default
 *   lg    56px , navbar desktop, footer
 *   xl    80px , section mastheads
 *   hero  120px+, homepage hero
 *
 * The logo is built for light surfaces (blue petals, white/blue
 * letters); on the dark footer, wrap it in a light chip.
 *
 * Clear space: reserve at least 0.25× the logo height on all sides
 * (see brand doc §3). Navbar/footer layouts here already enforce it.
 */

const LOGO_SRC = "/images/kallol-logo-blue-2.webp"
const LOGO_WIDTH = 1022
const LOGO_HEIGHT = 268

export interface BrandLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Rendered height in px. Width follows the locked ratio. */
  height?: number
  /** Size presets */
  size?: "sm" | "md" | "lg" | "xl" | "hero"
  /** Optional className for layout (margin, alignment), never transform */
  className?: string
}

const sizeMap: Record<NonNullable<BrandLogoProps["size"]>, number> = {
  sm: 32,
  md: 44,
  lg: 56,
  xl: 80,
  hero: 120,
}

export function BrandLogo({
  height,
  size = "md",
  className,
  ...props
}: BrandLogoProps) {
  const h = height ?? sizeMap[size]
  const w = Math.round((h * LOGO_WIDTH) / LOGO_HEIGHT)

  return (
    <img
      src={LOGO_SRC}
      alt="Kallol, Kallol Kali Mandir, Goregaon, Mumbai"
      width={w}
      height={h}
      style={{ height: `${h}px`, width: `${w}px` }}
      className={cn("brand-logo max-w-none", className)}
      draggable={false}
      {...props}
    />
  )
}
