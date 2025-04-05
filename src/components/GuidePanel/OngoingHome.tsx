"use client"
import React, { useEffect, useState } from "react"
import {
  Calendar,
  MapPin,
  Phone,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  MessageCircle,
  PlayCircle,
} from "lucide-react"
import Image from "next/image"
import axios from "axios"
import { useSession } from "next-auth/react"
import { SessionData } from "@/utils/Types"
import { BookingType } from "@/utils/Types"

const OngoingTourGuideView = () => {
  const [onGoingBooking, setOnGoingBooking] = useState<BookingType | null>(null)
  const [loading, setLoading] = useState(false)

  const { data: sessionData } = useSession()
  const session = sessionData as unknown as SessionData
  const guideId = session?.user?.id

  const handleGetOngoingTour = async (id: string) => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/common/get-ongoing-booking/${id}?role=guide`
      )
      const data = response.data
      if (data.success) {
        setOnGoingBooking(data.data)
        setLoading(false)
      } else {
        setLoading(false)
        console.log("Error fetching ongoing tours:", data.message)
      }
    } catch (error) {
      setLoading(false)
      console.log("Error fetching ongoing tours:", error)
    }
  }

  // Helper functions
  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const calculateProgress = () => {
    if (!onGoingBooking) return 0

    const start = new Date(onGoingBooking.startDate)
    const end = new Date(onGoingBooking.endDate)
    const today = new Date()

    const totalDuration = end.getTime() - start.getTime()
    const elapsed = today.getTime() - start.getTime()

    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
  }

  const calculateDaysRemaining = () => {
    if (!onGoingBooking) return 0

    const today = new Date()
    const end = new Date(onGoingBooking.endDate)
    const diffTime = Math.abs(end.getTime() - today.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  useEffect(() => {
    if (!guideId) return
    handleGetOngoingTour(guideId)
  }, [guideId])

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 flex items-center justify-center">
        <p>Loading tour details...</p>
      </div>
    )
  }

  if (!onGoingBooking) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 flex items-center justify-center">
        <p>No ongoing tour found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4">
      {/*  Header  */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        <div className="bg-blue-50 p-4 text-primary-dark">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">
                {onGoingBooking.destination}
              </h1>
              <p className="text-primary-darker text-sm">
                {formatDate(onGoingBooking.startDate)} -{" "}
                {formatDate(onGoingBooking.endDate)}
              </p>
            </div>
            <div className="bg-white text-primary-dark px-3 py-1 rounded-full text-sm font-medium">
              {onGoingBooking.travelStatus === "not-started"
                ? "Not Started"
                : "In Progress"}
            </div>
          </div>

          {/*  progress bar */}
          <div className="mt-4">
            <div className="w-full bg-indigo-200 rounded-full h-2.5">
              <div
                className="bg-primary-dark h-2.5 rounded-full"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Tourist Card */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-3 mb-2">
              <User className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium">Tourist</h3>
            </div>

            <div className="flex items-center">
              {onGoingBooking.User.profilePicture && (
                <Image
                  src={onGoingBooking.User.profilePicture}
                  alt={onGoingBooking.User.fullName}
                  className="h-10 w-10 rounded-full mr-3"
                  width={40}
                  height={40}
                />
              )}
              <div>
                <p className="font-medium">{onGoingBooking.User.fullName}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="h-3 w-3 mr-1" />
                  <span>{onGoingBooking.contact}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tour Status - Critical info only */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium">Tour Timeline</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-indigo-600 mr-2" />
                  <span className="text-gray-600">Days Remaining</span>
                </div>
                <span className="font-bold text-lg">
                  {calculateDaysRemaining()}
                </span>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-indigo-600 mr-2" />
                  <span className="text-gray-600">Current Location</span>
                </div>
                <span className="font-medium">
                  {onGoingBooking.startingLocation}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow p-4 mt-10">
            <div className="grid grid-cols-1 gap-3">
              {onGoingBooking.travelStatus === "not-started" ? (
                <button className="bg-primary-dark hover:bg-primary-darker text-white p-3 rounded-lg font-medium flex items-center justify-center">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Start Trip
                </button>
              ) : (
                <button className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-medium flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Complete Tour
                </button>
              )}
              <button className="border border-red-600 text-red-600 hover:bg-red-50 p-3 rounded-lg font-medium">
                Emergency Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Emergency Contact  */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-3 mb-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h3 className="font-medium">Emergency Contact</h3>
            </div>

            <div className="bg-red-50 p-3 rounded flex items-center justify-between">
              <Phone className="h-5 w-5 text-red-500" />
              <span className="font-bold text-red-700">
                +977 9800-EMERGENCY
              </span>
            </div>
          </div>

          {/* Group Info - If applicable */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-3 mb-3">
              <MessageCircle className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium">Tour Details</h3>
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <p className="text-gray-700 mb-2">Group Size:</p>
              <p className="font-medium">
                {onGoingBooking.numberOfAdults} Adult
                {onGoingBooking.numberOfAdults > 1 ? "s" : ""}
                {onGoingBooking.numberOfChildren > 0
                  ? `, ${onGoingBooking.numberOfChildren} Child${
                      onGoingBooking.numberOfChildren > 1 ? "ren" : ""
                    }`
                  : ""}
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded mt-3">
              <p className="text-gray-700 mb-2">Accommodation:</p>
              <p className="font-medium">{onGoingBooking.accommodation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* note  */}
      <div className="rounded-lg shadow p-2 mt-10">
        <div className="bg-yellow-50 p-3 rounded">
          <p className="text-gray-700 mb-2 font-semibold">
            Trip Completion & Cancellation Guidelines:
          </p>
          <ul className="text-gray-700 list-disc pl-5">
            <li>
              The <strong>guide</strong> must start the trip on the scheduled{" "}
              <strong>start date</strong>.
            </li>
            <li>
              The <strong>guide</strong> must mark the trip as{" "}
              <strong>completed</strong> once it is finished.
            </li>
            <li>
              After the guide marks the trip as completed, the{" "}
              <strong>traveler</strong> must also confirm completion.
            </li>
            <li>
              The trip is considered <strong>fully completed</strong> only after
              both the guide and traveler confirm it.
            </li>
            <li>
              Ensure you have all{" "}
              <strong>necessary documents and equipment</strong> before the
              trip.
            </li>
            <li>
              In case of <strong>cancellation after acceptance</strong>, you
              must request the <strong>admin</strong> for further processing.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default OngoingTourGuideView
