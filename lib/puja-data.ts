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
      { purpose: "Shashti: Evening Puja", category: "Durga Puja", amount: 2000, date: "2026-10-16" },
      { purpose: "Saptami: Spl. Puja", category: "Durga Puja", amount: 2000, date: "2026-10-17" },
      { purpose: "Saptami: Evening Puja", category: "Durga Puja", amount: 2000, date: "2026-10-17" },
      { purpose: "Ashtami: Spl. Puja", category: "Durga Puja", amount: 2000, date: "2026-10-18" },
      { purpose: "Ashtami: Evening Puja", category: "Durga Puja", amount: 2000, date: "2026-10-18" },
      { purpose: "Adhik Ashtami: Spl. Puja", category: "Durga Puja", amount: 2000, date: "2026-10-19" },
      { purpose: "Adhik Ashtami: Evening Puja", category: "Durga Puja", amount: 2000, date: "2026-10-19" },
      { purpose: "Navami: Spl. Puja", category: "Durga Puja", amount: 2000, date: "2026-10-20" },
      { purpose: "Navami: Evening Puja", category: "Durga Puja", amount: 2000, date: "2026-10-20" },
      { purpose: "Navami: Hom", category: "Durga Puja", amount: 11000, date: "2026-10-20" },
      { purpose: "Sandhi Puja", category: "Durga Puja", amount: 21000, date: "2026-10-19" },
    ],
    // Durga offerings section removed from /donate/durga-puja (committee
    // request). The published list is kept here for reference so it can be
    // restored if the offerings return:
    //   Vastra (Saree) for Maa Durga — ₹51,000
    //   Vastra for Maa Lakshmi / Maa Saraswati / Shri Ganesh / Shri Kartik — ₹15,000
    //   Vastra (Saree) for Kumari Puja — ₹15,000
    //   Maa Kali Vastra (Saree) - Mahalaya to Kojagari Purnima — ₹15,000
    //   108 Lotus - Sandhi Puja — ₹25,000
    //   General Bhog - Community Feeding (per day) — ₹1,00,000
    //   Payesh (Kheer) - Community Feeding (per day) — ₹15,000
    //   Hom (Two Family Members) — ₹11,000
    //   Floral Decor of Maa Kali's Abode (per festival day) — ₹10,000
    //   Puja Materials - Fruits / Flowers / Ghee — ₹10,000
    //   Chandan / Dhoop (Loban) / Agarbati / Camphor & Oil — ₹5,000
    //   Saree / Dhuti Nivedan for Durga Puja (per day) — ₹5,000
    offerings: [],
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
      { name: "Payeesh (Kheer)", amount: 15000, description: "Payesh (kheer) offering for the Kojagari Lakshmi Puja" },
    ],
  },
  {
    id: "amavasya-puja",
    name: "Amavasya Puja",
    description: "Support the monthly Amavasya Puja — new moon worship of Maa Kali and Khichdi Bhog for the community.",
    // Monthly observance (every new moon night), so unlike the annual pujas
    // these items carry no fixed date.
    items: [
      { purpose: "Amavasya: Spl. Puja", category: "Amavasya Puja", amount: 2000 },
    ],
    offerings: [
      { name: "General Bhog", amount: 35000, description: "General bhog offering for the Amavasya Puja" },
      { name: "Water", amount: 5000, description: "Water offering for the Amavasya Puja" },
    ],
  },

]

// NOTE: the old exported `generalOfferings` list was removed — it was imported
// nowhere and held superseded rates. The per-puja `offerings` arrays above are
// the single source, matching the published Durgotsab 2026 offerings sheet.
