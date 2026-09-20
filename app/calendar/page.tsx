"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getEvents } from "@/actions/events"

interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  location: string
  category: string
  description: string
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEvents = async () => {
      const data = await getEvents()
      // Only show today-and-forward events so past (archived) pujas are never
      // presented as the current schedule.
      const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date())
      const upcoming = data.filter((event) => event.date >= today)
      setEvents(upcoming)
      // If the current month has no events (e.g. the published calendar starts
      // next month), open the calendar on the first month that has events.
      if (upcoming.length > 0) {
        const currentMonthHasEvents = upcoming.some((event) => {
          const d = new Date(`${event.date}T00:00:00Z`)
          return d.getUTCMonth() === currentMonth.getMonth() && d.getUTCFullYear() === currentMonth.getFullYear()
        })
        if (!currentMonthHasEvents) {
          const first = new Date(`${upcoming[0].date}T00:00:00Z`)
          setCurrentMonth(new Date(first.getUTCFullYear(), first.getUTCMonth(), 1))
        }
      }
      setLoading(false)
    }
    loadEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
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
        // Dates are YYYY-MM-DD strings; parse as UTC to avoid day-shift
        const eventDate = new Date(`${event.date}T00:00:00Z`)
        return eventDate.getUTCMonth() === month && eventDate.getUTCFullYear() === year
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
            in Bangur Nagar. Dates below are from the published Calendar of Events — Bengali Year (Bangabda) 1433,
            English Year 2026 – 2027.
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

          {loading ? (
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kallol-700 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading events...</p>
              </CardContent>
            </Card>
          ) : currentMonthEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentMonthEvents.map((event) => (
                <Card key={event.id} className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={`${getCategoryColor(event.category)} border`}>{event.category}</Badge>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
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

        {/* All Upcoming Events Summary */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            All <span className="text-kallol-700">Events</span>
          </h2>

          {loading ? (
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kallol-700 mx-auto"></div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {events.map((event) => (
                <Card key={event.id} className="border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={`${getCategoryColor(event.category)} border`}>{event.category}</Badge>
                      <div className="text-right">
                        <div className="text-sm font-medium text-kallol-700">
                          {new Date(event.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
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
          )}
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
                <div className="flex items-center">
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 border mr-2">Member Meetings</Badge>
                  <span className="text-sm text-gray-600">Exclusive Member Meetings</span>
                </div>
                <div className="flex items-center">
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200 border mr-2">Committee Meetings</Badge>
                  <span className="text-sm text-gray-600">Executive Committee Only</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
