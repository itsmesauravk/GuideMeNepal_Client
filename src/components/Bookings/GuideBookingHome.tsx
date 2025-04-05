"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { format } from "date-fns"
import {
  CalendarDays,
  MapPin,
  UserRound,
  Clock,
  DollarSign,
  MessageSquare,
  ChevronRight,
  Search,
  Filter,
  X,
  Check,
  AlertCircle,
  HistoryIcon,
  ArrowUpDownIcon,
  Trash2,
  Loader2Icon,
  InfoIcon,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import TimeAgo from "../common/TimeAgo"
import Link from "next/link"

// Define types for booking data
import { Booking } from "@/utils/Types"
import { useSession } from "next-auth/react"
import { SessionData } from "@/utils/Types"
import Image from "next/image"
import { useRouter } from "next/navigation"

const GuideBookingHome = () => {
  const [loading, setLoading] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sort, setSort] = useState("all")

  const [cancelReason, setCancelReason] = useState("")
  const [cancelLoading, setCancelLoading] = useState(false)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  )
  const [errorMessage, setErrorMessage] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [acceptLoading, setAcceptLoading] = useState(false)

  const router = useRouter()

  const { data: sessionData } = useSession()
  const session = sessionData as unknown as SessionData

  const guideId = session?.user?.id

  const handleGetMyBookings = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/common/get-bookings/${guideId}?role=guide`
      )
      const data = response.data
      if (data.success) {
        const availableBookings = data.data.filter(
          (booking: Booking) =>
            booking.bookingStatus === "pending" ||
            booking.bookingStatus === "accepted"
        )
        setBookings(availableBookings)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (guideId) {
      handleGetMyBookings()
    }
  }, [guideId])

  // Filter bookings based on search query and status filter
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.User.fullName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || booking.bookingStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy")
  }

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let color = ""
    let icon = null

    switch (status) {
      case "pending":
        color = "bg-yellow-100 text-yellow-800"
        icon = <Clock className="w-4 h-4 mr-1" />
        break
      case "accepted":
        color = "bg-green-100 text-green-800"
        icon = <Check className="w-4 h-4 mr-1" />
        break
      case "rejected":
        color = "bg-red-100 text-red-800"
        icon = <X className="w-4 h-4 mr-1" />
        break
      case "cancelled":
        color = "bg-red-100 text-red-800"
        icon = <X className="w-4 h-4 mr-1" />
        break
      case "completed":
        color = "bg-blue-100 text-blue-800"
        icon = <Check className="w-4 h-4 mr-1" />
        break
      case "not-started":
        color = "bg-gray-100 text-gray-800"
        icon = <AlertCircle className="w-6 h-6 mr-1" />
        break
      case "ongoing":
        color = "bg-blue-100 text-blue-800"
        icon = <Check className="w-4 h-4 mr-1" />
        break
      default:
        color = "bg-gray-100 text-gray-800 text-2xl"
        icon = <AlertCircle className="w-6 h-6 mr-1" />
    }

    return (
      <span
        className={`${color} px-2 py-1 rounded-full text-xs font-medium flex items-center`}
      >
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  // Calculate the duration between dates
  const getDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Handle booking item click
  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking)
  }

  // Handle back to list
  const handleBackToList = () => {
    setSelectedBooking(null)
  }

  //handle accept booking
  const handleAcceptBooking = async () => {
    try {
      if (!selectedBookingId) {
        toast.error("Please select a booking to accept.")
        return
      }
      setShowConfirmation(false)
      setAcceptLoading(true)
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/common/accept-customize-booking-guide/${selectedBookingId}`
      )
      const data = response.data
      if (data.success) {
        toast.success(data.message || "Booking accepted successfully")
        setAcceptLoading(false)
        setSelectedBookingId(null)
        setShowConfirmation(false)
        handleGetMyBookings()
        router.push("/guide/ongoing")
      } else {
        toast.error(data.message || "Failed to accept booking")
      }
    } catch (error) {
      console.error("Error accepting booking:", error)
    } finally {
      setAcceptLoading(false)
      setSelectedBookingId(null)
      setShowConfirmation(false)
    }
  }

  const openCancelModal = (bookingId: number) => {
    setSelectedBookingId(bookingId)
    setCancelModalOpen(true)
  }

  const openAcceptModel = (bookingId: number) => {
    setSelectedBookingId(bookingId)
    setShowConfirmation(true)
  }

  //function for hiding the booking accept model
  const handleCancel = () => {
    // Close the confirmation dialog
    setShowConfirmation(false)
    setSelectedBookingId(null)
  }

  const closeCancelModal = () => {
    setSelectedBookingId(null)
    setCancelReason("")
    setErrorMessage("")
    setCancelModalOpen(false)
  }

  const handleCancelBooking = async () => {
    if (!selectedBookingId) {
      setErrorMessage("Please select a booking to cancel.")
      return
    }
    if (!cancelReason) {
      setErrorMessage("Please provide a reason for cancellation.")
      return
    }
    setErrorMessage("")
    try {
      setCancelLoading(true)
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/common/reject-customize-booking-guide/${selectedBookingId}`,
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

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen w-full">
      {!selectedBooking ? (
        // Booking List View
        <div>
          <div className="flex justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Booking Requests
              </h1>
              <p className="text-gray-500">
                Manage your upcoming travel bookings
              </p>
            </div>
            <Link href="/guide/bookings/history">
              <Button className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-darker transition-colors">
                <HistoryIcon className="w-5 h-5  text-white" />
                History
              </Button>
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <ArrowUpDownIcon className="text-gray-400 h-4 w-4" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="all">Sort By (default)</option>
                <option value="createdAt">Latest</option>
                <option value="-createdAt">Oldest</option>
                <option value="price">Price (asc)</option>
                <option value="-price">Price (desc)</option>
              </select>
            </div>
            {/* price  */}
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 h-4 w-4" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* search  */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by destination or traveler name..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <p className="text-gray-500">No booking requests found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow duration-200 "
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Image
                        src={booking.User.profilePicture}
                        alt={booking.User.fullName}
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-white"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {booking.User.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(booking.bookingDate)} • (
                          <TimeAgo timestamp={booking.bookingDate} />)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={booking.bookingStatus} />
                      {booking.bookingStatus === "accepted" && (
                        <StatusBadge status={booking.travelStatus} />
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {booking.destination}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarDays className="w-4 h-4 mr-2 text-gray-400" />
                      <span>
                        {formatDate(booking.startDate)} -{" "}
                        {formatDate(booking.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>
                        {getDuration(booking.startDate, booking.endDate)} days
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <UserRound className="w-4 h-4 mr-2 text-gray-400" />
                      <span>
                        {booking.numberOfAdults} adults
                        {booking.numberOfChildren > 0
                          ? `, ${booking.numberOfChildren} children`
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>From: {booking.startingLocation}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    {booking.estimatedPrice && (
                      <div>
                        <p className="text-xs text-gray-500">
                          Estimated Price (USD)
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          ${booking.estimatedPrice}
                        </p>
                      </div>
                    )}
                    <div
                      className="flex items-center text-blue-500 font-medium hover:underline cursor-pointer"
                      onClick={() => handleBookingClick(booking)}
                    >
                      <span className="mr-1">View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                  {booking.bookingStatus === "accepted" &&
                    (booking.travelStatus === "not-started" ||
                      booking.travelStatus === "ongoing") && (
                      <div className="mt-3 pt-2 border-t border-gray-100">
                        <div className="flex items-start p-2 bg-yellow-50 rounded-md">
                          <InfoIcon className="w-4 h-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-yellow-700 font-medium">
                              Note: You can view full details about this trip on
                              the Ongoing section
                            </p>
                            <div className="mt-1">
                              <Link href="/guide/ongoing">
                                <Button className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors">
                                  View Trip Details
                                  <ChevronRight className="w-3 h-3 ml-1" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Booking Detail View
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header with back button */}
          <div className="border-b p-4">
            <button
              onClick={handleBackToList}
              className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
            >
              <ChevronRight className="w-5 h-5 transform rotate-180 mr-1" />
              Back to Requests
            </button>
          </div>

          <div className="p-6">
            {/* Booking header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {selectedBooking.destination}
                </h1>
                <p className="text-gray-500">
                  Request Id : #{selectedBooking.id} <br />
                  {formatDate(selectedBooking.bookingDate)} • (
                  <TimeAgo timestamp={selectedBooking.bookingDate} />)
                </p>
              </div>
              <StatusBadge status={selectedBooking.bookingStatus} />
            </div>

            {/* Customer info */}
            <div className="p-4 bg-gray-50 rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-3">
                Traveler Information
              </h2>
              <div className="flex items-center">
                <Image
                  src={selectedBooking.User.profilePicture}
                  alt={selectedBooking.User.fullName}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white"
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-800">
                    {selectedBooking.User.fullName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedBooking.User.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Trip details */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Trip Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Travel Dates</p>
                  <div className="flex items-center">
                    <CalendarDays className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-medium">
                      {formatDate(selectedBooking.startDate)} -{" "}
                      {formatDate(selectedBooking.endDate)}
                    </span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    {getDuration(
                      selectedBooking.startDate,
                      selectedBooking.endDate
                    )}{" "}
                    days total
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Group Size</p>
                  <div className="flex items-center">
                    <UserRound className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-medium">
                      {selectedBooking.numberOfAdults} adults
                      {selectedBooking.numberOfChildren > 0
                        ? `, ${selectedBooking.numberOfChildren} children`
                        : ""}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">
                    Starting Location
                  </p>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-medium">
                      {selectedBooking.startingLocation}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Accommodation</p>
                  <div className="flex items-center">
                    <span className="font-medium capitalize">
                      {selectedBooking.accommodation}
                    </span>
                  </div>
                </div>

                {selectedBooking.estimatedPrice && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">
                      Estimated Price (in US doller)
                    </p>
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
                      <span className="font-medium">
                        {selectedBooking.estimatedPrice}
                      </span>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Booking Type</p>
                  <div className="flex items-center">
                    <span className="font-medium capitalize">
                      {selectedBooking.bookingType}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">
                Message from Traveler
              </h2>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-500 mt-1" />
                  <p className="text-gray-700">
                    {selectedBooking.bookingMessage || "No message provided."}
                  </p>
                </div>
              </div>
            </div>
            {/* cancelled or rejected message */}
            {selectedBooking.cancelMessage && (
              <div className="mb-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <h2 className="text-lg font-semibold mb-3">
                    Cancellation message from{" "}
                    {selectedBooking.bookingStatus === "rejected"
                      ? "You"
                      : "Traveler"}
                  </h2>
                  <div className="flex items-start">
                    <MessageSquare className="w-5 h-5 mr-2 text-red-500 mt-1" />
                    <p className="text-gray-700">
                      {selectedBooking.cancelMessage || "No message provided."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            {selectedBooking.bookingStatus === "pending" && (
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  onClick={() => openCancelModal(selectedBooking.id)}
                  className="px-4 py-2 border border-red-700 bg-gray-50  text-red-700 rounded-lg hover:bg-red-700 hover:text-white transition-colors"
                >
                  Reject Request
                </Button>
                <Button
                  onClick={() => openAcceptModel(selectedBooking.id)}
                  className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-darker transition-colors"
                >
                  Accept Request
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              Confirm Booking Acceptance
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to accept the booking request for{" "}
              <strong>{selectedBooking?.User.fullName}</strong>?
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-2 mb-4">
              <p className="font-medium text-yellow-800">
                Important: After accepting this booking:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm text-yellow-700 space-y-1">
                <li>
                  Your availability status will be updated to "Not Available"
                  until the trip completed
                </li>
                <li>
                  All other pending booking requests will be automatically
                  rejected
                </li>
                <li>
                  You will not receive other requests before this trip completed
                </li>
                <li>
                  You will be committed to this booking for the specified dates
                </li>
                <li>The traveler will be notified of your acceptance</li>
                <li>You cannot undo this action without contacting support</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptBooking}
                disabled={acceptLoading}
                className={`px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary-darker transition-colors flex items-center ${
                  acceptLoading && "cursor-not-allowed opacity-70"
                } `}
              >
                {acceptLoading ? (
                  <>
                    <Loader2Icon className="animate-spin h-4 w-4 mr-2" />
                    Accepting...
                  </>
                ) : (
                  <>Accept Booking</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Booking Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Reject Booking Request</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject this booking request? This action
              cannot be undone.
            </p>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Reason for cancellation (required):
              </label>
              {errorMessage && (
                <p className="text-red-500 text-sm mb-2 italic">
                  {errorMessage}
                </p>
              )}
              <textarea
                className="w-full border rounded-md p-2 h-24"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please let us know why you're rejecting..."
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
                    Rejecting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Reject Booking
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

export default GuideBookingHome
