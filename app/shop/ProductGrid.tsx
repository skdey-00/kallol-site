"use client"

import { motion } from "framer-motion"
import { ShoppingBag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { SHOP_PRODUCTS, type ShopProduct } from "@/lib/shop-data"
import { AddToCartForm } from "./AddToCartForm"

function ProductCard({ product, index }: { product: ShopProduct; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
    >
      <Card className="border-gray-200 hover:shadow-md transition-shadow h-full flex flex-col">
        <CardContent className="p-6 flex flex-col flex-grow">
          <div className="flex items-start space-x-3 mb-3">
            <ShoppingBag className="h-5 w-5 text-kallol-700 mt-1 shrink-0" />
            <h2 className="text-lg font-semibold text-gray-900 leading-snug">{product.name}</h2>
          </div>
          <p className="text-sm text-gray-700 mb-4 flex-grow">{product.description}</p>
          <p className="text-sm text-gray-600 mb-4">
            Suggested amount:{" "}
            <span className="font-semibold text-kallol-700">₹{product.suggestedAmount.toLocaleString("en-IN")}</span>
          </p>
          <AddToCartForm product={product} />
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function ProductGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
      {SHOP_PRODUCTS.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}
