import { PageBanner } from "@/components/page-banner"
import { Card, CardContent } from "@/components/ui/card"

export default function PoilaBaishakPage() {
  return (
    <main className="min-h-screen pb-16 bg-gray-50">
      <PageBanner title="Poila Baishak" subtitle="Bengali New Year Celebration" />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
            <img src="/assets/PoilaBoishak-ee6e477f.webp" alt="Poila Baishak" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#44233b]">Poila Boishakh - Bengali New Year</h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              The arrival of Poila Boishakh, the Bengali New Year, is marked with much fanfare and festivity at Kallol.
              The day begins with prayers for prosperity and is followed by a colorful cultural program featuring
              traditional music, dance, and poetry, along with authentic Bengali cuisine served with warmth and
              hospitality.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              Dressed in festive attire, families gather to welcome the New Year in a spirit of unity and renewal. The
              celebration also includes the Satyanarayan Puja and marks the Club Anniversary of Kallol.
            </p>
          </div>
        </div>

        <Card className="border-gray-200 mt-8">
          <CardContent className="p-8">
            <div className="bg-kallol-50 rounded-lg p-6 border border-kallol-100 text-center">
              <p className="text-gray-700"><strong>April 15, 2026 (Wednesday)</strong> at 05:00 PM</p>
              <p className="text-gray-600 text-sm mt-2">Satyanarayan Puja, Bengali New Year &amp; Club Anniversary</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
