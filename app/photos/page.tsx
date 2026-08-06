"use client"

import { useState } from "react"
import { PageBanner } from "@/components/page-banner"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const photos = [
  "/assets/JTP_1443-1-d8c870f0.png",
  "/assets/JTP_1247-1-f92ffbb3.png",
  "/assets/JTP_1234-1-4771bcc1.png",
  "/assets/JTP_1231-1-5f76e9da.png",
  "/assets/JTP_1217-1-c1e031ce.png",
  "/assets/JTP_1201-1-2ae97e60.png",
  "/assets/IMG_9678-1-70926bbd.png",
  "/assets/IMG_9746-1-2c72c36f.png",
  "/assets/JTP_1491-1-90f6da1f.png",
  "/assets/JTP_1498-1-3fbbf405.png",
  "/assets/JTP_1643-1-ddea36c8.png",
  "/assets/JTP_1254-1-4e9a7330.png",
  "/assets/IMG_9461-1-755be556.png",
  "/assets/IMG_9475-1-Copy-424567f0.png",
  "/assets/IMG_9489-1-f0f90b0b.png",
  "/assets/IMG_9527-1-Copy-Copy-35876ad6.png",
  "/assets/IMG_9542-1-e12ebe37.png",
  "/assets/IMG_9569-1-Copy-91ec220e.png",
  "/assets/IMG_9593-1-452ddc43.png",
  "/assets/IMG_9655-1-c38d28b8.png",
  "/assets/IMG_9657-1-2b181274.png",
  "/assets/IMG_9326-1-97a0e10a.png",
  "/assets/IMG_9312-1-d83d3edb.png",
  "/assets/Group-155-370a5d6a.png",
  "/assets/5B8A9995-1-3415c755.png",
  "/assets/5B8A9964-1-4261bc3b.png",
  "/assets/5B8A9986-1-28f6ab31.png",
  "/assets/5B8A9956-1-19a619fe.png",
  "/assets/5B8A9948-1-346cc0b0.png",
  "/assets/5B8A9934-1-ef8dec2f.png",
  "/assets/5B8A9914-1-5f4e4123.png",
  "/assets/5B8A9863-1-132dcd6a.png",
  "/assets/5B8A9858-1-918edc82.png",
  "/assets/5B8A9856-1-94a23956.png",
  "/assets/5B8A9855-1-e5c66122.png",
  "/assets/5B8A9768-1-1f0a19d8.png",
  "/assets/5B8A9821-1-3f5f9c1c.png",
  "/assets/5B8A0204-1-6bc4ecb3.png",
  "/assets/5B8A0194-1-111ec3d3.png",
  "/assets/5B8A0189-1-648c2144.png",
  "/assets/5B8A0163-1-e595cee8.png",
  "/assets/5B8A0151_DG1-1-96522c27.png",
  "/assets/5B8A0146-1-997bf37f.png",
  "/assets/5B8A0047-1-1bfd2947.png",
  "/assets/5B8A0036-1-3e6e6fa5.png",
  "/assets/5B8A0027-1-247c07c0.png",
  "/assets/5B8A0010-1-fc7f37cc.png",
  "/assets/Group-166-1-79b670d5.png",
  "/assets/Group-164-127aae59.webp",
  "/assets/Group-160-7cb5c7f7.webp",
  "/assets/Group-167-19ea704c.webp",
  "/assets/Group-156-aca08dbd.webp",
  "/assets/Frame-151-22f15f6b.webp",
  "/assets/Group-168-4ef147b5.webp",
  "/assets/Group-169-81cdfa8b.webp",
  "/assets/Group-170-4eaa805c.webp",
  "/assets/Group-171-eb8298b5.webp",
]

export default function PhotosPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevPhoto = () => setLightboxIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null))
  const nextPhoto = () => setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null))

  return (
    <main className="min-h-screen pb-16 bg-gray-50">
      <PageBanner title="Photos" subtitle="Gallery of Kallol Kali Mandir" />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              onClick={() => openLightbox(index)}
              className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md cursor-pointer group"
            >
              <img
                src={photo}
                alt={`Kallol photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => { e.stopPropagation(); closeLightbox() }}
              className="absolute top-4 right-4 text-white border-white/30 hover:bg-white/10 bg-transparent z-10"
            >
              <X className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => { e.stopPropagation(); prevPhoto() }}
              className="absolute left-4 text-white border-white/30 hover:bg-white/10 bg-transparent"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={photos[lightboxIndex]}
              alt={`Kallol photo ${lightboxIndex + 1}`}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => { e.stopPropagation(); nextPhoto() }}
              className="absolute right-4 text-white border-white/30 hover:bg-white/10 bg-transparent"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {lightboxIndex + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
