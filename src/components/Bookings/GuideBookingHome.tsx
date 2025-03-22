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
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import TimeAgo from "../common/TimeAgo"

// Define types for booking data
interface User {
  id: number
  slug: string
  fullName: string
  email: string
  profilePicture: string
}

interface Booking {
  id: number
  userId: number
  guideId: number
  destination: string
  startingLocation: string
  accommodation: string
  numberOfAdults: number
  numberOfChildren: number
  estimatedDays: number
  estimatedPrice: number | null
  startDate: string
  endDate: string
  bookingDate: string
  bookingMessage: string
  bookingType: string
  bookingStatus: string
  travelStatus: string
  platformLiability: boolean
  createdAt: string
  updatedAt: string
  User: User
}

const GuideBookingHome = () => {
  const [loading, setLoading] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleGetMyBookings = async () => {
    setLoading(true)
    const guideId = 3
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/common/get-bookings/${guideId}?role=guide`
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

  useEffect(() => {
    handleGetMyBookings()
  }, [])

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
        icon = <Clock className="w-3 h-3 mr-1" />
        break
      case "accepted":
        color = "bg-green-100 text-green-800"
        icon = <Check className="w-3 h-3 mr-1" />
        break
      case "rejected":
        color = "bg-red-100 text-red-800"
        icon = <X className="w-3 h-3 mr-1" />
        break
      default:
        color = "bg-gray-100 text-gray-800"
        icon = <AlertCircle className="w-3 h-3 mr-1" />
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
  const handleAcceptBooking = async (id: number) => {
    try {
      toast.success(`Booking accepted successfully : ${id}`)
    } catch (error) {
      console.error("Error accepting booking:", error)
    }
  }

  //handle reject booking
  const handleRejectBooking = async (id: number) => {
    try {
      toast.error(`Booking rejected successfully : ${id}`)
    } catch (error) {
      console.error("Error rejecting booking:", error)
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
            <Button className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-darker transition-colors">
              <HistoryIcon className="w-5 h-5  text-white" />
              History
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
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

            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 h-4 w-4" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
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
                  className="bg-white rounded-lg shadow-sm hover:shadow transition-shadow duration-200 overflow-hidden cursor-pointer"
                  onClick={() => handleBookingClick(booking)}
                >
                  <div className="p-4 flex flex-col md:flex-row gap-4">
                    {/* Left: User info */}
                    <div className="flex-shrink-0 flex flex-row md:flex-col items-center md:items-start">
                      <img
                        src={booking.User.profilePicture}
                        alt={booking.User.fullName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                      />
                      <div className="ml-3 md:ml-0 md:mt-2">
                        <p className="font-medium text-gray-800">
                          {booking.User.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(booking.bookingDate)}
                        </p>
                      </div>
                    </div>

                    {/* Middle: Booking details */}
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.destination}
                        </h3>
                        <StatusBadge status={booking.bookingStatus} />
                      </div>

                      <div className="mt-2 grid md:grid-cols-2 gap-y-2 gap-x-4">
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
                            {getDuration(booking.startDate, booking.endDate)}{" "}
                            days
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
                    </div>

                    {/* Right: Price and action */}
                    <div className="flex flex-row md:flex-col justify-between items-end">
                      {booking.estimatedPrice && (
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            Estimated (in US doller)
                          </p>
                          <p className="text-lg font-bold text-blue-600">
                            {booking.estimatedPrice}
                          </p>
                        </div>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
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
              <StatusBadge status={selectedBooking.bookingStatus} />
            </div>

            {/* Customer info */}
            <div className="p-4 bg-gray-50 rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-3">
                Traveler Information
              </h2>
              <div className="flex items-center">
                <img
                  src={selectedBooking.User.profilePicture}
                  alt={selectedBooking.User.fullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white"
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

            {/* Action buttons */}
            {selectedBooking.bookingStatus === "pending" && (
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  onClick={() => handleRejectBooking(selectedBooking.id)}
                  className="px-4 py-2 border border-red-700 bg-gray-50  text-red-700 rounded-lg hover:bg-red-700 hover:text-white transition-colors"
                >
                  Reject Request
                </Button>
                <Button
                  onClick={() => handleAcceptBooking(selectedBooking.id)}
                  className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-darker transition-colors"
                >
                  Accept Request
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default GuideBookingHome
