import { PageHeader } from "@/components/kallol/page-header"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Managing Committee | Kallol, Goregaon West",
  description: "The elected managing committee of Kallol, the Bengali cultural and religious community behind the Kallol Kali Mandir in Goregaon.",
}

export default function CommitteePage() {
  // TODO(site-admin): verify this committee roster against the latest Kallol
  // committee list and update names/positions/contacts if a new committee has
  // taken office. No newer roster exists in this repository, so the existing
  // verified list is intentionally left unchanged (do not invent members).
  const members = [
    { name: "Mr. Pranab Karmakar", position: "Honorable Secretary", contact: "9821086390" },
    { name: "Mr. Ashish Datta", position: "Honorable President", contact: "9920860491" },
    { name: "Mr. Ashok Bhattacharya", position: "Honorable Vice President", contact: "9821029237" },
    { name: "Aloke Kumar Das", position: "Honorable Joint Secretary", contact: "9819722306" },
    { name: "Mr. Apura De Ghatak", position: "Honorable Treasurer", contact: "9820247780" },
    { name: "Mr. Abhijit Mukherjee", position: "Honorable Member", contact: "9867096268" },
    { name: "Mr. Anandalal Kundu", position: "Honorable Member", contact: "9820348019" },
    { name: "Mr. Anjan Bhowmick", position: "Honorable Member", contact: "9920047714" },
    { name: "Mr. Babloo Choudhury", position: "Honorable Member", contact: "9820258883" },
    { name: "Mr. Pradeep Mukherjee", position: "Honorable Member", contact: "9004330667" },
    { name: "Dr. Rathin Das", position: "Honorable Member", contact: "9821011520" },
    { name: "Mr. Sameer Sen", position: "Honorable Member", contact: "9930714400" },
    { name: "Mr. Sandeep Dey", position: "Honorable Member", contact: "9769337695" },
    { name: "Mr. Shankar Choudhury", position: "Honorable Member", contact: "9320959335" },
  ]

  return (
    <main className="min-h-screen pb-16 bg-ivory">
      <PageHeader
        eyebrow="About"
        title="Managing Committee"
        crumbs={[{ label: "About", href: "/about" }]}
      />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <Card className="border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-kallol-800 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Position</th>
                  <th className="px-6 py-4 text-left font-semibold">Contact No.</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 text-gray-900 font-medium">{member.name}</td>
                    <td className="px-6 py-4 text-gray-700">{member.position}</td>
                    <td className="px-6 py-4 text-gray-700">{member.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  )
}
