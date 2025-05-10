"use client"
import { useEffect, useState } from "react"
import {
  Bell,
  MapPin,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Star,
  DollarSign,
  Eye,
  MessageSquare,
  ChevronDown,
  Menu,
  X,
  Loader2Icon,
} from "lucide-react"
import { SessionData } from "@/utils/Types"
import { useSession } from "next-auth/react"
import axios from "axios"
import { GuidePanelData } from "@/utils/Types"
import TimeAgo from "../common/TimeAgo"
import Link from "next/link"
import { useNotificationCount } from "@/providers/NotificationCountProvider"

// Dashboard component
export default function TourGuideDashboard() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { setNotificationCount } = useNotificationCount()

  const [dashboardData, setDashboardData] = useState<GuidePanelData | null>(
    null
  )

  const { data: sessionData } = useSession()
  const session = sessionData as unknown as SessionData

  // Generate star display for ratings
  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      )
    }
    return stars
  }

  const handleGetDashboard = async () => {
    if (!session?.user?.id) return

    setLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/dashboard/${session?.user?.id}`
      )
      const data = response.data

      if (data.success) {
        setDashboardData(data.data)
        setNotificationCount(data.data.metrics.unreadNotifications || 0)
        setError(null)
      } else {
        setError("Failed to load dashboard data")
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setError("Something went wrong while fetching dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGetDashboard()
  }, [session?.user?.id])

  // Get notification icon based on type

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "auth":
        return "🔐"
      case "booking":
        return "📅"
      case "trip":
        return "✈️"
      case "review":
        return "📝"
      case "report":
        return "⚠️"
      default:
        return "📣"
    }
  }

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  //for getting morning, afternoon, evening
  const getTimeOfDay = () => {
    const date = new Date()
    const hours = date.getHours()

    if (hours < 12) {
      return "Good Morning"
    } else if (hours < 18) {
      return "Good Afternoon"
    } else {
      return "Good Evening"
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col w-full items-center justify-center h-screen">
        <Loader2Icon className="animate-spin w-12 h-12 text-primary-dark" />
        <span className="ml-2 text-lg text-gray-700 animate-pulse">
          Loading your dashboard...
        </span>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  return (
    <div className="flex flex-col md:flex-row w-full overflow-y-auto  mt-32 lg:mt-0">
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="mb-8">
          <h2 className="flex-col gap-2  text- font-bold text-gray-800 mb-6">
            <p className="text-lg italic text-gray-600"> {getTimeOfDay()},</p>{" "}
            <p className="text-2xl">{session?.user?.name}!</p>
          </h2>

          {/* Summary Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center text-blue-600 mb-2">
                <Users className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Booking Requests</span>
              </div>
              <p className="text-2xl font-bold">
                {dashboardData?.metrics.totalRequests || 0}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center text-green-600 mb-2">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Trips Completed</span>
              </div>
              <p className="text-2xl font-bold">
                {dashboardData?.metrics.bookingCompletedCount || 0}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center text-yellow-600 mb-2">
                <DollarSign className="w-5 h-5 mr-2" />

                <span className="text-sm font-medium">
                  Total Earnings (estimated)
                </span>
              </div>
              <p className="text-2xl font-bold">
                ${dashboardData?.metrics.totalEarnings || 0}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-4 ">
              <div className="flex items-center text-cyan-600 mb-2">
                <Eye className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Profile Views</span>
              </div>
              <p className="text-2xl font-bold">
                {dashboardData?.metrics.profileViews || 0}
              </p>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1 */}
            <div className="space-y-6 lg:col-span-2">
              {/* Ongoing Trip Status */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Ongoing Trip Status
                  </h3>

                  <Link
                    href={"/guide/ongoing"}
                    className="text-primary-dark hover:text-primary-darker text-sm font-medium underline"
                  >
                    View full trip details
                  </Link>
                </div>

                <div className="p-6">
                  {dashboardData?.ongoingTrip ? (
                    <div>
                      <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        {dashboardData.ongoingTrip.travelStatus ===
                        "not-started" ? (
                          <span className="font-medium">
                            Up Coming Trip From:{" "}
                            {formatDate(dashboardData.ongoingTrip.startDate)}
                          </span>
                        ) : (
                          <span className="font-medium">
                            On Going Trip till:{" "}
                            {formatDate(dashboardData.ongoingTrip.endDate)}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Destination
                          </p>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-red-500" />
                            <p className="font-medium">
                              {dashboardData.ongoingTrip.destination}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Tour Dates
                          </p>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                            <p>
                              {formatDate(dashboardData.ongoingTrip.startDate)}{" "}
                              - {formatDate(dashboardData.ongoingTrip.endDate)}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Group Size
                          </p>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1 text-green-500" />
                            <p>
                              {dashboardData.ongoingTrip.numberOfAdults +
                                (dashboardData.ongoingTrip.numberOfChildren ||
                                  0)}{" "}
                              persons
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 mb-1">Status</p>
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                            <p>{dashboardData.ongoingTrip.travelStatus}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-gray-100 inline-flex p-3 rounded-full mb-3">
                        <Calendar className="w-6 h-6 text-gray-500" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-800 mb-1">
                        No ongoing trips
                      </h4>
                      {dashboardData?.bookingRequests &&
                      dashboardData.bookingRequests.length > 0 ? (
                        <p className="text-gray-500 mb-4">
                          Your next trip is scheduled for{" "}
                          {formatDate(
                            dashboardData.bookingRequests[0].startDate
                          )}
                        </p>
                      ) : (
                        <p className="text-gray-500 mb-4">
                          No upcoming trips scheduled
                        </p>
                      )}
                      <Link
                        href={"/guide/bookings"}
                        className="text-primary-dark hover:text-primary-darker text-sm font-medium underline"
                      >
                        View upcoming trips
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Requests */}
              <div className="bg-white rounded-lg shadow">
                <div className="flex justify-between p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Booking Requests
                  </h3>
                  <Link
                    href={"/guide/bookings"}
                    className="text-primary-dark hover:text-primary-darker text-sm font-medium underline"
                  >
                    View all requests
                  </Link>
                </div>

                <div>
                  {dashboardData?.bookingRequests &&
                  dashboardData.bookingRequests.length > 0 ? (
                    <div>
                      {dashboardData.bookingRequests.map((request) => (
                        <div
                          key={request.id}
                          className="p-4 border-b last:border-0"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="mb-4 md:mb-0">
                              <p className="font-medium text-gray-800">
                                Booking #{request.id}
                              </p>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{request.destination}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>
                                  {formatDate(request.startDate)} -{" "}
                                  {formatDate(request.endDate)}
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Users className="w-4 h-4 mr-1" />
                                <span>
                                  {request.numberOfAdults +
                                    (request.numberOfChildren || 0)}{" "}
                                  travelers
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-gray-500">
                        No booking requests at the moment
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Column 2 - Side widgets */}
            <div className="space-y-6">
              {/* Notifications Panel */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Notifications
                  </h3>
                </div>

                <div>
                  {dashboardData?.notifications &&
                  dashboardData.notifications.length > 0 ? (
                    dashboardData.notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 border-b last:border-0"
                      >
                        <div className="flex">
                          <div className="mr-3">
                            {getNotificationIcon(notification.notificationType)}
                          </div>
                          <div>
                            <p className="text-sm text-gray-800">
                              {notification.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              <TimeAgo timestamp={notification.createdAt} />
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-gray-500">No notifications</p>
                    </div>
                  )}

                  <div className="p-3 text-center">
                    <Link
                      href={"/guide/notifications"}
                      className="text-primary-dark hover:text-primary-darker text-sm font-medium underline"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              </div>

              {/* Reviews Summary */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Reviews Summary
                  </h3>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold text-gray-800 mr-2">
                      {dashboardData?.metrics.averageRating || 0}
                    </span>
                    <div className="flex">
                      {renderStars(dashboardData?.metrics.averageRating || 0)}
                    </div>
                  </div>

                  <p className="text-center text-sm text-gray-600 mb-4">
                    Based on {dashboardData?.metrics.totalReviews || 0} reviews
                  </p>

                  <div className="flex items-center justify-center mt-4">
                    <Link
                      href={"/guide/reviews"}
                      className=" text-primary-dark hover:text-primary-darker text-sm font-medium underline"
                    >
                      View all reviews
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
