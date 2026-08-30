import type { Metadata } from "next"
import { SHOP_PRODUCTS } from "@/lib/shop-data"
import { ProductGrid } from "./ProductGrid"

export const metadata: Metadata = {
  title: "Puja Offerings | Kallol",
  description: "Sponsor puja offerings — anna bhog, anno bhog, payesh and puja materials — at Kallol, Mumbai.",
}

export default function ShopPage() {
  return (
    <main className="min-h-screen pt-20 pb-16 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Puja <span className="text-kallol-700">Offerings</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Sponsor bhog offerings and puja materials. Choose the amount you wish to contribute, add to cart and pay
            online or at the counter.
          </p>
        </div>

        <ProductGrid />
      </div>
    </main>
  )
}
