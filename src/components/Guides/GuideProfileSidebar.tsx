import React from "react"
import {
  Star,
  MapPin,
  MessageSquare,
  Clock,
  AlertCircleIcon,
  Calendar1Icon,
} from "lucide-react"

import TimeAgo from "../common/TimeAgo"
import { Button } from "../ui/button"

//heroui
import { Calendar } from "@heroui/react"
import { today, getLocalTimeZone, isWeekend } from "@internationalized/date"
import { useLocale } from "@react-aria/i18n"
import Link from "next/link"

import { GuideDetailsType } from "@/utils/Types"

const GuideProfileSidebar: React.FC<GuideDetailsType> = (props) => {
  let now = today(getLocalTimeZone())

  let disabledRanges = [
    [now, now.add({ days: 5 })],
    [now.add({ days: 14 }), now.add({ days: 16 })],
    [now.add({ days: 23 }), now.add({ days: 24 })],
  ]

  let { locale } = useLocale()

  let isDateUnavailable = (date: any) =>
    isWeekend(date, locale) ||
    disabledRanges.some(
      (interval) =>
        date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0
    )

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
                      className="h-3 w-3 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="ml-1 text-sm">5 / 5</span>
                <span className="ml-1 text-sm text-blue-600">
                  {/* ({props.reviewCount || props.id} reviews) */}({props.id}{" "}
                  reviews)
                </span>
              </div>
            </div>
          </div>
          {/* Date selection */}
          <div className="mb-4">
            <div className="border rounded p-3 flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <Calendar1Icon className="h-5 w-5 mr-2" />
                <span>Date</span>
              </div>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex gap-x-4">
              <Calendar
                aria-label="Date (Unavailable)"
                calendarWidth={220}
                isDateUnavailable={isDateUnavailable}
                aria-multiselectable={true}
              />
            </div>
          </div>
          {/* Group size selection */}
          <div className="mb-4">
            <div className="border rounded p-3 flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="9" cy="7" r="4" />
                  <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
                </svg>
                {/* <span>{props?.groupSize || "2 Adults"}</span> */}
                <span>{"2 Adults"}</span>
              </div>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Available slots notification */}
          {/* {props.limitedAvailability && (     ===> this is original, below is for test only*/}
          {props.lastActiveAt && (
            <div className="bg-red-50 text-red-700 p-2 rounded-lg mb-4 flex items-center justify-center gap-2">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span>
                {/* {props.availabilityMessage ||
                  "March: Only 3 slots left!"} */}
                March: Only 3 slots left!
              </span>
            </div>
          )}
          {props.availability.isAvailable ? (
            <>
              <Link href={`/guides/${props.slug}/booking`}>
                <Button className="w-full bg-primary-dark text-white rounded-lg py-3 text-lg font-medium hover:bg-blue-700 transition">
                  Create a new booking
                </Button>
              </Link>
              <p className="text-center text-sm text-gray-600 mt-2 mb-2">OR</p>
              {/* Message button */}
              <Button className=" mt-4 w-full text-lg bg-primary-dark text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition">
                Message {props.fullname}
              </Button>
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

        {/* Report guide */}
        <div className="text-center pt-4">
          <button className="flex items-center  ml-6  gap-2 text-red-500 text-lg hover:underline">
            <AlertCircleIcon className="h-4 w-4 inline-block" />
            Report this guide
          </button>
        </div>
      </div>
    </div>
  )
}

export default GuideProfileSidebar
