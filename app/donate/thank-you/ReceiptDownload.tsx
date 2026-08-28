"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getDonationReceipt } from "@/actions/donations"

/**
 * Downloads the donation receipt PDF via the getDonationReceipt server action
 * (base64 → Blob → temporary <a download>, same mechanics as the donate form).
 */
export function ReceiptDownload({ donationId }: { donationId: string }) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const receipt = await getDonationReceipt(donationId)
      if (!receipt) {
        alert("Receipt is not available yet. Please refresh and try again.")
        return
      }
      const byteCharacters = atob(receipt.base64)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = receipt.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={isDownloading} className="bg-green-700 hover:bg-green-800 text-white">
      {isDownloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
      Download Receipt
    </Button>
  )
}
