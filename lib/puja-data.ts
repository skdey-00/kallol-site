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
    // Durga Puja 2026 (Bangabda 1433 calendar): Maha Sashti Fri Oct 16,
    // Saptami Sat Oct 17, Ashtami Sun Oct 18, Adhik Ashtami & Sandhi Puja
    // Mon Oct 19 (7:26-8:14 AM), Navami Tue Oct 20 (Kumari Puja & Hom),
    // Vijaya Dashami Wed Oct 21.
    items: [
      { purpose: "Shashti: Spl. Puja", category: "Durga Puja", amount: 2000, date: "2026-10-16" },
      { purpose: "Shashti: Evening Puja", category: "Durga Puja", amount: 2000, date: "2026-10-16" },
      { purpose: "Saptami: Spl. Puja", category: "Durga Puja", amount: 2000, date: "2026-10-17" },
      { purpose: "Saptami: Evening Puja", category: "Durga Puja", amount: 2000, date: "2026-10-17" },
      { purpose: "Ashtami: Spl. Puja", category: "Durga Puja", amount: 2000, date: "2026-10-18" },
      { purpose: "Ashtami: Evening Puja", category: "Durga Puja", amount: 2000, date: "2026-10-18" },
      { purpose: "Adhik Ashtami: Spl. Puja", category: "Durga Puja", amount: 2000, date: "2026-10-19" },
      { purpose: "Adhik Ashtami: Evening Puja", category: "Durga Puja", amount: 2000, date: "2026-10-19" },
      { purpose: "Navami: Spl. Puja", category: "Durga Puja", amount: 2000, date: "2026-10-20" },
      { purpose: "Navami: Evening Puja", category: "Durga Puja", amount: 2000, date: "2026-10-20" },
      { purpose: "Dashami: Spl. Puja", category: "Durga Puja", amount: 2000, date: "2026-10-21" },
      { purpose: "Dashami: Evening Puja", category: "Durga Puja", amount: 2000, date: "2026-10-21" },
      { purpose: "Sandhi Puja", category: "Durga Puja", amount: 21000, date: "2026-10-19" },
    ],
    offerings: [
      { name: "Vastra (Saree) for Maa Durga", amount: 51000, description: "Sacred saree offered to Maa Durga" },
      { name: "Vastra for Maa Lakshmi / Maa Saraswati / Shri Ganesh / Shri Kartik", amount: 15000, description: "Attire for the accompanying deities" },
      { name: "Vastra (Saree) for Kumari Puja", amount: 15000, description: "Saree for the young girl worshipped in Kumari Puja" },
      { name: "Maa Kali Vastra (Saree) - Mahalaya to Kojagari Purnima", amount: 15000, description: "Saree for Maa Kali for the full festive period" },
      { name: "108 Lotus - Sandhi Puja", amount: 25000, description: "108 sacred lotuses offered during Sandhi Puja" },
      { name: "General Bhog - Community Feeding (per day)", amount: 100000, description: "Sponsor the day's community bhog" },
      { name: "Payesh (Kheer) - Community Feeding (per day)", amount: 15000, description: "Sponsor payesh prasad for the community" },
      { name: "Hom (Two Family Members)", amount: 11000, description: "Two members of your family participate in the Hom" },
      { name: "Floral Decor of Maa Kali's Abode (per festival day)", amount: 10000, description: "Flower decoration of the abode of Maa Kali" },
      { name: "Puja Materials - Fruits / Flowers / Ghee", amount: 10000, description: "Fresh fruits, flowers and ghee for the puja" },
      { name: "Chandan / Dhoop (Loban) / Agarbati / Camphor & Oil", amount: 5000, description: "Daily worship essentials" },
      { name: "Saree / Dhuti Nivedan for Durga Puja (per day)", amount: 5000, description: "Traditional cloth offering on any puja day" },
    ],
  },
  {
    id: "kali-puja",
    name: "Kali Puja",
    description: "Contribute to the sacred Kali Puja, held at our Kali Mandir.",
    // Kali Puja 2026 (Bangabda 1433 calendar): Deepawali Amavasya, Nov 8, 2026 (Monday), 11:00 PM.
    items: [
      { purpose: "Special Puja", category: "Kali Puja", amount: 2000, date: "2026-11-08" },
    ],
    offerings: [
      { name: "Maa Kali Vastra (Saree) for Deepavali Kali Puja", amount: 35000, description: "Traditional saree for Maa Kali on Deepavali night" },
      { name: "Sri Sri Kali Puja (Two Family Members)", amount: 51000, description: "Two members of your family participate in the Maha Kali Puja" },
      { name: "General Bhog - Community Feeding Deepavali Kali Puja", amount: 85000, description: "Sponsor the community bhog on Kali Puja night" },
      { name: "Floral Decor of Maa Kali's Abode (Deepavali Kali Puja)", amount: 51000, description: "Floral decoration of the abode of Maa Kali" },
      { name: "Annakut (November 10, 2026)", amount: 21000, description: "The great food-mountain offering after Kali Puja" },
      { name: "Puja Materials - Fruits / Flowers / Ghee", amount: 10000, description: "Fresh fruits, flowers and ghee for the puja" },
      { name: "Chandan / Dhoop (Loban) / Agarbati / Camphor & Oil", amount: 5000, description: "Daily worship essentials" },
    ],
  },
  {
    id: "saraswati-puja",
    name: "Saraswati Puja",
    description: "Help us celebrate Saraswati Puja, dedicated to the Goddess of knowledge and arts.",
    // Saraswati Puja 2027 (Bangabda 1433 calendar): Feb 11, 2027 (Thursday).
    items: [
      { purpose: "Special Puja", category: "Saraswati Puja", amount: 2000, date: "2027-02-11" },
    ],
    offerings: [
      { name: "Saraswati Maa Dress", amount: 20000, description: "Beautiful attire for Goddess Saraswati" },
    ],
  },
  {
    id: "lakshmi-puja",
    name: "Lakshmi Puja",
    description: "Support the worship of Goddess Lakshmi for prosperity and well-being.",
    // Kojagari Lakshmi Puja 2026 (Bangabda 1433 calendar): Kojagari Purnima, Oct 25, 2026 (Sunday).
    items: [
      { purpose: "Special Puja", category: "Lakshmi Puja", amount: 2000, date: "2026-10-25" },

    ],
    offerings: [
      { name: "Maa Lakshmi Pratima - Kojagari Lakshmi Puja", amount: 25000, description: "Idol of Maa Lakshmi for Kojagari night" },
      { name: "Maa Lakshmi Vastra (Saree) for Kojagari Lakshmi Puja", amount: 15000, description: "Traditional saree for Maa Lakshmi" },
      { name: "General Bhog - Community Feeding Kojagari Lakshmi Puja", amount: 51000, description: "Sponsor the community bhog on Kojagari Purnima" },
      { name: "Puja Materials - Fruits / Flowers / Ghee", amount: 10000, description: "Fresh fruits, flowers and ghee for the puja" },
      { name: "Chandan / Dhoop (Loban) / Agarbati / Camphor & Oil", amount: 5000, description: "Daily worship essentials" },
    ],
  },
  
]

// NOTE: the old exported `generalOfferings` list was removed — it was imported
// nowhere and held superseded rates. The per-puja `offerings` arrays above are
// the single source, matching the published Durgotsab 2026 offerings sheet.
