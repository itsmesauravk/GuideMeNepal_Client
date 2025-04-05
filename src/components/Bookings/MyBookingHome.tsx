"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trash2,
  MessageCircle,
  AlertTriangle,
  RefreshCwIcon,
  CheckCircle,
  XCircle,
  History,
  ChevronDown,
  ChevronUp,
  TrashIcon,
} from "lucide-react"
import { Spinner, Tooltip } from "@heroui/react"

import Link from "next/link"
import { BookingType } from "@/utils/Types"
import TimeAgo from "../common/TimeAgo"
import { useSession } from "next-auth/react"
import { SessionData } from "@/utils/Types"

const BookingHome = () => {
  const [bookings, setBookings] = useState<BookingType[]>([])
  const [loading, setLoading] = useState(false)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  )
  const [cancelReason, setCancelReason] = useState("")
  const [cancelLoading, setCancelLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [expandedBooking, setExpandedBooking] = useState<number | null>(null)

  const { data: sessionData } = useSession()

  const session = sessionData as unknown as SessionData

  const handleGetMyBookings = async () => {
    setLoading(true)
    const userId = session?.user?.id
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/common/get-bookings/${userId}?role=user`
      )
      const data = response.data
      if (data.success) {
        setBookings(data.data)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const openCancelModal = (bookingId: number) => {
    setSelectedBookingId(bookingId)
    setCancelModalOpen(true)
  }

  const closeCancelModal = () => {
    setSelectedBookingId(null)
    setCancelReason("")
    setCancelModalOpen(false)
  }

  const handleCancelBooking = async () => {
    if (!selectedBookingId) return

    setCancelLoading(true)
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/common/cancel-customize-booking-user/${selectedBookingId}`,
        {
          message: cancelReason,
        }
      )
      const data = response.data
      if (data.success) {
        handleGetMyBookings()
        closeCancelModal()
      }
    } catch (error) {
      console.error("Error cancelling booking:", error)
    } finally {
      setCancelLoading(false)
    }
  }

  const toggleExpand = (bookingId: number) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Calculate days remaining until trip start
  const getDaysRemaining = (startDate: string) => {
    const today = new Date()
    const tripStart = new Date(startDate)
    const diffTime = tripStart.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get bookings based on active tab
  const getFilteredBookings = () => {
    if (activeTab === "upcoming") {
      return bookings.filter(
        (booking) =>
          ["pending", "accepted"].includes(booking.bookingStatus) &&
          (booking.travelStatus === "not-started" ||
            booking.travelStatus === "on-going")
      )
    } else {
      return bookings.filter(
        (booking) =>
          ["rejected", "cancelled"].includes(booking.bookingStatus) ||
          (booking.bookingStatus === "accepted" &&
            booking.travelStatus === "completed")
      )
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "accepted":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get travel status display info
  const getTravelStatusInfo = (booking: BookingType) => {
    if (booking.bookingStatus === "accepted") {
      if (booking.travelStatus === "not-started") {
        const daysRemaining = getDaysRemaining(booking.startDate)
        return {
          color: "text-blue-600",
          icon: <Calendar className="h-4 w-4 mr-1" />,
          text: `${daysRemaining} days until trip starts`,
        }
      } else if (booking.travelStatus === "on-going") {
        return {
          color: "text-green-600",
          icon: <Clock className="h-4 w-4 mr-1" />,
          text: "Trip in progress",
        }
      } else if (booking.travelStatus === "completed") {
        return {
          color: "text-gray-600",
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          text: "Trip completed",
        }
      }
    } else if (booking.bookingStatus === "rejected") {
      return {
        color: "text-red-600",
        icon: <XCircle className="h-4 w-4 mr-1" />,
        text: "Rejected by guide",
      }
    } else if (booking.bookingStatus === "cancelled") {
      return {
        color: "text-gray-600",
        icon: <Trash2 className="h-4 w-4 mr-1" />,
        text: "Cancelled by you",
      }
    }

    return {
      color: "text-yellow-600",
      icon: <AlertTriangle className="h-4 w-4 mr-1" />,
      text: "Awaiting confirmation",
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      handleGetMyBookings()
    }
  }, [session?.user?.id])

  const filteredBookings = getFilteredBookings()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Trip Requests</h1>
        <Tooltip content="Refresh" showArrow={true} placement="bottom">
          <button
            onClick={() => handleGetMyBookings()}
            className="px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary-darker transition-colors"
          >
            <RefreshCwIcon className="h-6 w-6" />
          </button>
        </Tooltip>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium flex items-center ${
            activeTab === "upcoming"
              ? "border-b-2 border-primary-dark text-primary-dark"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          <Calendar className="h-4 w-4 mr-1" />
          Upcoming
        </button>
        <button
          className={`px-4 py-2 font-medium flex items-center ${
            activeTab === "history"
              ? "border-b-2 border-primary-dark text-primary-dark"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("history")}
        >
          <History className="h-4 w-4 mr-1" />
          History
        </button>
      </div>

      {loading && (
        <div className="pt-16 pb-24 text-center">
          <Spinner
            size="lg"
            color="primary"
            className="flex justify-center items-center"
            label="Loading, please wait..."
          />
        </div>
      )}

      {filteredBookings.length === 0 && !loading && (
        <div className="pt-16 pb-24 text-center">
          <div className="flex justify-center mb-4">
            {activeTab === "upcoming" ? (
              <Calendar className="h-16 w-16 text-gray-400" />
            ) : (
              <History className="h-16 w-16 text-gray-400" />
            )}
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {activeTab === "upcoming" ? "No upcoming trips" : "No trip history"}
          </h2>
          <p className="text-gray-600 mb-6">
            {activeTab === "upcoming"
              ? "You don't have any pending or upcoming trips"
              : "You don't have any completed or cancelled trips yet"}
          </p>
        </div>
      )}

      {filteredBookings.length > 0 && !loading && (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((booking) => {
            const statusInfo = getTravelStatusInfo(booking)
            const isExpanded = expandedBooking === booking.id

            return (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="flex">
                  {/* Guide Profile Photo - Smaller */}
                  <div className="w-24 h-24 md:w-32 md:h-auto">
                    <div className="h-full relative">
                      <img
                        src={booking.Guide.profilePhoto}
                        alt={booking.Guide.fullname}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800 capitalize">
                          {booking.destination}{" "}
                          <span className="text-sm text-gry-600">
                            {" "}
                            (<TimeAgo timestamp={booking.createdAt} />)
                          </span>
                        </h2>
                        <p className="text-medium  text-gray-600 ">
                          Guide: {booking.Guide.fullname}{" "}
                          <Link
                            href={`/guides/${booking.Guide.slug}`}
                            className="text-blue-500 italic underline ml-2"
                          >
                            View Profile
                          </Link>
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span
                          className={`px-2 py-1 rounded-full text-md font-medium mb-1 ${getStatusColor(
                            booking.bookingStatus
                          )}`}
                        >
                          {booking.bookingStatus.charAt(0).toUpperCase() +
                            booking.bookingStatus.slice(1)}
                        </span>
                        <div
                          className={`flex items-center text-md ${statusInfo.color}`}
                        >
                          {statusInfo.icon}
                          <span>{statusInfo.text}</span>
                        </div>
                      </div>
                    </div>

                    {/* Compact Info */}
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(booking.startDate)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{booking.estimatedDays} days</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-3 w-3 mr-1" />
                        <span>
                          {booking.numberOfAdults +
                            (booking.numberOfChildren || 0)}{" "}
                          people
                        </span>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="flex items-center text-gray-700">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="font-medium">
                                Starting from:
                              </span>
                            </div>
                            <p className="ml-4 text-gray-600">
                              {booking.startingLocation}
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center text-gray-700">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              <span className="font-medium">Request Type:</span>
                            </div>
                            <p className="ml-4 text-gray-600 capitalize">
                              {booking.bookingType}
                            </p>
                          </div>

                          {booking.estimatedPrice && (
                            <div className="md:col-span-2">
                              <p className="font-medium text-gray-800">
                                Estimated Price:{" "}
                                <span className="font-bold text-blue-700">
                                  ${booking.estimatedPrice.toLocaleString()}
                                </span>
                              </p>
                            </div>
                          )}
                          {booking.cancelMessage && (
                            <div className="md:col-span-2 bg-red-50 p-3 rounded-md border border-red-200">
                              <p className="font-medium text-red-600">
                                {booking.bookingStatus === "cancelled"
                                  ? "Cancelled by you "
                                  : "Rejected by guide "}
                                :{" "}
                                <span className="font-bold text-red-700">
                                  {booking.cancelMessage}
                                </span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex gap-2">
                        <Link
                          href={`/messages/${booking.Guide.slug}`}
                          className="px-3 py-1 text-md bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Message
                        </Link>

                        {booking.bookingStatus === "pending" && (
                          <button
                            onClick={() => openCancelModal(booking.id)}
                            className="px-3 py-1 text-md border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors flex items-center"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Cancel
                          </button>
                        )}
                        {(booking.bookingStatus === "cancelled" ||
                          booking.bookingStatus === "rejected") && (
                          <button
                            onClick={() => alert("Delete button")}
                            className="px-3 py-1 text-md border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors flex items-center"
                          >
                            <TrashIcon className="h-3 w-3 mr-1" />
                            Remove
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => toggleExpand(booking.id)}
                        className="text-gray-500 hover:text-gray-700 flex items-center text-md"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            More
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Cancel Booking Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Cancel Booking Request</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this booking request? This action
              cannot be undone.
            </p>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Reason for cancellation (optional):
              </label>
              <textarea
                className="w-full border rounded-md p-2 h-24"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please let us know why you're cancelling..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeCancelModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                className={`px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center ${
                  cancelLoading && "cursor-not-allowed opacity-70"
                }`}
                disabled={cancelLoading}
              >
                {cancelLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Cancel Booking
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingHome
