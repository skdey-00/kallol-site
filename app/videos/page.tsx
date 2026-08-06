import { PageBanner } from "@/components/page-banner"
import { Card, CardContent } from "@/components/ui/card"

export default function VideosPage() {
  return (
    <main className="min-h-screen pb-16 bg-gray-50">
      <PageBanner title="Videos" subtitle="Watch Kallol Kali Mandir celebrations and events" />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <Card className="border-gray-200">
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-[#44233b] mb-4">Videos Coming Soon</h2>
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
