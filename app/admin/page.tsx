"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Heart, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { getDonations, exportDonationsToCsv } from "@/actions/donations"

interface DonationRecord {
  id: string
  firstName: string
  lastName: string
  gotra: string
  phoneNumber: string
  amount: string
  paymentMethod: string
  message?: string
  timestamp: string
}

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("donations") // Default to donations tab

  // Donation management states
  const [donationData, setDonationData] = useState<{
    successful: DonationRecord[]
    unsuccessful: DonationRecord[]
  }>({ successful: [], unsuccessful: [] })
  const [loadingDonations, setLoadingDonations] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || user.email !== "admin@kallol.org")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Fetch donations when the tab changes to 'donations'
  useEffect(() => {
    if (activeTab === "donations") {
      const fetchDonations = async () => {
        setLoadingDonations(true)
        const data = await getDonations()
        setDonationData(data)
        setLoadingDonations(false)
      }
      fetchDonations()
    }
  }, [activeTab])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const handleDownloadCsv = async (type: "successful" | "unsuccessful") => {
    const csvData = await exportDonationsToCsv(type)
    if (!csvData) {
      toast({
        title: "No Data to Export",
        description: `There are no ${type} donations to download.`,
        variant: "warning",
      })
      return
    }

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `${type}_donations_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast({
        title: "CSV Downloaded",
        description: `The ${type} donations CSV file has been downloaded.`,
        variant: "success",
      })
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen pt-20 pb-16 px-4 md:px-6 lg:px-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kallol-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }

  if (!user || user.email !== "admin@kallol.org") {
    return null
  }

  return (
    <main className="min-h-screen pt-20 pb-16 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Admin <span className="text-kallol-700">Dashboard</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Manage Kallol's digital content and oversee donation records.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="grid w-full grid-cols-1 mb-8">
            <TabsTrigger value="donations" className="text-lg py-3">
              <Heart className="h-5 w-5 mr-2" />
              Donation Management
            </TabsTrigger>
          </TabsList>

          {/* Donation Management Tab Content */}
          <TabsContent value="donations">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Donation <span className="text-kallol-700">Records</span>
              </h2>

              {loadingDonations ? (
                <Card className="border-gray-200 bg-gray-50">
                  <CardContent className="p-8 text-center">
                    <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-kallol-700" />
                    <p className="text-gray-600">Loading donation data...</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Successful Donations */}
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xl font-bold text-green-800">Successful Donations</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadCsv("successful")}
                        className="border-green-700 text-green-700 hover:bg-green-100"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download CSV
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {donationData.successful.length === 0 ? (
                        <p className="text-green-700">No successful donations yet.</p>
                      ) : (
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                          {donationData.successful.map((donation) => (
                            <div
                              key={donation.id}
                              className="p-3 bg-white rounded-md border border-green-100 shadow-sm"
                            >
                              <p className="font-semibold text-gray-900">
                                {donation.firstName} {donation.lastName} ({donation.gotra})
                              </p>
                              <p className="text-sm text-gray-700">
                                Amount: <span className="font-medium">₹{donation.amount}</span> via{" "}
                                {donation.paymentMethod}
                              </p>
                              <p className="text-xs text-gray-500">{new Date(donation.timestamp).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Unsuccessful Donations */}
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xl font-bold text-red-800">Unsuccessful Donations</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadCsv("unsuccessful")}
                        className="border-red-700 text-red-700 hover:bg-red-100"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download CSV
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {donationData.unsuccessful.length === 0 ? (
                        <p className="text-red-700">No unsuccessful donations yet.</p>
                      ) : (
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                          {donationData.unsuccessful.map((donation) => (
                            <div key={donation.id} className="p-3 bg-white rounded-md border border-red-100 shadow-sm">
                              <p className="font-semibold text-gray-900">
                                {donation.firstName} {donation.lastName} ({donation.gotra})
                              </p>
                              <p className="text-sm text-gray-700">
                                Amount: <span className="font-medium">₹{donation.amount}</span> via{" "}
                                {donation.paymentMethod}
                              </p>
                              <p className="text-xs text-gray-500">{new Date(donation.timestamp).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
