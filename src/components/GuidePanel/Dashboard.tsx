import React, { useState } from "react"
import {
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Compass,
  DollarSign,
  Filter,
  Locate,
  MapPin,
  MessageSquare,
  PlusCircle,
  Search,
  Settings,
  Star,
  User,
  Users,
  X,
} from "lucide-react"

// Define TypeScript interfaces for our data structure
interface UserType {
  id: number
  slug: string
  fullName: string
  email: string
  profilePicture: string
}

interface BookingType {
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
  bookingStatus: "pending" | "confirmed" | "completed" | "cancelled"
  travelStatus: "not-started" | "in-progress" | "completed"
  platformLiability: boolean
  User: UserType
}

interface BookingsData {
  pending: BookingType[]
  confirmed: BookingType[]
  ongoing: BookingType[]
  completed: BookingType[]
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "pending" | "confirmed" | "ongoing" | "completed"
  >("pending")
  const [showBookingDetails, setShowBookingDetails] =
    useState<BookingType | null>(null)

  // Sample data for bookings based on the provided structure
  const bookings: BookingsData = {
    pending: [
      {
        id: 1,
        userId: 2,
        guideId: 3,
        destination: "Sindhupalchowk",
        startingLocation: "Kathmandu",
        accommodation: "option",
        numberOfAdults: 1,
        numberOfChildren: 0,
        estimatedDays: 21,
        estimatedPrice: null,
        startDate: "2025-03-28T00:00:00.000Z",
        endDate: "2025-04-05T00:00:00.000Z",
        bookingDate: "2025-03-12T11:21:42.636Z",
        bookingMessage:
          "Hi, I'm interested in exploring the remote villages and hiking trails in Sindhupalchowk. Are there any special permits needed?",
        bookingType: "customize",
        bookingStatus: "pending",
        travelStatus: "not-started",
        platformLiability: true,
        User: {
          id: 2,
          slug: "shinchan-nahara925",
          fullName: "Shinchan Nahara",
          email: "shinchannahara4ku@gmail.com",
          profilePicture:
            "https://lh3.googleusercontent.com/a/ACg8ocJ4oOl1ZQKjSGh4Vw6DB9EazJ-OGgvWYpu3IrWrMYpxFXtYaMI=s96-c",
        },
      },
      {
        id: 2,
        userId: 2,
        guideId: 3,
        destination: "Sindhupalchowk",
        startingLocation: "Pokhara",
        accommodation: "option",
        numberOfAdults: 1,
        numberOfChildren: 0,
        estimatedDays: 19,
        estimatedPrice: 1199,
        startDate: "2025-04-08T00:00:00.000Z",
        endDate: "2025-04-19T00:00:00.000Z",
        bookingDate: "2025-03-18T11:21:42.636Z",
        bookingMessage:
          "Looking forward to a cultural immersion trip. I'm particularly interested in local festivals and traditions.",
        bookingType: "customize",
        bookingStatus: "pending",
        travelStatus: "not-started",
        platformLiability: true,
        User: {
          id: 2,
          slug: "shinchan-nahara925",
          fullName: "Shinchan Nahara",
          email: "shinchannahara4ku@gmail.com",
          profilePicture:
            "https://lh3.googleusercontent.com/a/ACg8ocJ4oOl1ZQKjSGh4Vw6DB9EazJ-OGgvWYpu3IrWrMYpxFXtYaMI=s96-c",
        },
      },
    ],
    confirmed: [
      {
        id: 3,
        userId: 5,
        guideId: 3,
        destination: "Langtang Valley",
        startingLocation: "Kathmandu",
        accommodation: "teahouse",
        numberOfAdults: 2,
        numberOfChildren: 1,
        estimatedDays: 7,
        estimatedPrice: 850,
        startDate: "2025-03-25T00:00:00.000Z",
        endDate: "2025-04-01T00:00:00.000Z",
        bookingDate: "2025-03-01T09:15:22.636Z",
        bookingMessage:
          "We are a family looking for a moderate trek. Our child is 10 years old and has some hiking experience.",
        bookingType: "standard",
        bookingStatus: "confirmed",
        travelStatus: "not-started",
        platformLiability: true,
        User: {
          id: 5,
          slug: "emily-johnson",
          fullName: "Emily Johnson",
          email: "emilyjohnson@example.com",
          profilePicture: "/api/placeholder/96/96",
        },
      },
    ],
    ongoing: [
      {
        id: 4,
        userId: 8,
        guideId: 3,
        destination: "Annapurna Circuit",
        startingLocation: "Pokhara",
        accommodation: "camping",
        numberOfAdults: 4,
        numberOfChildren: 0,
        estimatedDays: 14,
        estimatedPrice: 1650,
        startDate: "2025-03-15T00:00:00.000Z",
        endDate: "2025-03-29T00:00:00.000Z",
        bookingDate: "2025-02-10T14:30:00.636Z",
        bookingMessage:
          "We are experienced trekkers looking for a challenging route with stunning views.",
        bookingType: "standard",
        bookingStatus: "confirmed",
        travelStatus: "in-progress",
        platformLiability: true,
        User: {
          id: 8,
          slug: "robert-chen",
          fullName: "Robert Chen",
          email: "robertchen@example.com",
          profilePicture: "/api/placeholder/96/96",
        },
      },
    ],
    completed: [
      {
        id: 5,
        userId: 12,
        guideId: 3,
        destination: "Everest Base Camp",
        startingLocation: "Lukla",
        accommodation: "teahouse",
        numberOfAdults: 1,
        numberOfChildren: 0,
        estimatedDays: 12,
        estimatedPrice: 1200,
        startDate: "2025-02-01T00:00:00.000Z",
        endDate: "2025-02-12T00:00:00.000Z",
        bookingDate: "2025-01-05T08:45:10.636Z",
        bookingMessage:
          "Solo traveler looking to fulfill a lifelong dream of seeing Everest.",
        bookingType: "standard",
        bookingStatus: "completed",
        travelStatus: "completed",
        platformLiability: true,
        User: {
          id: 12,
          slug: "james-wilson",
          fullName: "James Wilson",
          email: "jameswilson@example.com",
          profilePicture: "/api/placeholder/96/96",
        },
      },
    ],
  }

