"use client"

import { motion } from "framer-motion"

export function PageBanner({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-[235px] flex items-center justify-center bg-[#44233b] mt-16"
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(68,35,59,0.75), rgba(68,35,59,0.25))`,
        }}
      />
      <div className="relative z-10 text-center px-4 py-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-white/80 mt-3 text-base md:text-lg max-w-2xl">{subtitle}</p>}
      </div>
    </motion.div>
  )
}
