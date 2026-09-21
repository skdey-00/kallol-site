import { notFound } from "next/navigation"
import { pujaDonations } from "@/lib/puja-data"
import { PujaDonate } from "@/components/donate/puja-donate"

export default async function PujaDonatePage({ params }: { params: Promise<{ pujaId: string }> }) {
  const { pujaId } = await params
  const puja = pujaDonations.find((p) => p.id === pujaId)
  if (!puja) notFound()
  return (
    <main className="min-h-screen pt-20 px-4 md:px-6 lg:px-8">
      <PujaDonate puja={puja} />
    </main>
  )
}
