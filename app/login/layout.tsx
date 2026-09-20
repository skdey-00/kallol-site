import type { Metadata } from "next"

export const metadata = {
  title: "Login | Kallol",
  description: "Sign in to the Kallol Kali Mandir website.",
  robots: { index: false },
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children
}