  // Format date function
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Calculate duration in days
  const calculateDuration = (startDate: string, endDate: string): number => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Status colors
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    "in-progress": "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    "not-started": "bg-gray-100 text-gray-800",
  }

  // Get count of all bookings
  const totalBookings = Object.values(bookings).reduce(
    (sum, arr) => sum + arr.length,
    0
  )

  // Get current bookings (pending + confirmed + ongoing)
  const currentBookings =
    bookings.pending.length +
    bookings.confirmed.length +
    bookings.ongoing.length

  return (
    <div className="flex h-screen w-full bg-gray-50 md:mt-32">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Total Bookings</p>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {totalBookings}
                  </h2>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Current Tours</p>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {currentBookings}
                  </h2>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Compass className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">New Requests</p>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {bookings.pending.length}
                  </h2>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <PlusCircle className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Completed Tours</p>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {bookings.completed.length}
                  </h2>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
          {/* ongoing tour  */}

          {/* Current Ongoing Tour */}
          {bookings.ongoing.length > 0 && (
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-5 border-b flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-800">
                  Currently Ongoing Tour
                </h2>
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors["in-progress"]}`}
                >
                  In Progress
                </span>
              </div>
              <div className="p-5">
                {bookings.ongoing.map((tour) => (
                  <div key={tour.id} className="flex flex-col md:flex-row">
                    <div className="flex-1 md:pr-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                          <Compass className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-xl font-medium text-gray-900">
                            {tour.destination}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Started from {tour.startingLocation}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Tour Duration</p>
                          <p className="font-medium">
                            {tour.estimatedDays} days
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Dates</p>
                          <p className="font-medium">
                            {formatDate(tour.startDate)} -{" "}
                            {formatDate(tour.endDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Days Remaining
                          </p>
                          <p className="font-medium">
                            {Math.max(
                              0,
                              calculateDuration(
                                new Date().toISOString(),
                                tour.endDate
                              )
                            )}{" "}
                            days
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                (calculateDuration(
                                  tour.startDate,
                                  new Date().toISOString()
                                ) /
                                  calculateDuration(
                                    tour.startDate,
                                    tour.endDate
                                  )) *
                                  100
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-gray-500">
                            Start: {formatDate(tour.startDate)}
                          </p>
                          <p className="text-xs text-gray-500">
                            End: {formatDate(tour.endDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-64 mt-4 md:mt-0 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                      <div className="flex items-center mb-4">
                        <img
                          className="h-10 w-10 rounded-full mr-3"
                          src={tour.User.profilePicture}
                          alt=""
                        />
                        <div>
                          <p className="font-medium">{tour.User.fullName}</p>
                          <p className="text-sm text-gray-500">Tourist</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Group Size</p>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-500" />
                          <p className="font-medium">
                            {tour.numberOfAdults} adult
                            {tour.numberOfAdults > 1 ? "s" : ""}
                            {tour.numberOfChildren > 0
                              ? `, ${tour.numberOfChildren} child${
                                  tour.numberOfChildren > 1 ? "ren" : ""
                                }`
                              : ""}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Accommodation</p>
                        <p className="font-medium">
                          {tour.accommodation.charAt(0).toUpperCase() +
                            tour.accommodation.slice(1)}
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </button>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Upcoming Tours Calendar Preview */}
          <div className="bg-white rounded-lg shadow mb-6 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">
                Upcoming Tours
              </h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Full Calendar
              </button>
            </div>
            <div className="flex overflow-x-auto py-2 space-x-4">
              {[...bookings.confirmed, ...bookings.pending]
                .sort(
                  (a, b) =>
                    new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime()
                )
                .slice(0, 3)
                .map((booking) => (
                  <div
                    key={booking.id}
                    className="min-w-64 bg-blue-50 p-4 rounded-lg border border-blue-100"
                  >
                    <div className="flex justify-between mb-2">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          statusColors[booking.bookingStatus]
                        }`}
                      >
                        {booking.bookingStatus.charAt(0).toUpperCase() +
                          booking.bookingStatus.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {booking.estimatedDays} days
                      </span>
                    </div>
                    <h3 className="font-medium">{booking.destination}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {formatDate(booking.startDate)} -{" "}
                        {formatDate(booking.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Users className="h-4 w-4 mr-1" />
                      <span>
                        {booking.numberOfAdults} adult
                        {booking.numberOfAdults > 1 ? "s" : ""}
                        {booking.numberOfChildren > 0
                          ? `, ${booking.numberOfChildren} child${
                              booking.numberOfChildren > 1 ? "ren" : ""
                            }`
                          : ""}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          {/* Booking Management Tabs */}
          <div className="bg-white rounded-lg shadow">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-lg font-medium text-gray-800">
                Booking Management
              </h2>
              <div className="flex items-center">
                <button className="flex items-center text-gray-500 hover:text-gray-700 mr-4">
                  <Filter className="h-4 w-4 mr-1" />
                  <span className="text-sm">Filter</span>
                </button>
              </div>
            </div>
            <div className="border-b">
              <nav className="flex -mb-px">
                <button
                  className={`text-sm py-4 px-6 border-b-2 font-medium ${
                    activeTab === "pending"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("pending")}
                >
                  Pending Requests ({bookings.pending.length})
                </button>
                <button
                  className={`text-sm py-4 px-6 border-b-2 font-medium ${
                    activeTab === "confirmed"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("confirmed")}
                >
                  Confirmed ({bookings.confirmed.length})
                </button>
                <button
                  className={`text-sm py-4 px-6 border-b-2 font-medium ${
                    activeTab === "ongoing"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("ongoing")}
                >
                  Ongoing ({bookings.ongoing.length})
                </button>
                <button
                  className={`text-sm py-4 px-6 border-b-2 font-medium ${
                    activeTab === "completed"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("completed")}
                >
                  Completed ({bookings.completed.length})
                </button>
              </nav>
            </div>

            {/* Booking List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tourist
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Group Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings[activeTab].map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={booking.User.profilePicture}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.User.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.User.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.destination}
                        </div>
                        <div className="text-sm text-gray-500">
                          From: {booking.startingLocation}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.startDate)}
                        </div>
                        <div className="text-sm text-gray-500">
                          to {formatDate(booking.endDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.numberOfAdults} adult
                        {booking.numberOfAdults > 1 ? "s" : ""}
                        {booking.numberOfChildren > 0
                          ? `, ${booking.numberOfChildren} child${
                              booking.numberOfChildren > 1 ? "ren" : ""
                            }`
                          : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {booking.bookingType.charAt(0).toUpperCase() +
                            booking.bookingType.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            statusColors[booking.bookingStatus]
                          }`}
                        >
                          {booking.bookingStatus.charAt(0).toUpperCase() +
                            booking.bookingStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={() => setShowBookingDetails(booking)}
                        >
                          View
                        </button>

                        {activeTab === "pending" && (
                          <>
                            <button className="text-green-600 hover:text-green-900 mr-3">
                              Accept
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Decline
                            </button>
                          </>
                        )}
                        {activeTab === "confirmed" && (
                          <>
                            <button className="text-purple-600 hover:text-purple-900 mr-3">
                              Start Tour
                            </button>
                            <button className="text-yellow-600 hover:text-yellow-900">
                              Reschedule
                            </button>
                          </>
                        )}
                        {activeTab === "ongoing" && (
                          <button className="text-green-600 hover:text-green-900">
                            Complete Tour
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Booking Details Modal */}
      {showBookingDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Booking Details
              </h2>
              <button
                onClick={() => setShowBookingDetails(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Tourist Information
                  </h3>
                  <div className="flex items-center mb-4">
                    <img
                      className="h-12 w-12 rounded-full mr-4"
                      src={showBookingDetails.User.profilePicture}
                      alt=""
                    />
                    <div>
                      <div className="font-medium">
                        {showBookingDetails.User.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {showBookingDetails.User.email}
                      </div>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Send Message
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Booking Status
                  </h3>
                  <div className="flex items-center mb-2">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColors[showBookingDetails.bookingStatus]
                      } mr-2`}
                    >
                      {showBookingDetails.bookingStatus
                        .charAt(0)
                        .toUpperCase() +
                        showBookingDetails.bookingStatus.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Booking #{showBookingDetails.id}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    Made on {formatDate(showBookingDetails.bookingDate)}
                  </div>

                  {showBookingDetails.bookingStatus === "pending" && (
                    <div className="flex space-x-2 mt-2">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
                        Accept Booking
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm">
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-b my-6 py-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Tour Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Destination</p>
                    <p className="font-medium">
                      {showBookingDetails.destination}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Starting Location</p>
                    <p className="font-medium">
                      {showBookingDetails.startingLocation}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tour Type</p>
                    <p className="font-medium">
                      {showBookingDetails.bookingType.charAt(0).toUpperCase() +
                        showBookingDetails.bookingType.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Group Size</p>
                    <p className="font-medium">
                      {showBookingDetails.numberOfAdults} adult
                      {showBookingDetails.numberOfAdults > 1 ? "s" : ""}
                      {showBookingDetails.numberOfChildren > 0
                        ? `, ${showBookingDetails.numberOfChildren} child${
                            showBookingDetails.numberOfChildren > 1 ? "ren" : ""
                          }`
                        : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">
                      {showBookingDetails.estimatedDays} days
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Accommodation</p>
                    <p className="font-medium">
                      {showBookingDetails.accommodation
                        .charAt(0)
                        .toUpperCase() +
                        showBookingDetails.accommodation.slice(1)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Tour Schedule
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium">Tour Dates</span>
                    </div>
                    <p className="text-sm">
                      From{" "}
                      <span className="font-medium">
                        {formatDate(showBookingDetails.startDate)}
                      </span>
                    </p>
                    <p className="text-sm">
                      To{" "}
                      <span className="font-medium">
                        {formatDate(showBookingDetails.endDate)}
                      </span>
                    </p>
                    <p className="text-sm mt-2">
                      Total:{" "}
                      <span className="font-medium">
                        {calculateDuration(
                          showBookingDetails.startDate,
                          showBookingDetails.endDate
                        )}{" "}
                        days
                      </span>
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="flex items-center mb-2">
                      <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium">Pricing Information</span>
                    </div>
                    <p className="text-sm">
                      Estimated Price:{" "}
                      <span className="font-medium">
                        {showBookingDetails.estimatedPrice
                          ? `$${showBookingDetails.estimatedPrice}`
                          : "To be determined"}
                      </span>
                    </p>
                    <p className="text-sm mt-2">
                      Payment Status:{" "}
                      <span className="font-medium text-yellow-600">
                        Pending
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Additional Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium mb-2">
                    Message from Tourist:
                  </p>
                  <p className="text-sm text-gray-700">
                    {showBookingDetails.bookingMessage}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowBookingDetails(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm mr-2"
                >
                  Close
                </button>
                {showBookingDetails.bookingStatus === "pending" && (
                  <>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm mr-2">
                      Decline
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
                      Accept Booking
                    </button>
                  </>
                )}
                {showBookingDetails.bookingStatus === "confirmed" && (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                    Start Tour
                  </button>
                )}
                {/* {showBookingDetails.bookingStatus === 'in-progress' && (
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm">
                    Complete Tour
                  </button>
                )} */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
