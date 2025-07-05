"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import {
  Upload,
  FileText,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  ImageIcon,
  Check,
  Sparkles,
  Loader2,
  FolderPlus,
  Eye,
  Download,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { getDonations, exportDonationsToCsv } from "@/actions/donations" // Import donation actions

interface MeetingMinute {
  id: number
  date: string
  title: string
  attendees: number
  topics: string[]
  summary: string
  type: "general" | "executive"
  downloadUrl: string
}

interface ImageSuggestion {
  id: number
  imageUrl: string
  fileName: string
  recognizedAs: string
  suggestedPlacements: {
    location: string
    path: string
    confidence: number
    description: string
  }[]
  status: "pending" | "approved" | "rejected"
  publicPath?: string
}

interface PublicImage {
  id: number
  url: string
  fileName: string
  publicPath: string
  uploadDate: string
  usedIn: string[]
}

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
  const [activeTab, setActiveTab] = useState("minutes")
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingMinute, setEditingMinute] = useState<Partial<MeetingMinute>>({})

  // Image management states
  const [dragActiveImage, setDragActiveImage] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [processingImages, setProcessingImages] = useState(false)
  const [imageSuggestions, setImageSuggestions] = useState<ImageSuggestion[]>([])
  const [publicImages, setPublicImages] = useState<PublicImage[]>([
    {
      id: 1,
      url: "/images/kali-mandir-deity.jpg",
      fileName: "kali-mandir-deity.jpg",
      publicPath: "/images/kali-mandir-deity.jpg",
      uploadDate: "2024-05-15",
      usedIn: ["/app/about/page.tsx", "/components/featured-events.tsx"],
    },
    {
      id: 2,
      url: "/images/kallol-logo.png",
      fileName: "kallol-logo.png",
      publicPath: "/images/kallol-logo.png",
      uploadDate: "2024-05-10",
      usedIn: ["/components/navbar.tsx", "/components/hero-section.tsx"],
    },
    {
      id: 3,
      url: "/images/event-placeholder-1.png",
      fileName: "event-placeholder-1.jpg",
      publicPath: "/images/event-placeholder-1.png",
      uploadDate: "2025-07-04",
      usedIn: [],
    },
    {
      id: 4,
      url: "/images/cultural-event-placeholder.png",
      fileName: "cultural-event-placeholder.jpg",
      publicPath: "/images/cultural-event-placeholder.png",
      uploadDate: "2025-07-04",
      usedIn: [],
    },
    {
      id: 5,
      url: "/images/temple-exterior-placeholder.png",
      fileName: "temple-exterior-placeholder.jpg",
      publicPath: "/images/temple-exterior-placeholder.png",
      uploadDate: "2025-07-04",
      usedIn: [],
    },
  ])

  // Donation management states
  const [donationData, setDonationData] = useState<{
    successful: DonationRecord[]
    unsuccessful: DonationRecord[]
  }>({ successful: [], unsuccessful: [] })
  const [loadingDonations, setLoadingDonations] = useState(false)

  // Mock meeting minutes data (in real app, this would come from a database)
  const [meetingMinutes, setMeetingMinutes] = useState<MeetingMinute[]>([
    {
      id: 1,
      date: "2024-12-15",
      title: "Annual General Meeting 2024",
      attendees: 45,
      topics: ["Budget Review", "Event Planning 2025", "Temple Maintenance", "New Member Inductions"],
      summary:
        "Discussed the annual budget, planned major events for 2025 including Durga Puja and Kali Puja celebrations, and approved temple maintenance projects.",
      type: "general",
      downloadUrl: "#",
    },
    {
      id: 2,
      date: "2024-12-10",
      title: "Executive Committee Strategic Planning",
      attendees: 12,
      topics: ["Leadership Restructuring", "Financial Strategy", "Community Outreach", "Partnership Opportunities"],
      summary:
        "Executive committee discussed strategic initiatives for 2025, including leadership changes and new community partnerships.",
      type: "executive",
      downloadUrl: "#",
    },
    {
      id: 3,
      date: "2024-11-20",
      title: "Kali Puja Planning Meeting",
      attendees: 32,
      topics: ["Decoration Committee", "Food Arrangements", "Cultural Program", "Security Arrangements"],
      summary:
        "Finalized arrangements for Kali Puja 2024, assigned responsibilities to various committees, and discussed budget allocation.",
      type: "general",
      downloadUrl: "#",
    },
    {
      id: 7, // New ID
      date: "2024-09-01", // Earlier date for planning
      title: "Durga Puja Planning Meeting 2024",
      attendees: 25,
      topics: ["Pandal Design", "Cultural Program Schedule", "Volunteer Assignments", "Prasad Preparation"],
      summary:
        "Detailed planning for Durga Puja 2024, including logistics, cultural performances, and volunteer roles.",
      type: "general", // General meeting, visible to volunteers
      downloadUrl: "#",
    },
  ])

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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === "application/pdf" || file.type.includes("document")) {
        setUploadedFile(file)
        setIsEditing(true)
        setEditingMinute({
          title: file.name.replace(/\.[^/.]+$/, ""),
          date: new Date().toISOString().split("T")[0],
          attendees: 0,
          topics: [],
          summary: "", // Ensure summary is initialized
          type: "general",
        })
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploadedFile(file)
      setIsEditing(true)
      setEditingMinute({
        title: file.name.replace(/\.[^/.]+$/, ""),
        date: new Date().toISOString().split("T")[0],
        attendees: 0,
        topics: [],
        summary: "", // Ensure summary is initialized
        type: "general",
      })
    }
  }

  const handleSaveMinute = () => {
    if (editingMinute.title && editingMinute.date && editingMinute.summary) {
      const newMinute: MeetingMinute = {
        id: Date.now(),
        title: editingMinute.title!,
        date: editingMinute.date!,
        attendees: editingMinute.attendees || 0,
        topics: editingMinute.topics || [],
        summary: editingMinute.summary!,
        type: (editingMinute.type as "general" | "executive") || "general",
        downloadUrl: "#",
      }

      setMeetingMinutes([newMinute, ...meetingMinutes])
      setIsEditing(false)
      setEditingMinute({})
      setUploadedFile(null)
      toast({
        title: "Meeting Minutes Saved",
        description: `"${newMinute.title}" has been added.`,
        variant: "success",
      })
    } else {
      toast({
        title: "Error Saving Minutes",
        description: "Please fill in all required fields for the meeting minutes.",
        variant: "error",
      })
    }
  }

  const handleDeleteMinute = (id: number) => {
    setMeetingMinutes(meetingMinutes.filter((minute) => minute.id !== id))
    toast({
      title: "Meeting Minutes Deleted",
      description: "The selected meeting minutes have been removed.",
      variant: "default",
    })
  }

  const addTopic = () => {
    setEditingMinute({
      ...editingMinute,
      topics: [...(editingMinute.topics || []), ""],
    })
  }

  const updateTopic = (index: number, value: string) => {
    const newTopics = [...(editingMinute.topics || [])]
    newTopics[index] = value
    setEditingMinute({
      ...editingMinute,
      topics: newTopics,
    })
  }

  const removeTopic = (index: number) => {
    const newTopics = (editingMinute.topics || []).filter((_, i) => i !== index)
    setEditingMinute({
      ...editingMinute,
      topics: newTopics,
    })
  }

  // Image handling functions
  const handleImageDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveImage(true)
    } else if (e.type === "dragleave") {
      setDragActiveImage(false)
    }
  }

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActiveImage(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
      if (files.length > 0) {
        files.forEach((file) => {
          const reader = new FileReader()
          reader.onload = (event) => {
            if (event.target && typeof event.target.result === "string") {
              const base64Image = event.target.result
              setUploadedImages((prev) => [...prev, file])
              simulateAIProcessingWithBase64(file, base64Image)
            }
          }
          reader.readAsDataURL(file)
        })
      }
    }
  }

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).filter((file) => file.type.startsWith("image/"))
      if (files.length > 0) {
        files.forEach((file) => {
          const reader = new FileReader()
          reader.onload = (event) => {
            if (event.target && typeof event.target.result === "string") {
              const base64Image = event.target.result
              setUploadedImages((prev) => [...prev, file])
              simulateAIProcessingWithBase64(file, base64Image)
            }
          }
          reader.readAsDataURL(file)
        })
      }
    }
  }

  const simulateAIProcessingWithBase64 = (file: File, base64Image: string) => {
    setProcessingImages(true)

    setTimeout(() => {
      const filename = file.name.toLowerCase()
      let recognizedAs = "General Image"
      let suggestedPlacements = []

      if (filename.includes("kali") || filename.includes("deity") || filename.includes("goddess")) {
        recognizedAs = "Kali Deity Image"
        suggestedPlacements = [
          {
            location: "Featured Events - Kali Puja",
            path: "/components/featured-events.tsx",
            confidence: 95,
            description: "Replace the first event image with this Kali deity image",
          },
          {
            location: "About Page - Kali Mandir Section",
            path: "/app/about/page.tsx",
            confidence: 90,
            description: "Use as the main image in the Kali Mandir connection section",
          },
        ]
      } else if (filename.includes("durga") || filename.includes("puja")) {
        recognizedAs = "Durga Puja Image"
        suggestedPlacements = [
          {
            location: "Featured Events - Durga Puja",
            path: "/components/featured-events.tsx",
            confidence: 92,
            description: "Use for the Durga Puja event card",
          },
          {
            location: "Upcoming Events Page",
            path: "/app/upcoming-events/page.tsx",
            confidence: 85,
            description: "Add to the Durga Puja event details",
          },
        ]
      } else if (filename.includes("event") || filename.includes("celebration")) {
        recognizedAs = "Cultural Event Image"
        suggestedPlacements = [
          {
            location: "Home Page - Events Section",
            path: "/app/page.tsx",
            confidence: 88,
            description: "Add to the events showcase section",
          },
          {
            location: "Calendar Page",
            path: "/app/calendar/page.tsx",
            confidence: 82,
            description: "Use as a featured event image",
          },
        ]
      } else if (filename.includes("temple") || filename.includes("mandir")) {
        recognizedAs = "Temple Architecture Image"
        suggestedPlacements = [
          {
            location: "About Page - Temple Section",
            path: "/app/about/page.tsx",
            confidence: 94,
            description: "Use as the main temple image",
          },
          {
            location: "Home Page - Hero Section",
            path: "/components/hero-section.tsx",
            confidence: 78,
            description: "Use as a background element in the hero section",
          },
        ]
      } else {
        suggestedPlacements = [
          {
            location: "Gallery Page",
            path: "/app/gallery/page.tsx",
            confidence: 75,
            description: "Add to the general image gallery",
          },
          {
            location: "About Page",
            path: "/app/about/page.tsx",
            confidence: 65,
            description: "Consider using in the community section",
          },
        ]
      }

      const newSuggestion = {
        id: Date.now(),
        imageUrl: base64Image,
        fileName: file.name,
        recognizedAs,
        suggestedPlacements,
        status: "pending",
      }

      setImageSuggestions((prev) => [...prev, newSuggestion])
      setProcessingImages(false)
      toast({
        title: "Image Analysis Complete",
        description: `AI has analyzed "${file.name}" and provided suggestions.`,
        variant: "success",
      })
    }, 2000)
  }

  const handleApproveImagePlacement = (imageId: number, placementIndex: number) => {
    const suggestion = imageSuggestions.find((img) => img.id === imageId)
    if (!suggestion) return

    const placement = suggestion.suggestedPlacements[placementIndex]
    if (!placement) return

    // Simulate adding to public images, but don't actually modify the static list
    // For persistent storage, you would integrate with a backend service here.
    setImageSuggestions((prev) =>
      prev.map((img) =>
        img.id === imageId
          ? {
              ...img,
              status: "approved",
              publicPath: `/images/${suggestion.fileName}`, // Simulate public path
            }
          : img,
      ),
    )

    toast({
      title: "Image Placement Simulated",
      description: `${suggestion.fileName} would be placed at ${placement.location}. For persistent changes, a backend is required.`,
      variant: "success",
    })
  }

  const handleAddToRepository = (imageId: number) => {
    const suggestion = imageSuggestions.find((img) => img.id === imageId)
    if (!suggestion) return

    // Simulate adding to public images, but don't actually modify the static list
    // For persistent storage, you would integrate with a backend service here.
    setImageSuggestions((prev) =>
      prev.map((img) =>
        img.id === imageId
          ? {
              ...img,
              status: "approved",
              publicPath: `/images/${suggestion.fileName}`, // Simulate public path
            }
          : img,
      ),
    )

    toast({
      title: "Image Added to Repository (Simulated)",
      description: `${suggestion.fileName} would be added to the image repository. For persistent changes, a backend is required.`,
      variant: "success",
    })
  }

  const handleRejectImage = (imageId: number) => {
    setImageSuggestions((prev) => prev.filter((img) => img.id !== imageId))
    toast({
      title: "Image Rejected",
      description: "The image suggestion has been removed.",
      variant: "default",
    })
  }

  const handleDeletePublicImage = (imageId: number) => {
    // Simulate deletion, but don't actually remove from the static list
    // For persistent storage, you would integrate with a backend service here.
    toast({
      title: "Image Deletion Simulated",
      description: "The image would be removed from the repository. For persistent changes, a backend is required.",
      variant: "default",
    })
  }

  const handleDirectUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.type.startsWith("image/")) {
        // Simulate upload, but don't actually add to the static list
        // For persistent storage, you would integrate with a backend service here.
        toast({
          title: "Image Upload Simulated",
          description: `${file.name} would be added to the public repository. For persistent changes, a backend is required.`,
          variant: "success",
        })
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file.",
          variant: "error",
        })
      }
    }
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
            Manage meeting minutes, upload documents, and oversee Kallol's digital content.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            {" "}
            {/* Changed to 3 columns */}
            <TabsTrigger value="minutes" className="text-lg py-3">
              <FileText className="h-5 w-5 mr-2" />
              Meeting Minutes
            </TabsTrigger>
            <TabsTrigger value="images" className="text-lg py-3">
              <ImageIcon className="h-5 w-5 mr-2" />
              AI Image Management
            </TabsTrigger>
            <TabsTrigger value="donations" className="text-lg py-3">
              {" "}
              {/* New tab */}
              <Heart className="h-5 w-5 mr-2" />
              Donation Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="minutes">
            {/* Upload Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12"
            >
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">Upload Meeting Minutes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? "border-kallol-700 bg-kallol-50"
                        : "border-gray-300 hover:border-kallol-700 hover:bg-kallol-50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Drag and drop your meeting minutes here
                    </h3>
                    <p className="text-gray-600 mb-4">or click to browse files</p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <FileText className="h-4 w-4 mr-2" />
                        Choose File
                      </label>
                    </Button>
                  </div>
                  {uploadedFile && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-green-800">
                        <strong>File uploaded:</strong> {uploadedFile.name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Edit Meeting Minute Form */}
            {isEditing && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-900">Add Meeting Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Meeting Title</Label>
                        <Input
                          id="title"
                          value={editingMinute.title || ""}
                          onChange={(e) => setEditingMinute({ ...editingMinute, title: e.target.value })}
                          placeholder="Enter meeting title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="date">Meeting Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={editingMinute.date || ""}
                          onChange={(e) => setEditingMinute({ ...editingMinute, date: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="attendees">Number of Attendees</Label>
                        <Input
                          id="attendees"
                          type="number"
                          value={editingMinute.attendees || ""}
                          onChange={(e) =>
                            setEditingMinute({ ...editingMinute, attendees: Number.parseInt(e.target.value) || 0 })
                          }
                          placeholder="Enter number of attendees"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Meeting Type</Label>
                        <select
                          id="type"
                          value={editingMinute.type || "general"}
                          onChange={(e) =>
                            setEditingMinute({ ...editingMinute, type: e.target.value as "general" | "executive" })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kallol-700"
                        >
                          <option value="general">General Meeting</option>
                          <option value="executive">Executive Committee Meeting</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label>Topics Discussed</Label>
                      <div className="space-y-2 mt-2">
                        {(editingMinute.topics || []).map((topic, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Input
                              value={topic}
                              onChange={(e) => updateTopic(index, e.target.value)}
                              placeholder="Enter topic"
                            />
                            <Button type="button" variant="outline" size="sm" onClick={() => removeTopic(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addTopic}
                          className="border-kallol-700 text-kallol-700 hover:bg-kallol-50 bg-transparent"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Topic
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="summary">Meeting Summary</Label>
                      <Textarea
                        id="summary"
                        value={editingMinute.summary || ""}
                        onChange={(e) => setEditingMinute({ ...editingMinute, summary: e.target.value })}
                        placeholder="Enter a brief summary of the meeting"
                        rows={4}
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button onClick={handleSaveMinute} className="bg-kallol-700 hover:bg-kallol-800 text-white">
                        <Save className="h-4 w-4 mr-2" />
                        Save Meeting Minutes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false)
                          setEditingMinute({})
                          setUploadedFile(null)
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Existing Meeting Minutes */}
            <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.4 }}>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Manage <span className="text-kallol-700">Meeting Minutes</span>
              </h2>
              <div className="space-y-6">
                {meetingMinutes.length === 0 ? (
                  <Card className="border-gray-200 bg-gray-50">
                    <CardContent className="p-8 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Meeting Minutes Found</h3>
                      <p className="text-gray-600">Upload new meeting minutes to get started.</p>
                    </CardContent>
                  </Card>
                ) : (
                  meetingMinutes.map((minute) => (
                    <Card key={minute.id} className="border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{minute.title}</h3>
                              <Badge
                                className={
                                  minute.type === "executive"
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-200 border"
                                    : "bg-blue-100 text-blue-800 border-blue-200 border"
                                }
                              >
                                {minute.type === "executive" ? "Executive" : "General"}
                              </Badge>
                            </div>
                            <p className="text-gray-600">
                              {new Date(minute.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}{" "}
                              • {minute.attendees} attendees
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-kallol-700 text-kallol-700 hover:bg-kallol-50 bg-transparent"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteMinute(minute.id)}
                              className="border-red-700 text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Topics Discussed:</h4>
                          <div className="flex flex-wrap gap-2">
                            {minute.topics.map((topic, index) => (
                              <Badge key={index} className="bg-gray-100 text-gray-800 border-gray-200 border text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Summary:</h4>
                          <p className="text-gray-700">{minute.summary}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="images">
            {/* AI Image Upload Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 flex items-center">
                    <Sparkles className="h-6 w-6 mr-2 text-kallol-700" />
                    AI-Powered Image Upload
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActiveImage
                        ? "border-kallol-700 bg-kallol-50"
                        : "border-gray-300 hover:border-kallol-700 hover:bg-kallol-50"
                    }`}
                    onDragEnter={handleImageDrag}
                    onDragLeave={handleImageDrag}
                    onDragOver={handleImageDrag}
                    onDrop={handleImageDrop}
                  >
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Drag and drop images here for AI analysis
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Our AI will analyze your images and suggest the best places to use them on the website
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageInput}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button asChild className="bg-kallol-700 hover:bg-kallol-800 text-white">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Choose Images
                      </label>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Processing indicator */}
            {processingImages && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-center"
              >
                <Loader2 className="h-6 w-6 mr-3 animate-spin text-kallol-700" />
                <p className="text-blue-800 font-medium">
                  AI is analyzing your images and finding the best places to use them...
                </p>
              </motion.div>
            )}

            {/* AI Image Suggestions */}
            {imageSuggestions.length > 0 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Sparkles className="h-6 w-6 mr-2 text-kallol-700" />
                  AI Image <span className="text-kallol-700 ml-2">Suggestions</span>
                </h2>

                <div className="space-y-8">
                  {imageSuggestions.map((suggestion) => (
                    <Card
                      key={suggestion.id}
                      className={`border-gray-200 ${suggestion.status === "approved" ? "bg-green-50" : ""}`}
                    >
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Image preview */}
                          <div className="flex flex-col items-center">
                            <div className="relative h-48 w-full rounded-lg overflow-hidden mb-3">
                              <Image
                                src={suggestion.imageUrl || "/placeholder.svg"}
                                alt={suggestion.recognizedAs}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 border">
                              {suggestion.recognizedAs}
                            </Badge>

                            {suggestion.status === "approved" ? (
                              <div className="mt-4 flex items-center text-green-700">
                                <Check className="h-5 w-5 mr-2" />
                                <span className="font-medium">
                                  {suggestion.publicPath ? "Image Placed Successfully" : "Added to Repository"}
                                </span>
                              </div>
                            ) : (
                              <div className="mt-4 flex flex-col gap-2 w-full">
                                <Button
                                  onClick={() => handleAddToRepository(suggestion.id)}
                                  className="bg-kallol-700 hover:bg-kallol-800 text-white w-full"
                                  size="sm"
                                >
                                  <FolderPlus className="h-4 w-4 mr-2" />
                                  Add to Repository
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRejectImage(suggestion.id)}
                                  className="border-red-700 text-red-700 hover:bg-red-50 w-full"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove Image
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* Suggested placements */}
                          <div className="lg:col-span-2">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Suggested Placements</h3>

                            {suggestion.status === "approved" ? (
                              <div className="p-4 bg-green-100 rounded-lg">
                                <p className="text-green-800">
                                  This image has been successfully added to the public repository at{" "}
                                  <code className="bg-green-50 px-2 py-1 rounded">{suggestion.publicPath}</code>
                                </p>
                                <p className="text-green-800 mt-2">
                                  You can now use this image throughout the website by referencing this path.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {suggestion.suggestedPlacements.map((placement, index) => (
                                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <h4 className="font-medium text-gray-900">{placement.location}</h4>
                                        <p className="text-sm text-gray-500">{placement.path}</p>
                                      </div>
                                      <Badge
                                        className={`${
                                          placement.confidence > 90
                                            ? "bg-green-100 text-green-800 border-green-200"
                                            : placement.confidence > 80
                                              ? "bg-blue-100 text-blue-800 border-blue-200"
                                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                        } border`}
                                      >
                                        {placement.confidence}% Match
                                      </Badge>
                                    </div>
                                    <p className="text-gray-700 text-sm mb-3">{placement.description}</p>
                                    <Button
                                      onClick={() => handleApproveImagePlacement(suggestion.id, index)}
                                      className="bg-kallol-700 hover:bg-kallol-800 text-white"
                                      size="sm"
                                    >
                                      <Check className="h-4 w-4 mr-2" />
                                      Apply Here
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Image Repository */}
            <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.4 }}>
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 flex items-center">
                    <FolderPlus className="h-6 w-6 mr-2" />
                    Image Repository
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative h-40 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleDirectUpload}
                        className="hidden"
                        id="repo-image-upload"
                      />
                      <label
                        htmlFor="repo-image-upload"
                        className="cursor-pointer flex flex-col items-center text-gray-500 hover:text-kallol-700"
                      >
                        <Plus className="h-8 w-8 mb-2" />
                        <span>Add Image</span>
                      </label>
                    </div>

                    {/* Repository images */}
                    {publicImages.map((image) => (
                      <div key={image.id} className="relative h-40 rounded-lg overflow-hidden group">
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={image.fileName}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="bg-white text-gray-900">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-white text-red-700"
                              onClick={() => handleDeletePublicImage(image.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 truncate">
                          {image.fileName}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    {publicImages.length} {publicImages.length === 1 ? "image" : "images"} in repository
                  </p>
                  <Button
                    variant="outline"
                    className="border-kallol-700 text-kallol-700 hover:bg-kallol-50 bg-transparent"
                  >
                    View All Images
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

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
