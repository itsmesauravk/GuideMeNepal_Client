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
  ArrowUpDownIcon,
  ArrowLeft,
  Star,
} from "lucide-react"
import { Button } from "../ui/button"
import TimeAgo from "../common/TimeAgo"
import { useRouter } from "next/navigation"

// Define types for booking data
import { Booking } from "@/utils/Types"
import Image from "next/image"

// Rating display component (missing in original code)
const RatingDisplay = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-sm">{rating}/5</span>
    </div>
  )
}

const GuideBookingsHistory = () => {
  const [loading, setLoading] = useState(false)
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sort, setSort] = useState("newest")
  const [travelStatusFilter, setTravelStatusFilter] = useState("all")

  const router = useRouter()

  const handleGetPastBookings = async () => {
    setLoading(true)
    const guideId = 3
    try {
      // Updated API call to get only relevant bookings for history
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/common/get-bookings/${guideId}?role=guide`
      )
      const data = response.data
      if (data.success) {
        // Filter bookings to only show:
        // 1. rejected or cancelled bookings
        // 2. accepted bookings that are completed
        const historyBookings = data.data.filter(
          (booking: Booking) =>
            booking.bookingStatus === "rejected" ||
            booking.bookingStatus === "cancelled" ||
            (booking.bookingStatus === "accepted" &&
              booking.travelStatus === "completed")
        )
        setBookingHistory(historyBookings)
      }
    } catch (error) {
      console.error("Error fetching past bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGetPastBookings()
  }, [])

  // Sort and filter bookings
  const sortedBookings = React.useMemo(() => {
    // First filter by search query
    let filtered = bookingHistory.filter((booking) => {
      const searchLower = searchQuery.toLowerCase()
      return (
        booking.destination.toLowerCase().includes(searchLower) ||
        booking.User.fullName.toLowerCase().includes(searchLower)
      )
    })

    // Then filter by travel status if not "all"
    if (travelStatusFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.travelStatus === travelStatusFilter
      )
    }

    // Then sort
    return filtered.sort((a, b) => {
      if (sort === "newest") {
        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
      } else if (sort === "oldest") {
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      } else if (sort === "highest-price") {
        return (b.estimatedPrice || 0) - (a.estimatedPrice || 0)
      } else if (sort === "lowest-price") {
        return (a.estimatedPrice || 0) - (b.estimatedPrice || 0)
      }
      return 0
    })
  }, [bookingHistory, searchQuery, sort, travelStatusFilter])

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy")
  }

  // Travel status badge component
  const TravelStatusBadge = ({ status }: { status: string }) => {
    let color = ""

    switch (status) {
      case "completed":
        color = "bg-green-100 text-green-800"
        break
      case "cancelled":
        color = "bg-red-100 text-red-800"
        break
      case "no-show":
        color = "bg-yellow-100 text-yellow-800"
        break
      default:
        color = "bg-gray-100 text-gray-800"
    }

    return (
      <span className={`${color} px-2 py-1 rounded-full text-xs font-medium`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  // Booking status badge component (added for booking status display)
  const BookingStatusBadge = ({ status }: { status: string }) => {
    let color = ""

    switch (status) {
      case "accepted":
        color = "bg-green-100 text-green-800"
        break
      case "rejected":
        color = "bg-red-100 text-red-800"
        break
      case "cancelled":
        color = "bg-orange-100 text-orange-800"
        break
      default:
        color = "bg-gray-100 text-gray-800"
    }

    return (
      <span className={`${color} px-2 py-1 rounded-full text-xs font-medium`}>
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

  // Navigate back to active bookings
  const navigateToActiveBookings = () => {
    router.push("/guide/bookings")
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen w-full">
      {!selectedBooking ? (
        // Past Bookings List View
        <div>
          <div className="flex justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Booking History
              </h1>
              <p className="text-gray-500">
                View your past, cancelled and rejected bookings
              </p>
            </div>
            <Button
              className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-darker transition-colors"
              onClick={navigateToActiveBookings}
            >
              <ArrowLeft className="w-5 h-5 mr-1 text-white" />
              Active Bookings
            </Button>
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
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest-price">Highest Price</option>
                <option value="lowest-price">Lowest Price</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 h-4 w-4" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={travelStatusFilter}
                onChange={(e) => setTravelStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No-show</option>
              </select>
            </div>

            {/* search */}
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
          ) : sortedBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <p className="text-gray-500">No bookings found in history</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {sortedBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleBookingClick(booking)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Image
                        src={booking.User.profilePicture}
                        alt={booking.User.fullName}
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-white mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {booking.User.fullName}
                        </p>
                        <TimeAgo timestamp={booking.createdAt} />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <BookingStatusBadge status={booking.bookingStatus} />
                      {booking.travelStatus && (
                        <TravelStatusBadge status={booking.travelStatus} />
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
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      <span>${booking.estimatedPrice || "N/A"}</span>
                    </div>
                  </div>
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
              <BookingStatusBadge status={selectedBooking.bookingStatus} />
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
          </div>
        </div>
      )}
    </div>
  )
}

export default GuideBookingsHistory
