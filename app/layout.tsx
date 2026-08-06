import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./clientLayout"

export const metadata: Metadata = {
  title: "Kallol Mumbai - Kallol Kali Mandir, Goregaon | Devotion, Puja & Community Events",
  description:
    "Kallol Kali Mandir, Goregaon, Mumbai - devotion, puja, festivals, community and service. A cultural cornerstone for the Bengali diaspora in Mumbai.",
    generator: 'v0.dev',
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'