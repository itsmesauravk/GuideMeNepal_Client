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
  TimerIcon,
  ClockAlertIcon,
  Star,
  MessageSquare,
  InfoIcon,
  Loader2Icon,
} from "lucide-react"
import { Spinner, Tooltip } from "@heroui/react"

import Link from "next/link"
import { BookingType } from "@/utils/Types"
import TimeAgo from "../common/TimeAgo"
import { useSession } from "next-auth/react"
import { SessionData } from "@/utils/Types"
import BookingCard from "./BookingCard"
import { toast } from "sonner"
import { set } from "date-fns"

const BookingHome = () => {
  const [bookings, setBookings] = useState<BookingType[]>([])
  const [loading, setLoading] = useState(false)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  )
  const [cancelReason, setCancelReason] = useState("")
  const [cancelLoading, setCancelLoading] = useState(false)
  const [userCompletingBooking, setUserCompletingBooking] = useState(false)
  const [activeTab, setActiveTab] = useState("ongoing")
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
        // if booking include accepted and on-going || guide-completed, set active tab to ongoing
        if (
          data.data.some(
            (booking: BookingType) =>
              booking.bookingStatus === "accepted" &&
              (booking.travelStatus === "on-going" ||
                booking.travelStatus === "guide-completed")
          )
        ) {
          setActiveTab("ongoing")
        } else {
          setActiveTab("upcoming")
        }
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

  // Get bookings based on active tab
  const getFilteredBookings = () => {
    if (activeTab === "ongoing") {
      return bookings.filter(
        (booking) =>
          ["accepted"].includes(booking.bookingStatus) &&
          (booking.travelStatus === "on-going" ||
            (booking.travelStatus === "completed" &&
              booking.reviewstatus === false))
      )
    } else if (activeTab === "upcoming") {
      return bookings.filter(
        (booking) =>
          ["pending", "accepted"].includes(booking.bookingStatus) &&
          booking.travelStatus === "not-started"
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

      {/* Tabs for on-going,  upcoming and history*/}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium flex items-center ${
            activeTab === "ongoing"
              ? "border-b-2 border-green-700 text-green-700"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("ongoing")}
        >
          <Calendar className="h-4 w-4 mr-1" />
          On-going
        </button>
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
        <div className="pt-14 pb-14 text-center">
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
            return (
              <BookingCard
                key={booking.id}
                booking={booking}
                openCancelModal={openCancelModal}
              />
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
