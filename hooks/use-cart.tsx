"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import React from "react"

/**
 * Client-side shopping cart for the Puja Offerings checkout, persisted to
 * localStorage. Hydration-safe: items start empty and are loaded from storage
 * in a mount effect — render nothing cart-dependent until `hydrated` is true
 * to avoid an SSR mismatch.
 */

export interface CartItem {
  productId: string
  name: string
  amount: number // per-unit amount chosen by the buyer (name-your-price)
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  hydrated: boolean
  totalItems: number
  subtotal: number
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateAmount: (productId: string, amount: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = "kallol-cart"

const MIN_QTY = 1
const MAX_QTY = 99
const MIN_AMOUNT = 1

const clampQuantity = (qty: number) => Math.max(MIN_QTY, Math.min(MAX_QTY, Math.round(qty || MIN_QTY)))
const clampAmount = (amount: number) => Math.max(MIN_AMOUNT, Math.round(amount || MIN_AMOUNT))

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Load persisted cart once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[]
        if (Array.isArray(parsed)) {
          setItems(
            parsed
              .filter((i) => i && typeof i.productId === "string")
              .map((i) => ({
                productId: i.productId,
                name: i.name || i.productId,
                amount: clampAmount(Number(i.amount)),
                quantity: clampQuantity(Number(i.quantity)),
              })),
          )
        }
      }
    } catch {
      // Corrupted storage — start with an empty cart.
    }
    setHydrated(true)
  }, [])

  // Persist after every change, but only once loaded (never overwrite during SSR).
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Storage unavailable (private mode etc.) — cart still works in memory.
    }
  }, [items, hydrated])

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId)
      if (existing) {
        // One line per product: re-adding updates the amount and merges quantity.
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, amount: clampAmount(item.amount), quantity: clampQuantity(i.quantity + quantity) }
            : i,
        )
      }
      return [
        ...prev,
        { productId: item.productId, name: item.name, amount: clampAmount(item.amount), quantity: clampQuantity(quantity) },
      ]
    })
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity: clampQuantity(quantity) } : i)))
  }, [])

  const updateAmount = useCallback((productId: string, amount: number) => {
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, amount: clampAmount(amount) } : i)))
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.amount * i.quantity, 0), [items])

  return (
    <CartContext.Provider
      value={{ items, hydrated, totalItems, subtotal, addItem, updateQuantity, updateAmount, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return ctx
}
