import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./clientLayout"

export const metadata: Metadata = {
  title: "Kallol - Bengali Cultural Organization | Kali Mandir Bangur Nagar",
  description:
    "Join Kallol's vibrant Bengali community at Kali Mandir, Bangur Nagar. Celebrating Bengali culture through festivals, events, and traditions.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'