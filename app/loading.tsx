import { BrandLogo } from "@/components/brand-logo"

/**
 * Root loading state, canonical logo on ivory, quiet baseline pulse
 * (disabled automatically under prefers-reduced-motion via globals.css).
 */
export default function RootLoading() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center gap-6">
      <BrandLogo size="xl" />
      <span
        aria-hidden="true"
        className="block h-0.5 w-24 bg-kallol-600/70 rounded-full"
        style={{
          animation: "kallol-breathe 1.6s var(--kallol-ease, ease-in-out) infinite",
        }}
      />
      <style>{`
        @keyframes kallol-breathe {
          0%, 100% { opacity: 0.35; transform: scaleX(0.6); }
          50% { opacity: 1; transform: scaleX(1); }
        }
      `}</style>
      <span className="sr-only">Loading Kallol…</span>
    </div>
  )
}
