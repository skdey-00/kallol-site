import type { MetadataRoute } from "next"

// Static sitemap of all public evergreen routes. Updated in Phase 4 IA pass.
// Year-specific content lives on evergreen pages, so no dynamic sections yet.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://kallol.369808.xyz"
  const now = new Date()

  const routes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, freq: "weekly" },
    { path: "/about", priority: 0.9, freq: "yearly" },
    { path: "/kallol-kali-mandir", priority: 0.9, freq: "yearly" },
    { path: "/upcoming-events", priority: 0.9, freq: "weekly" },
    { path: "/calendar", priority: 0.9, freq: "weekly" },
    { path: "/amavasya-puja", priority: 0.8, freq: "monthly" },
    { path: "/durga-puja", priority: 0.9, freq: "monthly" },
    { path: "/kali-puja", priority: 0.9, freq: "monthly" },
    { path: "/lakshmi-puja", priority: 0.8, freq: "monthly" },
    { path: "/saraswati-puja", priority: 0.8, freq: "monthly" },
    { path: "/special-puja", priority: 0.7, freq: "monthly" },
    { path: "/cultural-events", priority: 0.8, freq: "monthly" },
    { path: "/poila-baishak", priority: 0.7, freq: "yearly" },
    { path: "/rabindranath-tagore-birthday", priority: 0.7, freq: "yearly" },
    { path: "/archives", priority: 0.6, freq: "monthly" },
    { path: "/facilities-services", priority: 0.7, freq: "yearly" },
    { path: "/library-services", priority: 0.7, freq: "yearly" },
    { path: "/medical-services", priority: 0.7, freq: "yearly" },
    { path: "/medical-camp", priority: 0.4, freq: "yearly" },
    { path: "/photos", priority: 0.7, freq: "monthly" },
    { path: "/videos", priority: 0.5, freq: "monthly" },
    { path: "/donate", priority: 0.9, freq: "monthly" },
    { path: "/contact", priority: 0.8, freq: "yearly" },
    { path: "/privacy-policy", priority: 0.2, freq: "yearly" },
  ]

  return routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }))
}
