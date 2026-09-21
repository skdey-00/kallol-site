import Link from "next/link"
import { PageHeader } from "@/components/kallol/page-header"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Bengali Library & Reading Room | Kallol, Goregaon",
  description: "A lending library of Bengali literature, Tagore, Sarat Chandra, Bankim Chandra and more, open to Kallol members in Goregaon West, Mumbai.",
}

export default function LibraryPage() {
  return (
    <main className="min-h-screen pb-16 bg-ivory">
      <PageHeader
        eyebrow="Community"
        title="Library Services"
        intro="A Literary Treasure Trove of Bengali Heritage"
        crumbs={[{ label: "Community", href: "/facilities-services" }]}
      />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
            <img src="/assets/library-de30773d.webp" alt="Kallol Library" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-kallol-800 mb-6">
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

        <p className="text-gray-700 mt-8 text-sm">
          Also part of Kallol&apos;s community services:{" "}
          <Link href="/medical-services" className="text-kallol-700 font-medium hover:underline">
            Medical Services
          </Link>
          {" · "}
          <Link href="/facilities-services" className="text-kallol-700 font-medium hover:underline">
            Facilities &amp; Services
          </Link>
        </p>
      </div>
    </main>
  )
}
