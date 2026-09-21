import { PageHeader } from "@/components/kallol/page-header"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Videos, Mandir, Pujas & Community Events | Kallol",
  description: "Watch videos from Kallol Kali Mandir: pujas, festivals and community life in Goregaon West, Mumbai.",
}

export default function VideosPage() {
  return (
    <main className="min-h-screen pb-16 bg-ivory">
      <PageHeader
        eyebrow="Gallery"
        title="Videos"
        intro="Watch Kallol Kali Mandir celebrations and events"
        crumbs={[{ label: "Photos", href: "/photos" }]}
      />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <Card className="border-gray-200">
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-kallol-800 mb-4">Videos Coming Soon</h2>
              <p className="text-gray-700">
                We are working on bringing you video content of our pujas, cultural events, and community programs.
                Please check back soon for updates!
              </p>
              <p className="text-gray-500 text-sm mt-4">Thank you for your patience.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
