"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const { user } = useAuth()

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Sample events data
  const events = [
    {
      id: 1,
      title: "Kali Puja Celebration",
      date: "2025-11-12",
      time: "6:00 PM - 10:00 PM",
      location: "Kali Mandir, Bangur Nagar",
      category: "religious",
      description: "Grand celebration of Kali Puja with traditional rituals and cultural performances.",
    },
    {
      id: 2,
      title: "Bengali Cultural Night",
      date: "2025-10-25",
      time: "7:00 PM - 11:00 PM",
      location: "Kali Mandir Community Hall",
      category: "cultural",
      description: "Evening of Bengali music, dance, and poetry.",
    },
    {
      id: 3,
      title: "Durga Puja",
      date: "2025-10-10",
      time: "All Day",
      location: "Kali Mandir, Bangur Nagar",
      category: "religious",
      description: "Five-day celebration of Goddess Durga with elaborate decorations and rituals.",
    },
    {
      id: 4,
      title: "Saraswati Puja",
      date: "2026-02-14",
      time: "10:00 AM - 2:00 PM",
      location: "Kali Mandir, Bangur Nagar",
      category: "religious",
      description: "Worship of Goddess Saraswati, deity of knowledge and arts.",
    },
    {
      id: 5,
      title: "Poila Boishakh (Bengali New Year)",
      date: "2025-04-14",
      time: "9:00 AM - 6:00 PM",
      location: "Kali Mandir Community Hall",
      category: "cultural",
      description: "Celebration of Bengali New Year with traditional food and performances.",
    },
    {
      id: 6,
      title: "Rabindra Jayanti",
      date: "2025-05-09",
      time: "5:00 PM - 9:00 PM",
      location: "Kallol Auditorium",
      category: "cultural",
      description: "Commemoration of Rabindranath Tagore's birth anniversary.",
    },
    {
      id: 7,
      title: "Bengali Language Workshop",
      date: "2025-09-18",
      time: "10:00 AM - 1:00 PM",
      location: "Kallol Learning Center",
      category: "educational",
      description: "Learn Bengali language basics with experienced instructors.",
    },
    {
      id: 8,
      title: "Community Meeting",
      date: "2025-08-30",
      time: "5:00 PM - 7:00 PM",
      location: "Kali Mandir Meeting Room",
      category: "community",
      description: "Monthly community meeting to discuss upcoming events and initiatives.",
    },
    ...(user
      ? [
          {
            id: 9,
            title: "Member Meeting - New Year Planning",
            date: "2025-01-15",
            time: "7:00 PM - 9:00 PM",
            location: "Kali Mandir Meeting Room",
            category: "member-meeting",
            description: "Exclusive member meeting to plan events for 2025 and discuss budget allocation.",
          },
          {
            id: 10,
            title: "Member Meeting - Saraswati Puja Planning",
            date: "2025-02-10",
            time: "6:30 PM - 8:30 PM",
            location: "Kali Mandir Meeting Room",
            category: "member-meeting",
            description: "Planning meeting for Saraswati Puja celebration and educational activities.",
          },
        ]
      : []),
    ...(user?.membershipType === "executive"
      ? [
          {
            id: 11,
            title: "Executive Committee Strategic Planning",
            date: "2025-01-20",
            time: "8:00 PM - 10:00 PM",
            location: "Executive Conference Room",
            category: "committee-meeting",
            description: "Exclusive executive committee meeting for strategic planning and leadership decisions.",
          },
          {
            id: 12,
            title: "Executive Committee Budget Review",
            date: "2025-03-15",
            time: "7:30 PM - 9:30 PM",
            location: "Executive Conference Room",
            category: "committee-meeting",
            description: "Quarterly budget review and financial planning session for executive committee.",
          },
          {
            id: 13,
            title: "Executive Committee Leadership Meeting",
            date: "2025-05-20",
            time: "8:00 PM - 10:00 PM",
            location: "Executive Conference Room",
            category: "committee-meeting",
            description: "Executive leadership meeting to discuss organizational structure and key decisions.",
          },
        ]
      : []),
  ]

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const getCategoryColor = (category: string) => {
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

  const getEventsForMonth = (month: number, year: number) => {
    return events
      .filter((event) => {
        const eventDate = new Date(event.date)
        return eventDate.getMonth() === month && eventDate.getFullYear() === year
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const currentMonthEvents = getEventsForMonth(currentMonth.getMonth(), currentMonth.getFullYear())

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
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
            Event <span className="text-kallol-700">Calendar</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Stay updated with all our cultural events, religious celebrations, and community programs at the Kali Mandir
            in Bangur Nagar.
          </p>
        </motion.div>

        {/* Calendar Navigation */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth("prev")}
                  className="border-kallol-700 text-kallol-700 hover:bg-kallol-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-2xl text-gray-900">
                  {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </CardTitle>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth("next")}
                  className="border-kallol-700 text-kallol-700 hover:bg-kallol-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Events for Current Month */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Events in {months[currentMonth.getMonth()]}
          </h2>

          {currentMonthEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentMonthEvents.map((event) => (
                <Card key={event.id} className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={`${getCategoryColor(event.category)} border`}>{event.category}</Badge>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm">{event.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="p-8 text-center">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events This Month</h3>
                <p className="text-gray-600">Check other months for upcoming events and celebrations.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Upcoming Events Summary */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            All Upcoming <span className="text-kallol-700">Events</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {events.map((event) => (
              <Card key={event.id} className="border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={`${getCategoryColor(event.category)} border`}>{event.category}</Badge>
                    <div className="text-right">
                      <div className="text-sm font-medium text-kallol-700">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-700">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Event Categories Legend */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center"
        >
          <Card className="border-gray-200 bg-gradient-to-r from-gray-50 to-kallol-50 p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Event Categories</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center">
                  <Badge className="bg-kallol-100 text-kallol-800 border-kallol-200 border mr-2">Religious</Badge>
                  <span className="text-sm text-gray-600">Pujas & Religious Ceremonies</span>
                </div>
                <div className="flex items-center">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 border mr-2">Cultural</Badge>
                  <span className="text-sm text-gray-600">Music, Dance & Arts</span>
                </div>
                <div className="flex items-center">
                  <Badge className="bg-green-100 text-green-800 border-green-200 border mr-2">Educational</Badge>
                  <span className="text-sm text-gray-600">Workshops & Learning</span>
                </div>
                <div className="flex items-center">
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200 border mr-2">Community</Badge>
                  <span className="text-sm text-gray-600">Meetings & Social Events</span>
                </div>
                {user && (
                  <div className="flex items-center">
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 border mr-2">
                      Member Meetings
                    </Badge>
                    <span className="text-sm text-gray-600">Exclusive Member Meetings</span>
                  </div>
                )}
                {user?.membershipType === "executive" && (
                  <div className="flex items-center">
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200 border mr-2">
                      Committee Meetings
                    </Badge>
                    <span className="text-sm text-gray-600">Executive Committee Only</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
