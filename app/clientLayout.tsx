"use client"

import { Inter, Source_Serif_4, Noto_Serif_Bengali, Noto_Sans_Bengali } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/hooks/use-auth"
import { CartProvider } from "@/hooks/use-cart"
import { ToastProvider, Toaster } from "@/hooks/use-toast"
import { usePathname } from "next/navigation"
import React from "react"

/* ── Kallol type system ──────────────────────────────────────
   DISPLAY  Source Serif 4  — headlines, editorial voice
   BODY/UI  Inter          — reading, navigation, buttons
   BENGALI  Noto Serif/Sans Bengali — first-class script support
   Fallback chains route Bengali glyphs to Noto automatically. */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali-serif",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${sourceSerif.variable} ${notoSerifBengali.variable} ${notoSansBengali.variable} font-sans bg-ivory text-ink antialiased`}
      >
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="pt-[104px] md:pt-[120px]">{children}</main>
              <Footer />
            </CartProvider>
            <Toaster />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
