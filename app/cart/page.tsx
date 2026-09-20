"use client"

import Link from "next/link"
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useCart } from "@/hooks/use-cart"
import { findShopProduct } from "@/lib/shop-data"

export default function CartPage() {
  const { items, hydrated, subtotal, updateQuantity, updateAmount, removeItem } = useCart()

  if (!hydrated) {
    return (
      <main className="min-h-screen pt-20 pb-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-3xl">
          <div className="h-40" />
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-20 pb-16 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-lg">
          <Card className="border-gray-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
              <p className="text-gray-700 mb-6">Browse our puja offerings and sponsor an offering of your choice.</p>
              <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white">
                <Link href="/donate">
                  Browse Puja Offerings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-20 pb-16 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

        <div className="space-y-4 mb-8">
          {items.map((item) => {
            const product = findShopProduct(item.productId)
            const minAmount = product?.minAmount ?? 1
            return (
              <Card key={item.productId} className="border-gray-200">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-grow">
                      <h2 className="font-semibold text-gray-900 mb-1">{item.name}</h2>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span>₹</span>
                        <Input
                          type="number"
                          min={minAmount}
                          aria-label={`Amount for ${item.name}`}
                          className="w-28 h-8 border-gray-300 focus:border-kallol-700 focus:ring-kallol-700"
                          value={item.amount}
                          onChange={(e) => updateAmount(item.productId, Number.parseInt(e.target.value, 10))}
                        />
                        <span className="text-gray-500">× {item.quantity}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          className="px-2 py-2 text-gray-600 hover:text-kallol-700 disabled:opacity-40"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          className="px-2 py-2 text-gray-600 hover:text-kallol-700"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="font-semibold text-gray-900 w-24 text-right">
                        ₹{(item.amount * item.quantity).toLocaleString("en-IN")}
                      </p>

                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="border-gray-200 shadow-lg mb-8">
          <CardContent className="p-5 flex items-center justify-between">
            <span className="text-lg font-medium text-gray-900">Subtotal</span>
            <span className="text-xl font-bold text-kallol-700">₹{subtotal.toLocaleString("en-IN")}</span>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <Button asChild variant="outline" className="border-kallol-700 text-kallol-700 hover:bg-kallol-50">
            <Link href="/donate">Continue Shopping</Link>
          </Button>
          <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white">
            <Link href="/checkout">
              Proceed to Checkout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
