"use client"

import { useState } from "react"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import type { ShopProduct } from "@/lib/shop-data"

/**
 * Per-product name-your-price form: amount (default = suggested), quantity,
 * add to cart. Client-only because it touches the cart context.
 */
export function AddToCartForm({ product }: { product: ShopProduct }) {
  const [amount, setAmount] = useState(String(product.suggestedAmount))
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toast } = useToast()

  const parsedAmount = Number.parseFloat(amount)

  const handleAdd = () => {
    if (!Number.isFinite(parsedAmount) || parsedAmount < product.minAmount) {
      toast({
        title: "Invalid amount",
        description: `Please enter an amount of at least ₹${product.minAmount}.`,
        variant: "error",
      })
      return
    }
    addItem({ productId: product.id, name: product.name, amount: Math.round(parsedAmount) }, quantity)
    toast({
      title: "Added to cart",
      description: `${product.name} × ${quantity} added to your cart.`,
      variant: "success",
    })
  }

  return (
    <div className="mt-auto">
      <label htmlFor={`amount-${product.id}`} className="text-sm font-medium text-gray-700 block mb-1">
        Your amount (₹)
      </label>
      <Input
        id={`amount-${product.id}`}
        type="number"
        min={product.minAmount}
        className="border-gray-300 focus:border-kallol-700 focus:ring-kallol-700 mb-3"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            type="button"
            aria-label="Decrease quantity"
            className="px-2 py-2 text-gray-600 hover:text-kallol-700 disabled:opacity-40"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            className="px-2 py-2 text-gray-600 hover:text-kallol-700"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <Button onClick={handleAdd} className="flex-1 bg-kallol-700 hover:bg-kallol-800 text-white">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
