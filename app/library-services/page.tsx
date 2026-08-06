import { PageBanner } from "@/components/page-banner"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function LibraryPage() {
  return (
    <main className="min-h-screen pb-16 bg-gray-50">
      <PageBanner title="Library Services" subtitle="A Literary Treasure Trove of Bengali Heritage" />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
            <Image src="/assets/library-de30773d.png" alt="Kallol Library" fill className="w-full h-full object-cover" priority />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Kallol Library: A Literary Treasure Trove
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify mb-4">
              The Kallol Library, nestled within the vibrant cultural campus of Kallol in Goregaon, Mumbai, is a quiet
              yet powerful embodiment of the organization's dedication to intellectual and cultural enrichment. Serving
              as a literary cornerstone for the Bengali community, the library offers a carefully curated collection of
              Bengali literary works, making it a true haven for scholars, readers, and cultural enthusiasts alike.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify mb-4">
              At its core, the library seeks to preserve the literary heritage of Bengal, a region renowned for its
              profound contributions to Indian and world literature. The shelves are adorned with the timeless works of
              literary luminaries such as Rabindranath Tagore, Sarat Chandra Chattopadhyay, Bankim Chandra
              Chattopadhyay, Bibhutibhushan Bandyopadhyay, and Sukumar Ray, alongside contemporary Bengali authors whose
              voices continue to shape modern discourse.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify mb-4">
              From classic novels and poetry to essays, plays, and children's literature, the collection reflects the
              diversity, depth, and soul of Bengali thought. Spiritual texts, rare manuscripts, and periodicals further
              enrich the holdings, inviting readers into a deeper understanding of Bengal's cultural and philosophical
              landscape.
            </p>
          </div>
        </div>

        <Card className="border-gray-200 mt-8">
          <CardContent className="p-8">
            <p className="text-gray-700 leading-relaxed text-justify mb-4">
              The library is more than just a repository of books, it is a nurturing space that encourages reflection,
              dialogue, and the transmission of knowledge across generations. Through literary discussions, storytelling
              sessions, and cultural programs, the library supports Kallol's broader mission of celebrating and
              sustaining Bengali identity in the diaspora.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              Open to members of all ages, the Kallol Library welcomes everyone, from the avid bibliophile to the
              curious learner, into its world of words, wisdom, and wonder. Here, in the heart of Mumbai, the spirit of
              Bengal continues to thrive, quietly turning pages, one story at a time.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
