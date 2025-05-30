"use client"
import React, { Children, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Image from "next/image"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import axios from "axios"
import TimeAgo from "../common/TimeAgo"
import citiesName from "../../utils/CitiesNames.json"

import { GuideDetailsType } from "@/utils/Types"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { SessionData } from "@/utils/Types"
import { Loader2Icon, StarIcon } from "lucide-react"

interface BookingProps {
  id: string
}

const Booking: React.FC<BookingProps> = ({ id }) => {
  const [selectedBookingType, setSelectedBookingType] = useState("customize")
  const [loading, setLoading] = useState(false)
  const [guideDetails, setGuideDetails] = useState<GuideDetailsType | null>(
    null
  )

  const router = useRouter()
  const searchParams = useSearchParams()

  const { data: sessionData } = useSession()
  const session = sessionData as unknown as SessionData
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    const adultParam = searchParams.get("adult")
    const childrenParam = searchParams.get("child")
    const dateParam = searchParams.get("date")

    if (adultParam) {
      setValue("numberOfAdults", parseInt(adultParam))
    }
    if (childrenParam) {
      setValue("numberOfChildren", parseInt(childrenParam))
    }
    if (dateParam) {
      setValue("startDate", dateParam)
    }
  }, [searchParams])

  const handleGetGuideDetails = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/single-guide-details/${id}?select=id,fullname,profilePhoto,guideType,guidingAreas,languageSpeak,lastActiveAt,slug,availability`
      )
      const data = response.data
      if (data.success) {
        setGuideDetails(data.data)
      }
    } catch (error) {
      console.error("Error fetching guide details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCustomizeBooking = async (formDetails: any) => {
    try {
      setLoading(true)

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/common/create-customize-booking`,
        {
          ...formDetails,
          guideId: guideDetails?.id,
          guideSlug: guideDetails?.slug,
          userId: session?.user?.id,
        }
      )

      const result = response.data

      if (result.success) {
        // Show success message
        toast.success("Booking request sent successfully")
        // Optionally redirect or clear form
        router.push("/my-bookings")
      } else {
        // Show error message from API if available
        toast.error(result.message || "Failed to send booking request")
      }
    } catch (error) {
      console.error("Error creating booking:", error)
      // Show appropriate error message
      toast.error("An error occurred while sending your booking request")
    } finally {
      // Reset loading state
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGetGuideDetails()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Guide Profile Card - Right Side on Desktop, Top on Mobile */}
      <div className="lg:order-last lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-5">
          <div className="flex gap-4  items-center">
            {/* Profile Image */}
            <div className="mb-3">
              <Image
                src={guideDetails?.profilePhoto || "/images/placeholder.jpg"}
                alt={guideDetails?.fullname || "Guide Profile"}
                width={60}
                height={60}
                className="rounded-full border-2 border-gray-200 object-cover"
              />
            </div>

            <div className="flex flex-col gap-2">
              {/* Name and Rating */}
              <h2 className="text-xl font-semibold text-gray-800">
                {guideDetails?.fullname}
              </h2>
              <div className="flex items-center mt-1 mb-4">
                <div className="flex text-yellow-400 text-sm">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const rating = guideDetails?.averageRating ?? 0 // if undefined, use 0
                    return (
                      <StarIcon
                        key={star}
                        className={`h-4 w-4 ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    )
                  })}
                </div>
                <span className="ml-1 text-xs text-gray-600">
                  {guideDetails?.averageRating}/5 ({guideDetails?.totalReviews})
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-3"></div>

          {/* Available Areas */}
          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Available Areas
            </h3>
            <div className="flex flex-wrap gap-1">
              {guideDetails?.guidingAreas?.map((area: string) => (
                <span
                  key={area}
                  className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Languages
            </h3>
            <div className="flex flex-wrap gap-1">
              {guideDetails?.languageSpeak?.map((language: string) => (
                <span
                  key={language}
                  className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>

          {/* Last Active */}
          <div className="text-xs text-gray-500 mt-2">
            {guideDetails?.lastActiveAt ? (
              <TimeAgo timestamp={guideDetails?.lastActiveAt} />
            ) : (
              "Last active not available"
            )}
          </div>
        </div>
      </div>

      {/* Booking Form - Left Side on Desktop */}
      <div className="lg:col-span-2">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/districts/${guideDetails?.guidingAreas[0].toLowerCase()}`}
              >
                {" "}
                {guideDetails?.guidingAreas[0] || "undefined"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {/* <BreadcrumbPage>{guideDetails.fullname}</BreadcrumbPage> */}
              <BreadcrumbLink href={`/guides/${guideDetails?.slug}`}>
                {" "}
                {guideDetails?.fullname || "undefined"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Booking</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* form  */}
        <div className=" ">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Create your Booking
          </h1>

          <form onSubmit={handleSubmit(handleCreateCustomizeBooking)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Travel Dates <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      {...register("startDate", { required: true })}
                    />

                    {errors.startDate && (
                      <span className="text-xs text-red-500">
                        Start date is required
                      </span>
                    )}
                  </div>
                  <div>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      {...register("endDate", { required: true })}
                    />
                    {errors.endDate && (
                      <span className="text-xs text-red-500">
                        End date is required
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Travelers <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Adults
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      {...register("numberOfAdults", { required: true })}
                    >
                      {[...Array(4)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Children
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      {...register("numberOfChildren")}
                    >
                      {[...Array(3)].map((_, i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  // {
                  //   type: "customize",
                  //   label: "Customize",
                  //   desc: "Tailor your own experience",
                  // },
                  {
                    type: "group",
                    label: "Group",
                    desc: "Join others on a shared tour",
                  },
                  {
                    type: "private",
                    label: "Private",
                    desc: "Exclusive guide service",
                  },
                ].map(({ type, label, desc }) => (
                  <div
                    key={type}
                    className={`
                      p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md
                      ${
                        selectedBookingType === type
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-gray-300 hover:border-blue-300"
                      }
                    `}
                    onClick={() => setSelectedBookingType(type)}
                  >
                    <input
                      type="radio"
                      value={type}
                      className="hidden"
                      {...register("bookingType", { required: true })}
                      checked={selectedBookingType === type}
                      onChange={() => setSelectedBookingType(type)}
                    />
                    <span className="block text-center font-medium">
                      {label}
                    </span>
                    <span className="block text-center text-xs text-gray-500 mt-1">
                      {desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Your estimated price in US dollor ($)?"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...register("estimatedPrice", { required: true })}
              />
              {errors.destination && (
                <span className="text-xs text-red-500">
                  Estimated Price is Required
                </span>
              )}
            </div>
            {/* contact  */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Your phone number (+977)"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...register("contact", { required: true })}
              />
              {errors.contact && (
                <span className="text-xs text-red-500">
                  Phone number is required
                </span>
              )}
            </div>
            {/* destination  */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination <span className="text-red-500">*</span>
              </label>
              {/* <select
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...register("destination", { required: true })}
              >
                <option value="">Select a destination</option>
                guideDetails?.guidingAreas
                {citiesName.map((city) => (
                  <option key={city.id} value={city.districtId}>
                    {city.name}
                  </option>
                ))}

              </select> */}
              <select
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...register("destination", { required: true })}
              >
                <option value="">Select a destination</option>
                {citiesName
                  .filter((city) =>
                    guideDetails?.guidingAreas?.includes(
                      city.name.toLowerCase()
                    )
                  )
                  .map((city) => (
                    <option key={city.id} value={city.districtId}>
                      {city.name}
                    </option>
                  ))}
              </select>
              {errors.destination && (
                <span className="text-xs text-red-500">
                  Destination is required
                </span>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Starting Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Where should your guide meet you?"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...register("startingLocation", { required: true })}
              />
              {errors.startingLocation && (
                <span className="text-xs text-red-500">
                  Starting location is required
                </span>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hotel / Accommodation
              </label>
              <input
                type="text"
                placeholder="Where are you staying? (Optional)"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...register("accommodation")}
              />
              <p className="text-xs text-gray-500 mt-1">
                Providing your accommodation details will help the guide plan
                the itinerary better
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message to Guide <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Tell the guide about your interests, preferences, and any specific places you'd like to visit..."
                className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...register("bookingMessage", { required: true })}
              ></textarea>
              {errors.bookingMessage && (
                <span className="text-xs text-red-500">
                  Please include a message for your guide
                </span>
              )}
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="liability"
                  className="mt-1"
                  {...register("platformLiability")}
                />
                <label
                  htmlFor="liability"
                  className="ml-2 text-sm text-gray-600"
                >
                  I understand that this booking is subject to the guide's
                  availability and confirmation. I have read and agree to the
                  terms and conditions of service.
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={
                  loading || guideDetails?.availability.isAvailable === false
                }
                className="px-6 py-3 bg-primary-dark text-white font-medium rounded-md hover:bg-primary-darker transition-colors shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <div className="flex gap-2">
                    <Loader2Icon className="w-5 h-5 animate-spin" />
                    <p>Submitting your details...</p>
                  </div>
                ) : (
                  <p>Submit your details</p>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Booking
