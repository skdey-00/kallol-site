import type { Config } from "tailwindcss"

/**
 * KALLOL DESIGN TOKENS — Phase 3 brand system
 * Single source of truth for color, type, spacing, and radius.
 * The palette is derived from the canonical logo's maroon (#832F30).
 * Do not introduce arbitrary hex values in components — extend tokens here.
 */
const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "var(--font-bengali-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "var(--font-bengali-sans)", "system-ui", "sans-serif"],
        bengali: ["var(--font-bengali-serif)", "var(--font-display)", "serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        /* ── BRAND ─────────────────────────────────────────────
           kallol.600 IS the logo color (blue wave from kallolmumbai.com,
           #3D3F92). Do not shift it.
           Ramp built around it (same S/L structure as the old maroon
           ramp, hue rotated to 239deg). */
        kallol: {
          DEFAULT: "#3D3F92",
          50: "#F5F5FB",
          100: "#E7E7F4",
          200: "#CECEE8",
          300: "#A9AAD7",
          400: "#7A7BBE",
          500: "#5051A3",
          600: "#3D3F92", // canonical — matches public/images/kallol-logo-blue.png
          700: "#26276F",
          800: "#1F2059",
          900: "#16173E",
          950: "#0E0E2A",
        },
        /* Deep charcoal / near-black with the brand blue's coolness */
        ink: {
          DEFAULT: "#1F1F23",
          soft: "#35353B",
          mute: "#66666E",
          faint: "#9B9BA3",
        },
        /* Warm ivory / off-white */
        ivory: {
          DEFAULT: "#FAF6F0",
          raised: "#FFFDF9",
          sun: "#F3EAD9",
        },
        /* Warm stone neutrals */
        stone: {
          warm: "#EDE6DC",
          line: "#DDD3C6",
          paper: "#F6F1E9",
        },
        /* Restrained accent — burnished copper, used sparingly */
        copper: {
          DEFAULT: "#B0793F",
          deep: "#8C5D2E",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      /* Editorial type scale — serif display, sans body/UI */
      fontSize: {
        "display-xl": ["clamp(2rem, 5.5vw, 4rem)", { lineHeight: "1.08", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display": ["clamp(2.25rem, 4.5vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.015em", fontWeight: "600" }],
        /* Phase 5B editorial voices:
           date-xl — enormous date numerals (cover story), decorative-scale
           statement — section-opening editorial statements, above h2 weight */
        "date-xl": ["clamp(3.75rem, 10vw, 8rem)", { lineHeight: "0.95", letterSpacing: "-0.03em", fontWeight: "600" }],
        "statement": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.18", letterSpacing: "-0.01em", fontWeight: "600" }],
        "h1": ["clamp(2rem, 3.5vw, 2.75rem)", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }],
        "h2": ["clamp(1.5rem, 2.5vw, 2rem)", { lineHeight: "1.2", letterSpacing: "0", fontWeight: "600" }],
        "h3": ["1.25rem", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        caption: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.04em" }],
      },
      maxWidth: {
        content: "72rem",
        prose: "44rem",
        "prose-wide": "56rem",
      },
      /* Restrained elevation — borders before shadows */
      boxShadow: {
        card: "0 1px 2px rgba(35, 31, 32, 0.05)",
        raised: "0 2px 8px rgba(35, 31, 32, 0.07)",
        overlay: "0 8px 24px rgba(35, 31, 32, 0.12)",
        dropdown: "0 12px 32px -8px rgba(62, 22, 23, 0.25)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      letterSpacing: {
        caps: "0.08em",
      },
      transitionTimingFunction: {
        calm: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
