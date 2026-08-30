/**
 * "Puja Offerings" catalog for the shop checkout — mirrors the WooCommerce
 * products on the old kallolmumbai.com site. Every product is "name your
 * price": the donor/devotee picks their own amount (min ₹1) with a suggested
 * default, exactly like the old "WooCommerce Name Your Price" setup.
 *
 * Category is kept as "General Offering" for all products so orders never
 * generate QR verification tokens (see buildQrCode in lib/donation-service.ts).
 */

export interface ShopProduct {
  id: string
  name: string
  description: string
  category: string
  suggestedAmount: number
  minAmount: number
}

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: "anna-bhog-daily-offering",
    name: "Anna Bhog (Daily offering)",
    description: "Sponsor the daily food offering (Anna Bhog) at the Kali Mandir.",
    category: "General Offering",
    suggestedAmount: 1000,
    minAmount: 1,
  },
  {
    id: "agarbatti-camphor-karpur-oil",
    name: "Agarbatti, Camphor (Karpur) & Oil",
    description: "Contribute incense sticks, camphor and oil used for the daily puja rituals.",
    category: "General Offering",
    suggestedAmount: 5000,
    minAmount: 1,
  },
  {
    id: "amavasya-special-puja",
    name: "Amavasya Special Puja & Evening Puja offerings on other days",
    description: "Special puja performed on Amavasya along with evening puja offerings on other days.",
    category: "General Offering",
    suggestedAmount: 500,
    minAmount: 1,
  },
  {
    id: "anno-bhog-saptami",
    name: "Anno Bhog – Saptami",
    description: "Food offering (Anno Bhog) on Saptami.",
    category: "General Offering",
    suggestedAmount: 2000,
    minAmount: 1,
  },
  {
    id: "anno-bhog-ashtami",
    name: "Anno Bhog – Ashtami",
    description: "Food offering (Anno Bhog) on Ashtami.",
    category: "General Offering",
    suggestedAmount: 2000,
    minAmount: 1,
  },
  {
    id: "anno-bhog-navami",
    name: "Anno Bhog – Navami",
    description: "Food offering (Anno Bhog) on Navami.",
    category: "General Offering",
    suggestedAmount: 2000,
    minAmount: 1,
  },
  {
    id: "payesh-saptami",
    name: "Payesh – Saptami",
    description: "Payesh (sweet rice pudding) bhog offering on Saptami.",
    category: "General Offering",
    suggestedAmount: 15000,
    minAmount: 1,
  },
  {
    id: "payesh-ashtami",
    name: "Payesh – Ashtami",
    description: "Payesh (sweet rice pudding) bhog offering on Ashtami.",
    category: "General Offering",
    suggestedAmount: 15000,
    minAmount: 1,
  },
  {
    id: "payesh-navami",
    name: "Payesh – Navami",
    description: "Payesh (sweet rice pudding) bhog offering on Navami.",
    category: "General Offering",
    suggestedAmount: 15000,
    minAmount: 1,
  },
]

export const INDIAN_STATES: string[] = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
]

export function findShopProduct(id: string): ShopProduct | undefined {
  return SHOP_PRODUCTS.find((p) => p.id === id)
}
