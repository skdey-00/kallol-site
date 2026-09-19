import type { Metadata } from "next"

export const metadata = {
  title: "Admin | Kallol",
  description: "Kallol site administration.",
  robots: { index: false },
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children
}
