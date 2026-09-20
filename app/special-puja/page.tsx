import { PageHeader } from "@/components/kallol/page-header"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Special Puja Services — Satyanarayan, Shanidev, Bipattarini | Kallol",
  description: "Book special pujas at Kallol Kali Mandir: Satyanarayan Puja, Shree Shree Shanidev Puja, Bipattarini and more in Goregaon West, Mumbai.",
}

export default function SpecialPujaPage() {
  return (
    <main className="min-h-screen pb-16 bg-ivory">
      <PageHeader
        eyebrow="Puja"
        title="Special Puja Services"
        intro="Various Special Pujas at Kallol Kali Mandir"
        crumbs={[{ label: "Puja", href: "/upcoming-events" }]}
      />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-gray-200 overflow-hidden">
            <div className="relative h-52">
              <img src="/assets/SpecialPuja-3da3ae1b.webp" alt="Special Puja" className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-[#44233b] mb-3">Shree Shree Satyanarayan Puja</h3>
              <p className="text-gray-700 leading-relaxed">
                Kallol organizes Shri Shri Satyanarayan Puja on special occasions like Poila Baisakh, etc. Please refer
                to the annual Puja / Event calendar to know the specific Puja date.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 overflow-hidden">
            <div className="relative h-52">
              <img src="/assets/kali-mandir-banner1-dc6a1673.webp" alt="Shanidev Puja" className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-[#44233b] mb-3">Shree Shree Shanidev Puja</h3>
              <p className="text-gray-700 leading-relaxed">
                Kallol organizes Shree Shanidev Puja (Boro Thakur Puja) at the campus of Kallol. The Puja starts at 7:30
                PM in the evening. Our annual calendar has the Shree Shanidev Puja schedule. All interested devotees can
                participate in the Puja.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-gray-200 mt-8">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-[#44233b] mb-6">Other Pujas Organized at Kallol Kali Temple</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Monthly Amavasya Puja",
                "Bipattarini Puja",
                "Guru Purnima",
                "Rakhi Purnima",
                "Buddha Purnima (Mandir Foundation Day)",
                "Dol Purnima (Holi Utsav)",
                "Maha Shivaratri",
                "Bigroha Pratistha Divas Utsav",
                "Poila Boishakh Celebrations",
              ].map((puja, i) => (
                <div key={i} className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                  <span className="text-kallol-700 text-xl mt-0.5">&#10022;</span>
                  <span className="text-gray-700 text-sm font-medium">{puja}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
