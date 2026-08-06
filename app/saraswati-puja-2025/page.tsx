import { PageBanner } from "@/components/page-banner"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SaraswatiPujaPage() {
  return (
    <main className="min-h-screen pb-16 bg-gray-50">
      <PageBanner title="Saraswati Puja 2025" subtitle="Honoring the Goddess of Wisdom" />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
            <img src="/assets/Saras-b12c15b3.png" alt="Saraswati Puja 2025" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#44233b]">
              Celebrating Wisdom, Art, and New Beginnings
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              Each spring, as nature blossoms and a gentle freshness fills the air, the Bengali community at Kallol
              comes together to honor Maa Saraswati, the revered goddess of knowledge, music, art, and learning.
              Saraswati Puja, traditionally celebrated on Basanta Panchami, marks not only the arrival of spring but
              also the awakening of intellect and creativity in every heart.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              At Kallol, Saraswati Puja is a cherished occasion that beautifully blends devotion with cultural
              expression. The idol of the goddess is adorned with white flowers, symbolizing purity and wisdom, and the
              air is filled with the gentle melodies of classical music and the recitation of shlokas. Children and
              students specially participate, placing their books, instruments, and tools of learning at the feet of the
              goddess, seeking her blessings for success in their academic and creative pursuits.
            </p>
          </div>
        </div>

        <Card className="border-gray-200 mb-8">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-[#44233b] mb-6">Puja Schedule</h3>
            <div className="bg-kallol-50 rounded-lg p-6 border border-kallol-100">
              <p className="text-gray-700"><strong>January 23, 2026 (Friday)</strong> - Saraswati Puja</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-gradient-to-r from-kallol-50 to-gray-50">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-[#44233b] mb-6">Be a Part of the Celebration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Book special Saraswati Puja offerings online",
                "Offer pushpanjali and receive bhog prasad",
                "Join us at the Kallol campus or watch the live stream",
                "Children can place books and instruments for blessings",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-kallol-700 text-xl mt-0.5">&#10022;</span>
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white rounded-full">
                <Link href="/donate">Book Puja Offerings</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-gray-600 mt-8 italic">
          Saraswati Puja at Kallol - Where Knowledge Meets Devotion. Kallol Campus, Goregaon.
        </p>
      </div>
    </main>
  )
}
