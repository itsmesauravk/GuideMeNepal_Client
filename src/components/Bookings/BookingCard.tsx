import React, { useState } from "react"
import Link from "next/link"

import {
  Calendar,
  Clock,
  Users,
  MapPin,
  MessageCircle,
  ChevronUp,
  ChevronDown,
  Trash2,
  CheckCircle,
  Loader2,
  Star,
  Info as InfoIcon,
  MessageSquare,
  X,
} from "lucide-react"
import TimeAgo from "../common/TimeAgo"
import { BookingType } from "@/utils/Types"
import { Button } from "../ui/button"
import ReviewModal from "./GuideReviewModel"
import { SessionData } from "@/utils/Types"
import { useSession } from "next-auth/react"

interface BookingCardProps {
  booking: BookingType
  handleUserCompleteBooking: (bookingId: number) => void
  openCancelModal: (bookingId: number) => void
  userCompletingBooking?: boolean
}

const BookingCard = ({
  booking,
  handleUserCompleteBooking,
  openCancelModal,
  userCompletingBooking = false,
}: BookingCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [reviewModelOpen, setReviewModelOpen] = useState(false)

  const { data: sessionData } = useSession()

  const session = sessionData as unknown as SessionData

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "accepted":
        return "bg-green-100 text-green-700"
      case "rejected":
        return "bg-red-100 text-red-700"
      case "cancelled":
        return "bg-gray-100 text-gray-700"
      case "completed":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusInfo = (booking: BookingType) => {
    const status = booking.bookingStatus
    const travelStatus = booking.travelStatus

    if (status === "pending") {
      return {
        icon: <Clock className="h-4 w-4 mr-1" />,
        text: "Awaiting guide response",
        color: "text-yellow-600",
      }
    } else if (status === "accepted") {
      if (travelStatus === "not-started") {
        return {
          icon: <Calendar className="h-4 w-4 mr-1" />,
          text: "Upcoming tour",
          color: "text-blue-600",
        }
      } else if (travelStatus === "on-going") {
        return {
          icon: <MapPin className="h-4 w-4 mr-1" />,
          text: "Tour in progress",
          color: "text-green-600",
        }
      } else if (travelStatus === "guide-completed") {
        return {
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          text: "Waiting for your confirmation",
          color: "text-indigo-600",
        }
      } else if (travelStatus === "completed") {
        return {
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          text: "Tour completed",
          color: "text-green-700",
        }
      }
    } else if (status === "rejected") {
      return {
        icon: <Trash2 className="h-4 w-4 mr-1" />,
        text: "Rejected by guide",
        color: "text-red-600",
      }
    } else if (status === "cancelled") {
      return {
        icon: <Trash2 className="h-4 w-4 mr-1" />,
        text: "Cancelled by you",
        color: "text-gray-600",
      }
    }

    return {
      icon: <InfoIcon className="h-4 w-4 mr-1" />,
      text: "Status unknown",
      color: "text-gray-600",
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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

  const statusInfo = getStatusInfo(booking)

  const handleOpenReviewModal = () => {
    setReviewModelOpen(!reviewModelOpen)
  }

  return (
    <div key={booking.id} className="mb-4">
      {/* Booking Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex">
          {/* Guide Profile Photo */}
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
                  <span className="text-sm text-gray-600">
                    {" "}
                    (<TimeAgo timestamp={booking.createdAt} />)
                  </span>
                </h2>
                <p className="text-medium text-gray-600">
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
                  {booking.numberOfAdults + (booking.numberOfChildren || 0)}{" "}
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
                      <span className="font-medium">Starting from:</span>
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

                {booking.bookingStatus === "accepted" &&
                  booking.travelStatus !== "completed" &&
                  (getDaysRemaining(booking.startDate) > 2 ? (
                    <button
                      onClick={() => openCancelModal(booking.id)}
                      className="px-3 py-1 text-md border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors flex items-center"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Cancel
                    </button>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Cancel not allowed within 2 days of trip
                    </p>
                  ))}

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
                    <Trash2 className="h-3 w-3 mr-1" />
                    Remove
                  </button>
                )}
              </div>

              <button
                onClick={toggleExpand}
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

      {/* Completion action section for user when guide has completed - appears below main booking card */}
      {booking.travelStatus === "guide-completed" &&
        booking.bookingStatus === "accepted" && (
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-800">
                    Tour Completed by Guide
                  </h4>
                  <p className="text-sm text-blue-600">
                    Your guide has marked this tour as completed on{" "}
                    {formatDate(booking.updatedAt)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleUserCompleteBooking(booking.id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors"
                disabled={userCompletingBooking}
              >
                {userCompletingBooking ? (
                  <div className="flex gap-2 items-center">
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Completion
                  </div>
                )}
              </button>
            </div>

            <div className="mt-3 text-sm text-blue-700 bg-blue-100 p-3 rounded-md">
              <div className="flex items-start">
                <InfoIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <p>
                  Please confirm the tour completion if you're satisfied with
                  the service. This will finalize the booking process and allow
                  you to leave feedback for your guide.
                </p>
              </div>
            </div>

            {/* Optional rating prompt */}
            <div className="mt-3 flex items-center text-sm text-gray-600">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>
                Don't forget to share your experience after completion!
              </span>
            </div>
          </div>
        )}

      {/* Display when user is viewing a completed booking where they've already confirmed */}
      {booking.travelStatus === "completed" && (
        <div className="mt-2 flex flex-col justify-between bg-green-50 border border-green-200 rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <h4 className="font-medium text-green-800">
                  Tour Successfully Completed
                </h4>
                <p className="text-sm text-green-600">
                  Completed on {formatDate(booking.updatedAt)}
                </p>
              </div>
            </div>

            <div className="mt-2 flex  justify-end">
              <Button
                onClick={handleOpenReviewModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-md font-medium flex items-center"
              >
                {reviewModelOpen ? (
                  <div className="flex gap-2 items-center">
                    <X className="h-3 w-3 mr-1" />
                    Close Review
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <Star className="h-3 w-3 mr-1" />
                    Give Review
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* review model  */}
          {reviewModelOpen && (
            <ReviewModal
              setReviewModelOpen={setReviewModelOpen}
              bookingDetails={booking}
              guideId={booking.Guide.id}
              userId={session?.user?.id}
              destination={booking.destination}
              onSuccessReview={() => {
                // handleUserCompleteBooking(booking.id)
                setReviewModelOpen(false)
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default BookingCard
