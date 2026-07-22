// Define the DonationItem interface
export interface DonationItem {
  purpose: string
  category: string
  amount: number // Changed to number for easier calculations
  date?: string // Added date property
}

// Define the OfferingItem interface
export interface OfferingItem {
  name: string
  amount: number
  description?: string
}

// Define the PujaDonationCategory interface
export interface PujaDonationCategory {
  id: string
  name: string
  description: string
  items: DonationItem[]
  offerings: OfferingItem[] // Add offerings specific to each puja
}

export const pujaDonations: PujaDonationCategory[] = [
  {
    id: "durga-puja",
    name: "Durga Puja",
    description: "Support the grand annual Durga Puja celebration, the largest festival for Bengalis.",
    items: [
      { purpose: "Saptami: Spl. Puja", category: "Durga Puja", amount: 2000, date: "2025-09-29" },
      { purpose: "Saptami: Evening Puja", category: "Durga Puja", amount: 2000, date: "2025-09-29" },
      { purpose: "Ashtami: Spl. Puja", category: "Durga Puja", amount: 2000, date: "2025-09-30" },
      { purpose: "Ashtami: Evening Puja", category: "Durga Puja", amount: 2000, date: "2025-09-30" },
      { purpose: "Navami: Spl. Puja", category: "Durga Puja", amount: 2000, date: "2025-10-01" },
      { purpose: "Navami: Evening Puja", category: "Durga Puja", amount: 2000, date: "2025-10-01" },
      { purpose: "Sandhi Puja", category: "Durga Puja", amount: 21000, date: "2025-10-02" },
      { purpose: "Dummy Puja", category: "Durga Puja", amount: 2000, date: new Date().toISOString().split("T")[0] },
    ],
    offerings: [
      { name: "Durga Protima", amount: 100001, description: "Complete Durga idol for the puja" },
      { name: "Dress for Durga Maa", amount: 51000, description: "Beautiful attire for Goddess Durga" },
      { name: "Dress for Maa Laxmi", amount: 15000, description: "Attire for Goddess Lakshmi" },
      { name: "Dress for Maa Saraswati", amount: 15000, description: "Attire for Goddess Saraswati" },
      { name: "Dress for Shree Ganesha", amount: 15000, description: "Attire for Lord Ganesha" },
      { name: "Dress for Shree Kartikeya", amount: 15000, description: "Attire for Lord Kartikeya" },
      { name: "Lotus Flower - 108 No. (2 Persons per Family)", amount: 25000, description: "Sacred lotus flowers for puja" },
      { name: "Hom (Materials Only)", amount: 11000, description: "Sacred fire ceremony materials" },
      { name: "Kumari Puja (Bhog, Flower Ornaments & Puja Materials)", amount: 15000, description: "Special puja for young girls" },
      { name: "Kumari Puja Saree", amount: 15000, description: "Traditional saree for Kumari Puja" },
      { name: "Dashami Puja", amount: 10000, description: "Special puja on the final day" },
      { name: "Kanakanjali", amount: 35000, description: "Gold offering to the goddess" },
    ],
  },
  {
    id: "kali-puja",
    name: "Kali Puja",
    description: "Contribute to the sacred Kali Puja, held at our Kali Mandir.",
    items: [
      { purpose: "Special Puja", category: "Kali Puja", amount: 2000, date: "2025-11-12" },
    ],
    offerings: [
      { name: "Saree for Mahakali Puja ", amount: 35000, description: "Traditional attire for Goddess Kali" },
      { name: "Mahakali Puja", amount: 51000, description: "Complete puja materials for Kali Puja" },
      { name: "Mahakali Puja General Bhog", amount: 85000, description: "Sacred food offering to Goddess Kali" },
    ],
  },
  {
    id: "saraswati-puja",
    name: "Saraswati Puja",
    description: "Help us celebrate Saraswati Puja, dedicated to the Goddess of knowledge and arts.",
    items: [
      { purpose: "Special Puja", category: "Saraswati Puja", amount: 2000, date: "2026-02-14" },
    ],
    offerings: [
      { name: "Saraswati Maa Dress", amount: 20000, description: "Beautiful attire for Goddess Saraswati" },
    ],
  },
  {
    id: "lakshmi-puja",
    name: "Lakshmi Puja",
    description: "Support the worship of Goddess Lakshmi for prosperity and well-being.",
    items: [
      { purpose: "Special Puja", category: "Lakshmi Puja", amount: 2000, date: "2025-10-28" },

    ],
    offerings: [
      { name: "Saree for Lakshmi Protima", amount: 15000, description: "Traditional attire for Goddess Lakshmi" },
      { name: "Lakshmi Protima", amount: 25000, description: "Complete puja materials" },
    ],
  },
  
]

// Keep the old generalOfferings for backward compatibility (can be removed later)
export const generalOfferings: OfferingItem[] = [
  { name: "Durga Protima", amount: 100001 },
  { name: "Dress for Durga Maa", amount: 51000 },
  { name: "Dress for Maa Laxmi", amount: 15000 },
  { name: "Dress for Maa Saraswati", amount: 15000 },
  { name: "Dress for Shree Ganesha", amount: 15000 },
  { name: "Dress for Shree Kartikeya", amount: 15000 },
  { name: "Lotus Flower - 108 No. (2 Persons per Family)", amount: 25000 },
  { name: "Hom (Materials Only)", amount: 11000 },
  { name: "Kumari Puja (Bhog, Flower Ornaments & Puja Materials)", amount: 15000 },
  { name: "Kumari Puja Saree", amount: 15000 },
  { name: "Dashami Puja", amount: 10000 },
  { name: "Kanakanjali", amount: 35000 },
]
