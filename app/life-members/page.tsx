"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FileText, Download, Calendar, Users, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"

export default function LifeMembersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (
      !isLoading &&
      (!user ||
        (user.membershipType !== "life" && user.membershipType !== "executive" && user.email !== "admin@kallol.org"))
    ) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // Update the meeting minutes data to include executive committee meetings
  const meetingMinutes = [
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
      date: "2024-11-25",
      title: "Executive Committee Budget Review",
      attendees: 10,
      topics: ["Quarterly Financial Review", "Investment Decisions", "Audit Preparations", "Cost Optimization"],
      summary:
        "Executive committee reviewed quarterly finances, discussed investment opportunities, and prepared for the annual audit.",
      type: "executive",
      downloadUrl: "#",
    },
    {
      id: 4,
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
      id: 5,
      date: "2024-10-15",
      title: "Executive Committee Leadership Meeting",
      attendees: 8,
      topics: ["Committee Restructuring", "Role Assignments", "Performance Reviews", "Succession Planning"],
      summary:
        "Executive committee discussed leadership changes, assigned new roles, and planned for future succession.",
      type: "executive",
      downloadUrl: "#",
    },
    {
      id: 6,
      date: "2024-10-10",
      title: "Durga Puja Review Meeting",
      attendees: 38,
      topics: ["Event Success Review", "Financial Report", "Feedback Collection", "Improvements for Next Year"],
      summary:
        "Reviewed the successful Durga Puja celebration, analyzed financial performance, and collected feedback for future improvements.",
      type: "general",
      downloadUrl: "#",
    },
  ]

  // Filter meeting minutes based on user membership type
  const filteredMeetingMinutes =
    user?.membershipType === "executive" ? meetingMinutes : meetingMinutes.filter((minute) => minute.type === "general")

  const upcomingMeetings = [
    {
      date: "2025-01-15",
      title: "New Year Planning Meeting",
      time: "7:00 PM - 9:00 PM",
      agenda: ["2025 Event Calendar", "Budget Planning", "Committee Restructuring"],
    },
    {
      date: "2025-02-10",
      title: "Saraswati Puja Planning",
      time: "6:30 PM - 8:30 PM",
      agenda: ["Puja Arrangements", "Cultural Program", "Educational Activities"],
    },
  ]

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

  if (!user) {
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
          <div className="flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-kallol-700 mr-3" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Life <span className="text-kallol-700">Members</span>
            </h1>
          </div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Exclusive content for Kallol life members. Access meeting minutes, upcoming member meetings, and important
            community documents.
          </p>
          <Badge className="mt-4 bg-kallol-100 text-kallol-800 border-kallol-200 border">
            Welcome, {user.name} ({user.membershipType} member)
          </Badge>
        </motion.div>

        {/* Upcoming Member Meetings */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Upcoming <span className="text-kallol-700">Member Meetings</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingMeetings.map((meeting, index) => (
              <Card key={index} className="border-gray-200 bg-gradient-to-r from-kallol-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-kallol-700 mr-2" />
                      <span className="font-medium text-kallol-700">
                        {new Date(meeting.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200 border">Upcoming</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{meeting.title}</h3>
                  <p className="text-gray-600 mb-3">{meeting.time}</p>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Agenda:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {meeting.agenda.map((item, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-kallol-700 rounded-full mr-2"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Meeting Minutes */}
        <motion.div initial="hidden" animate="visible" variants={staggerChildren} className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Meeting <span className="text-kallol-700">Minutes</span>
          </h2>
          <div className="space-y-6">
            {filteredMeetingMinutes.map((meeting) => (
              <motion.div key={meeting.id} variants={fadeIn}>
                <Card className="border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <CardTitle className="text-xl text-gray-900">{meeting.title}</CardTitle>
                          <Badge
                            className={
                              meeting.type === "executive"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200 border"
                                : "bg-blue-100 text-blue-800 border-blue-200 border"
                            }
                          >
                            {meeting.type === "executive" ? "Executive Committee" : "General Meeting"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(meeting.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {meeting.attendees} attendees
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-kallol-700 text-kallol-700 hover:bg-kallol-50 mt-4 md:mt-0 bg-transparent"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Topics Discussed:</h4>
                      <div className="flex flex-wrap gap-2">
                        {meeting.topics.map((topic, index) => (
                          <Badge key={index} className="bg-gray-100 text-gray-800 border-gray-200 border text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Summary:</h4>
                      <p className="text-gray-700">{meeting.summary}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Member Resources */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Card className="border-gray-200 bg-gradient-to-r from-gray-50 to-kallol-50 p-8">
            <CardContent className="p-0">
              <FileText className="h-12 w-12 mx-auto mb-4 text-kallol-700" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Member Resources</h2>
              <p className="text-gray-700 max-w-2xl mx-auto mb-6">
                Access important documents, bylaws, and member guidelines. Contact the committee for any additional
                resources or information.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-kallol-700 hover:bg-kallol-800 text-white shadow-md">
                  <FileText className="h-4 w-4 mr-2" />
                  Member Handbook
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-kallol-700 text-kallol-700 hover:bg-kallol-50 shadow-sm bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Bylaws & Constitution
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add a note for executive members about exclusive access */}
        {user?.membershipType === "executive" && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8"
          >
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 border mr-3">
                    Executive Access
                  </Badge>
                  <p className="text-yellow-800 text-sm">
                    As an Executive Member, you have access to both general meeting minutes and exclusive executive
                    committee meeting minutes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </main>
  )
}
