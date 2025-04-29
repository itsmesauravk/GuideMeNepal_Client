"use client"
import React, { useState } from "react"
import {
  Star,
  MapPin,
  MessageSquare,
  Clock,
  AlertCircleIcon,
  Calendar1Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  Users2Icon,
  Minus,
  Plus,
  BellIcon,
} from "lucide-react"

import TimeAgo from "../common/TimeAgo"
import { Button } from "../ui/button"

//heroui
import { Calendar } from "@heroui/react"
import {
  today,
  getLocalTimeZone,
  isWeekend,
  parseDate,
  CalendarDate,
  toCalendarDate,
  DateValue,
  getDayOfWeek,
  endOfMonth,
  ZonedDateTime,
  CalendarDateTime,
  startOfMonth,
} from "@internationalized/date"
import { useLocale } from "@react-aria/i18n"

import Link from "next/link"

import { GuideDetailsType } from "@/utils/Types"
import { addDays, eachDayOfInterval } from "date-fns"

const GuideProfileSidebar: React.FC<GuideDetailsType> = (props) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isGroupSizeOpen, setIsGroupSizeOpen] = useState(false)
  const [startingDate, setStartingDate] = useState<CalendarDate | null>(null)
  const [adultCount, setAdultCount] = useState(1)
  const [childCount, setChildCount] = useState(0)

  let now = today(getLocalTimeZone())
  let { locale } = useLocale()

  // Convert your availability dates to the proper format
  const unavailableDateRanges =
    props.availability_date?.map((range) => [
      parseDate(range.startDate.split("T")[0]),
      parseDate(range.endDate.split("T")[0]),
    ]) || []

  // Modified isDateUnavailable function for Nepal (Saturday only weekend)
  // and to disable past dates including today
  let isDateUnavailable = (date: DateValue) => {
    // Get day of week (0-6, where 0 is Sunday, 6 is Saturday)
    const dayOfWeek = getDayOfWeek(date, locale)

    return (
      // In Nepal, only Saturday is considered a weekend
      // dayOfWeek === 6 || // 6 represents Saturday
      // Disable past dates and today
      date.compare(now) <= 0 ||
      // Check if date falls within unavailable ranges
      unavailableDateRanges.some(
        (interval) =>
          date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0
      )
    )
  }

  function getTotalAvailableDaysInCurrentMonth() {
    // Get the current month's first and last day
    const firstDayOfMonth = startOfMonth(now)
    const lastDayOfMonth = endOfMonth(now)

    // Initialize counter for available days
    let availableDays = 0

    // Loop through all days in the current month
    let currentDate = firstDayOfMonth
    while (currentDate.compare(lastDayOfMonth) <= 0) {
      // If the date is available (not unavailable), increment counter
      if (!isDateUnavailable(currentDate)) {
        availableDays++
      }
      // Move to next day
      currentDate = currentDate.add({ days: 1 })
    }

    return availableDays
  }

  const incrementAdults = () => {
    if (adultCount < 3) setAdultCount(adultCount + 1)
  }

  const decrementAdults = () => {
    if (adultCount > 1) setAdultCount(adultCount - 1)
  }

  const incrementChildren = () => {
    if (childCount < 3) setChildCount(childCount + 1)
  }

  const decrementChildren = () => {
    if (childCount > 0) setChildCount(childCount - 1)
  }

  return (
    <div className="md:col-span-1">
      <div className="sticky top-6 space-y-6">
        {/* Profile card */}
        <div className="border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full overflow-hidden">
              {props.profilePhoto && (
                <img
                  src={props.profilePhoto}
                  alt={props.fullname}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div>
              <h2 className="font-bold">{props.fullname}</h2>
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= props.averageRating || 0
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-1 text-sm">{props.averageRating} / 5</span>
                <span className="ml-1 text-sm text-blue-600">
                  ({props.totalReviews} reviews)
                </span>
              </div>
            </div>
          </div>
          {/* Date selection */}
          <div className="mb-4">
            <div
              className="border rounded p-3 flex items-center justify-between cursor-pointer"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              <div className="flex items-center">
                <Calendar1Icon className="h-5 w-5 mr-2" />
                <span>
                  {startingDate ? startingDate.toString() : "Select a date"}
                </span>
              </div>
              {isCalendarOpen ? (
                <ChevronLeftIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </div>
            {isCalendarOpen && (
              <div className="flex gap-x-4 mt-2 justify-center">
                <Calendar
                  aria-label="Date (Unavailable)"
                  calendarWidth={280}
                  isDateUnavailable={isDateUnavailable}
                  aria-multiselectable={true}
                  onChange={(date) => setStartingDate(date)}
                  value={startingDate}
                />
              </div>
            )}
          </div>
          {/* Group size selection */}
          <div className="mb-4">
            <div
              className="border rounded p-3 flex items-center justify-between cursor-pointer"
              onClick={() => setIsGroupSizeOpen(!isGroupSizeOpen)}
            >
              <div className="flex items-center">
                <Users2Icon className="h-5 w-5 mr-2" />

                <span>
                  {`${adultCount} Adult${adultCount > 1 ? "s" : ""}${
                    childCount > 0
                      ? `, ${childCount} ${
                          childCount > 1 ? "Children" : "Child"
                        }`
                      : ""
                  }`}
                </span>
              </div>
              {isGroupSizeOpen ? (
                <ChevronLeftIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </div>
            {isGroupSizeOpen && (
              <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="space-y-4">
                  {/* Adults selector */}
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">Adults</h3>
                      <p className="text-sm text-gray-500">Ages 13+</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={decrementAdults}
                        disabled={adultCount <= 1}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          adultCount <= 1
                            ? "bg-gray-100 text-gray-400"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        }`}
                      >
                        <Minus size={16} />
                      </button>

                      <span className="w-6 text-center font-medium">
                        {adultCount}
                      </span>

                      <button
                        onClick={incrementAdults}
                        disabled={adultCount >= 4}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          adultCount >= 3
                            ? "bg-gray-100 text-gray-400"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        }`}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Children selector */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Children</h3>
                      <p className="text-sm text-gray-500">Ages 6-12</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={decrementChildren}
                        disabled={childCount <= 0}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          childCount <= 0
                            ? "bg-gray-100 text-gray-400"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        }`}
                      >
                        <Minus size={16} />
                      </button>

                      <span className="w-6 text-center font-medium">
                        {childCount}
                      </span>

                      <button
                        onClick={incrementChildren}
                        disabled={childCount >= 3}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          childCount >= 3
                            ? "bg-gray-100 text-gray-400"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        }`}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Available slots notification */}
          {/* {props.limitedAvailability && (     ===> this is original, below is for test only*/}
          {props.lastActiveAt && (
            <div className="bg-red-50 text-red-700 p-2 rounded-lg mb-4 flex items-center justify-center gap-2">
              <BellIcon className="h-5 w-5" />
              <span>
                {/* {props.availabilityMessage ||
                  "March: Only 3 slots left!"} */}
                {new Date().toLocaleString("default", { month: "long" })}: Only{" "}
                {getTotalAvailableDaysInCurrentMonth()} slots left!
              </span>
            </div>
          )}
          {props.availability.isAvailable ? (
            <>
              <Link
                href={`/guides/${
                  props.slug
                }/booking?adult=${adultCount}&child=${childCount}${
                  startingDate ? `&date=${startingDate}` : ""
                }`}
              >
                <Button className="w-full bg-primary-dark text-white rounded-lg py-3 text-lg font-medium hover:bg-blue-700 transition">
                  Create a new booking
                </Button>
              </Link>
              <p className="text-center text-sm text-gray-600 mt-2 mb-2">OR</p>
              {/* Message button */}
              <Link href={`/messages?chat=${props.slug}&id=${props.id}`}>
                <Button className=" mt-4 w-full text-lg bg-primary-dark text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition">
                  Message {props.fullname}
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button
                className="w-full bg-gray-400 text-white rounded-lg py-3 text-lg font-medium cursor-not-allowed"
                disabled
              >
                Currently Unavailable
              </Button>
              <p className="text-center text-sm text-gray-600 mt-2 mb-2">
                This guide is not accepting bookings at this time
              </p>
            </>
          )}
        </div>

        {/* Available areas */}
        {props.guidingAreas && props.guidingAreas.length > 0 && (
          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-bold mb-2">Available Areas</h3>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
              <p>{props.guidingAreas.join(", ")}</p>
            </div>
          </div>
        )}

        {/* Languages */}
        {props.languageSpeak && props.languageSpeak.length > 0 && (
          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-bold mb-2">Languages</h3>
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
              <p>{props.languageSpeak.join(", ")}</p>
            </div>
          </div>
        )}

        {/* Response time */}
        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="font-bold mb-2">Response Time</h3>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
            <p>{"Usually responds within 1 hour"}</p>
          </div>
        </div>

        {/* Availability */}
        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="font-bold mb-2">Availability</h3>
          <div className="flex items-start gap-3">
            <Calendar1Icon className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
            <div>
              <p className="mb-1">
                Available{" "}
                <span
                  className={`font-semibold ${
                    props.availability.isAvailable
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {props.availability.isAvailable ? "YES" : "NO"}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Last Active :{" "}
                {props.lastActiveAt ? (
                  <TimeAgo timestamp={props.lastActiveAt} />
                ) : (
                  "N/A"
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuideProfileSidebar
