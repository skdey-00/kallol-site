"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Loader2,
  Heart,
  Download,
  ScanLine,
  ImageIcon,
  CalendarPlus,
  Calendar,
  Pencil,
  Trash2,
  Plus,
  X,
  Clock,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { getDonations, exportDonationsToCsv } from "@/actions/donations"
import { getEvents, addEvent, updateEvent, deleteEvent } from "@/actions/events"
import type { CalendarEvent } from "@/lib/events-store"

interface DonationRecord {
  id: string
  firstName: string
  lastName: string
  gotra: string
  phoneNumber: string
  panNumber?: string
  totalAmount: string
  paymentMethod: string
  message?: string
  status: string
  timestamp: string
  qrCodeToken?: string
  donationItems?: Array<{ purpose: string; category: string; amount: string; date?: string }>
  qrCodeScans?: Array<{ timestamp: string; itemIndex: number; photoPath?: string }>
}

const CATEGORIES = [
  { value: "religious", label: "Religious" },
  { value: "cultural", label: "Cultural" },
  { value: "educational", label: "Educational" },
  { value: "community", label: "Community" },
  { value: "member-meeting", label: "Member Meeting" },
  { value: "committee-meeting", label: "Committee Meeting" },
]

function getCategoryColor(category: string) {
  switch (category) {
    case "religious":
      return "bg-kallol-100 text-kallol-800 border-kallol-200"
    case "cultural":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "educational":
      return "bg-green-100 text-green-800 border-green-200"
    case "community":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "member-meeting":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "committee-meeting":
      return "bg-orange-100 text-orange-800 border-orange-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("donations")

  // Donation management states
  const [donationData, setDonationData] = useState<{
    successful: DonationRecord[]
    unsuccessful: DonationRecord[]
    pending: DonationRecord[]
  }>({ successful: [], unsuccessful: [], pending: [] })
  const [loadingDonations, setLoadingDonations] = useState(false)

  // Event management states
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [eventForm, setEventForm] = useState<Omit<CalendarEvent, "id">>({
    title: "",
    date: "",
    time: "",
    location: "",
    category: "community",
    description: "",
  })
  const [savingEvent, setSavingEvent] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && (!user || user.email !== "admin@kallol.org")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Fetch donations when relevant tabs are active
  useEffect(() => {
    if (activeTab === "donations" || activeTab === "scan-verification") {
      const fetchDonations = async () => {
        setLoadingDonations(true)
        const data = await getDonations()
        setDonationData(data)
        setLoadingDonations(false)
      }
      fetchDonations()
    }
  }, [activeTab])

  // Fetch events when events tab is active
  useEffect(() => {
    if (activeTab === "events") {
      fetchEvents()
    }
  }, [activeTab])

  const fetchEvents = async () => {
    setLoadingEvents(true)
    const data = await getEvents()
    setEvents(data)
    setLoadingEvents(false)
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const handleDownloadCsv = async (type: "successful" | "unsuccessful" | "pending") => {
    const csvData = await exportDonationsToCsv(type)
    if (!csvData) {
      toast({ title: "No Data to Export", description: `There are no ${type} donations to download.`, variant: "warning" })
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
      toast({ title: "CSV Downloaded", description: `The ${type} donations CSV file has been downloaded.`, variant: "success" })
    }
  }

  // --- Event form helpers ---
  const resetEventForm = () => {
    setEventForm({ title: "", date: "", time: "", location: "", category: "community", description: "" })
    setEditingEvent(null)
    setShowEventForm(false)
  }

  const openAddEventForm = () => {
    resetEventForm()
    setShowEventForm(true)
  }

  const openEditEventForm = (event: CalendarEvent) => {
    setEventForm({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      description: event.description,
    })
    setEditingEvent(event)
    setShowEventForm(true)
  }

  const handleSaveEvent = async () => {
    if (!eventForm.title.trim() || !eventForm.date.trim()) {
      toast({ title: "Missing Fields", description: "Title and date are required.", variant: "error" })
      return
    }
    setSavingEvent(true)
    try {
      if (editingEvent) {
        const result = await updateEvent(editingEvent.id, eventForm)
        if (result.success) {
          toast({ title: "Event Updated", description: `"${eventForm.title}" has been updated.`, variant: "success" })
        } else {
          toast({ title: "Error", description: result.error || "Failed to update event.", variant: "error" })
        }
      } else {
        const result = await addEvent(eventForm)
        if (result.success) {
          toast({ title: "Event Added", description: `"${eventForm.title}" has been added to the calendar.`, variant: "success" })
        } else {
          toast({ title: "Error", description: result.error || "Failed to add event.", variant: "error" })
        }
      }
      resetEventForm()
      await fetchEvents()
    } catch (err) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "error" })
    } finally {
      setSavingEvent(false)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    const result = await deleteEvent(id)
    if (result.success) {
      toast({ title: "Event Deleted", description: "The event has been removed.", variant: "success" })
      setDeleteConfirmId(null)
      await fetchEvents()
    } else {
      toast({ title: "Error", description: result.error || "Failed to delete event.", variant: "error" })
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

  // Gather scan data
  const allDonations = [...donationData.successful, ...donationData.unsuccessful]
  const donationsWithScans = allDonations
    .filter((d) => d.qrCodeScans && d.qrCodeScans.length > 0)
    .map((d) => ({
      ...d,
      qrCodeScans: d.qrCodeScans!.map((scan) => ({
        ...scan,
        itemDetails: d.donationItems?.[scan.itemIndex],
      })),
    }))

  const scanEntries = donationsWithScans.flatMap((d) =>
    d.qrCodeScans!.map((scan) => ({
      donorName: `${d.firstName} ${d.lastName}`,
      gotra: d.gotra,
      totalAmount: d.totalAmount,
      scanTimestamp: scan.timestamp,
      photoPath: scan.photoPath,
      purpose: (scan as any).itemDetails?.purpose || "Unknown",
      category: (scan as any).itemDetails?.category || "Unknown",
    })),
  )

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
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="donations" className="text-base py-3">
              <Heart className="h-5 w-5 mr-2" />
              Donations
            </TabsTrigger>
            <TabsTrigger value="scan-verification" className="text-base py-3">
              <ScanLine className="h-5 w-5 mr-2" />
              Scans ({scanEntries.length})
            </TabsTrigger>
            <TabsTrigger value="events" className="text-base py-3">
              <Calendar className="h-5 w-5 mr-2" />
              Events ({events.length})
            </TabsTrigger>
          </TabsList>

          {/* ─── Donation Management Tab ─── */}
          <TabsContent value="donations">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }} className="mb-12">
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
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xl font-bold text-green-800">Successful Donations</CardTitle>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadCsv("successful")} className="border-green-700 text-green-700 hover:bg-green-100">
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
                            <div key={donation.id} className="p-3 bg-white rounded-md border border-green-100 shadow-sm">
                              <p className="font-semibold text-gray-900">{donation.firstName} {donation.lastName} ({donation.gotra})</p>
                              <p className="text-sm text-gray-700">Amount: <span className="font-medium">Rs.{donation.totalAmount}</span> via {donation.paymentMethod}</p>
                              {donation.panNumber && <p className="text-xs text-gray-500">PAN: {donation.panNumber}</p>}
                              <p className="text-xs text-gray-500">{new Date(donation.timestamp).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-red-200 bg-red-50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xl font-bold text-red-800">Unsuccessful Donations</CardTitle>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadCsv("unsuccessful")} className="border-red-700 text-red-700 hover:bg-red-100">
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
                              <p className="font-semibold text-gray-900">{donation.firstName} {donation.lastName} ({donation.gotra})</p>
                              <p className="text-sm text-gray-700">Amount: <span className="font-medium">Rs.{donation.totalAmount}</span> via {donation.paymentMethod}</p>
                              {donation.panNumber && <p className="text-xs text-gray-500">PAN: {donation.panNumber}</p>}
                              <p className="text-xs text-gray-500">{new Date(donation.timestamp).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {donationData.pending.length > 0 && (
                    <Card className="border-yellow-200 bg-yellow-50 lg:col-span-2">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                          <CardTitle className="text-xl font-bold text-yellow-800">Pending Donations</CardTitle>
                          <p className="text-sm text-yellow-700 mt-1">
                            Online payments awaiting confirmation (donor left checkout or the gateway hasn&apos;t
                            notified us yet).
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadCsv("pending")} className="border-yellow-700 text-yellow-700 hover:bg-yellow-100">
                          <Download className="h-4 w-4 mr-2" />
                          Download CSV
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                          {donationData.pending.map((donation) => (
                            <div key={donation.id} className="p-3 bg-white rounded-md border border-yellow-100 shadow-sm">
                              <p className="font-semibold text-gray-900">{donation.firstName} {donation.lastName} ({donation.gotra})</p>
                              <p className="text-sm text-gray-700">Amount: <span className="font-medium">Rs.{donation.totalAmount}</span> via {donation.paymentMethod}</p>
                              <p className="text-xs text-gray-500">{new Date(donation.timestamp).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* ─── Scan Verification Tab ─── */}
          <TabsContent value="scan-verification">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Scan <span className="text-kallol-700">Verification</span>
              </h2>
              <p className="text-gray-600 mb-6">Verification photos captured when QR codes were scanned by volunteers.</p>

              {loadingDonations ? (
                <Card className="border-gray-200 bg-gray-50">
                  <CardContent className="p-8 text-center">
                    <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-kallol-700" />
                    <p className="text-gray-600">Loading scan data...</p>
                  </CardContent>
                </Card>
              ) : scanEntries.length === 0 ? (
                <Card className="border-gray-200">
                  <CardContent className="p-8 text-center">
                    <ScanLine className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No QR scans recorded yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {scanEntries
                    .sort((a, b) => new Date(b.scanTimestamp).getTime() - new Date(a.scanTimestamp).getTime())
                    .map((entry, idx) => (
                      <Card key={idx} className="border-gray-200 overflow-hidden">
                        {entry.photoPath ? (
                          <div className="relative w-full h-48 bg-gray-100">
                            <img src={`/api/photos/${entry.photoPath}`} alt={`Verification: ${entry.donorName}`} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-gray-300" />
                            <span className="text-gray-400 text-sm ml-2">No photo</span>
                          </div>
                        )}
                        <CardContent className="p-4">
                          <p className="font-semibold text-gray-900">{entry.donorName}</p>
                          <p className="text-sm text-gray-600">Gotra: {entry.gotra}</p>
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <p className="text-sm text-gray-700"><span className="font-medium">{entry.purpose}</span><span className="text-gray-400 ml-1">({entry.category})</span></p>
                            <p className="text-sm text-gray-600 mt-1">Donation Amount: Rs.{entry.totalAmount}</p>
                            <p className="text-xs text-gray-500 mt-2">Scanned: {new Date(entry.scanTimestamp).toLocaleString()}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* ─── Event Management Tab ─── */}
          <TabsContent value="events">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Event <span className="text-kallol-700">Management</span>
                </h2>
                {!showEventForm && (
                  <Button onClick={openAddEventForm} className="bg-kallol-700 hover:bg-kallol-800 text-white">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Event
                  </Button>
                )}
              </div>

              {/* Event Add/Edit Form */}
              {showEventForm && (
                <Card className="border-kallol-200 mb-6">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 flex items-center">
                      {editingEvent ? <Pencil className="h-5 w-5 mr-2" /> : <CalendarPlus className="h-5 w-5 mr-2" />}
                      {editingEvent ? "Edit Event" : "New Event"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Title */}
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="event-title">Event Title *</Label>
                        <Input
                          id="event-title"
                          value={eventForm.title}
                          onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                          placeholder="e.g. Kali Puja Celebration"
                        />
                      </div>

                      {/* Date */}
                      <div className="space-y-2">
                        <Label htmlFor="event-date">Date *</Label>
                        <Input
                          id="event-date"
                          type="date"
                          value={eventForm.date}
                          onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                        />
                      </div>

                      {/* Time */}
                      <div className="space-y-2">
                        <Label htmlFor="event-time">Time</Label>
                        <Input
                          id="event-time"
                          value={eventForm.time}
                          onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                          placeholder="e.g. 6:00 PM - 10:00 PM"
                        />
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <Label htmlFor="event-location">Location</Label>
                        <Input
                          id="event-location"
                          value={eventForm.location}
                          onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                          placeholder="e.g. Kali Mandir, Bangur Nagar"
                        />
                      </div>

                      {/* Category */}
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                          value={eventForm.category}
                          onValueChange={(val) =>
                            setEventForm({ ...eventForm, category: val as CalendarEvent["category"] })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Description */}
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="event-desc">Description</Label>
                        <Textarea
                          id="event-desc"
                          value={eventForm.description}
                          onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                          placeholder="Describe the event..."
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button onClick={handleSaveEvent} disabled={savingEvent} className="bg-kallol-700 hover:bg-kallol-800 text-white">
                        {savingEvent ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                        {editingEvent ? "Save Changes" : "Add Event"}
                      </Button>
                      <Button variant="outline" onClick={resetEventForm} className="border-gray-300">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Events List */}
              {loadingEvents ? (
                <Card className="border-gray-200 bg-gray-50">
                  <CardContent className="p-8 text-center">
                    <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-kallol-700" />
                    <p className="text-gray-600">Loading events...</p>
                  </CardContent>
                </Card>
              ) : events.length === 0 ? (
                <Card className="border-gray-200">
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No events yet. Click "Add Event" to create one.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <Card
                      key={event.id}
                      className={`border-gray-200 hover:shadow-lg transition-shadow duration-300 ${
                        deleteConfirmId === event.id ? "ring-2 ring-red-400" : ""
                      }`}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <Badge className={`${getCategoryColor(event.category)} border`}>{event.category}</Badge>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </div>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>

                        <div className="space-y-1 mb-3">
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="text-sm">{event.time}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                        </div>

                        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{event.description}</p>

                        {/* Actions */}
                        {deleteConfirmId === event.id ? (
                          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                            <p className="text-sm text-red-600 font-medium mr-auto">Delete this event?</p>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Yes, Delete
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirmId(null)}
                              className="border-gray-300"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditEventForm(event)}
                              className="border-kallol-700 text-kallol-700 hover:bg-kallol-50"
                            >
                              <Pencil className="h-3.5 w-3.5 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirmId(event.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
