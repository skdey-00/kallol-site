import { PageBanner } from "@/components/page-banner"
import { Card, CardContent } from "@/components/ui/card"

export default function RabindraJayantiPage() {
  return (
    <main className="min-h-screen pb-16 bg-gray-50">
      <PageBanner title="Rabindranath Tagore Birthday" subtitle="Honoring the Bard of Bengal" />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-8">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
            <img src="/assets/Final_1_ranbindra_opt1-1-1-55e1cfa0.png" alt="Rabindra Jayanti" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#44233b]">Rabindra Jayanti - Honoring the Bard of Bengal</h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              Each year, Rabindra Jayanti, the birth anniversary of Rabindranath Tagore, is observed with deep reverence
              and artistic expression. Kallol pays homage to Gurudev through a specially curated cultural evening,
              showcasing his timeless contributions to literature, music, and philosophy.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              Members of all ages participate by reciting his poems, singing Rabindra Sangeet, and performing dramatic
              pieces, keeping the spirit of Tagore alive through every performance. The event is a celebration not just
              of one man's genius, but of the cultural and intellectual heritage he represents.
            </p>
          </div>
        </div>

        <Card className="border-gray-200">
          <CardContent className="p-8">
            <p className="text-gray-700 leading-relaxed text-justify mb-4">
              At Kallol, Rabindra Jayanti is more than a cultural program, it is a reaffirmation of identity. The
              community comes together to reflect on Tagore's enduring message of universalism, freedom, and the pursuit
              of beauty and truth. Through music, dance, drama, and recitation, his words echo through the hall,
              bridging generations and touching hearts.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify mb-4">
              The evening typically features solo and group performances of Rabindra Sangeet, dramatic renditions of his
              plays and dance dramas, and recitations from his vast body of poetry and prose. Each performance is
              infused with the warmth and devotion of the community.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              These celebrations are not mere rituals, they are living expressions of Bengali identity, woven into the
              cultural fabric of Kallol and cherished by the community.
            </p>
          </CardContent>
        </Card>

        <div className="bg-kallol-50 rounded-lg p-6 border border-kallol-100 mt-8 text-center">
          <p className="text-gray-700 italic">
            "We will update the page with next Rabindra Jayanti program schedule by early April 2026. Please do join us
            in the next Rabindra Jayanti celebration at Kallol campus."
          </p>
        </div>
      </div>
    </main>
  )
}
