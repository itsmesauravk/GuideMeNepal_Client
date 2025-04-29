"use client"
import { useState, useEffect } from "react"
import axios from "axios"

import {
  getLocalTimeZone,
  today,
  parseDate,
  DateValue,
} from "@internationalized/date"
import { useLocale } from "@react-aria/i18n"
import { getDayOfWeek } from "@internationalized/date"
import { Calendar } from "@heroui/calendar"
import { Loader2Icon, PenBox, RefreshCcw, Trash2Icon } from "lucide-react"
import { Button } from "../ui/button"
import { set } from "date-fns"
import { toast } from "sonner"
import { SessionData } from "@/utils/Types"
import { useSession } from "next-auth/react"

interface AvailabilityRange {
  id: number
  startDate: string
  endDate: string
  reason: "PERSONAL" | "BOOKED" | "HOLIDAY"
}

const Availability = () => {
  const [availabilityRanges, setAvailabilityRanges] = useState<
    AvailabilityRange[]
  >([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [updateLoading, setUpdateLoading] = useState<boolean>(false)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [currentRange, setCurrentRange] = useState<AvailabilityRange | null>(
    null
  )

  const [newStartDate, setNewStartDate] = useState<DateValue | null>(null)
  const [newEndDate, setNewEndDate] = useState<DateValue | null>(null)
  const [reason, setReason] = useState<"PERSONAL" | "BOOKED" | "HOLIDAY">(
    "PERSONAL"
  )

  const { data: sessionData } = useSession()

  const session = sessionData as unknown as SessionData

  const now = today(getLocalTimeZone())
  const { locale } = useLocale()

  const guideId = session?.user?.id
  if (!guideId) {
    return <div className="text-red-500">Guide ID is not available</div>
  }

  useEffect(() => {
    fetchAvailability()
  }, [guideId])

  const fetchAvailability = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/availability/${guideId}`
      )
      setAvailabilityRanges(response.data.data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch availability")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAvailability = async () => {
    if (!newStartDate || !newEndDate) {
      setError("Please select both start and end dates")
      return
    }

    try {
      setUpdateLoading(true)
      const startDateISO = newStartDate.toDate(getLocalTimeZone()).toISOString()
      const endDateParts = newEndDate
        .toDate(getLocalTimeZone())
        .toISOString()
        .split("T")
      const endDateISO = `${endDateParts[0]}T23:59:59.000Z`

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/create-availability/${guideId}`,
        {
          startDate: startDateISO,
          endDate: endDateISO,
          reason,
        }
      )

      const data = response.data

      if (data.success) {
        setNewStartDate(null)
        setNewEndDate(null)
        setReason("PERSONAL")
        setShowAddModal(false)
        fetchAvailability()
      } else {
        setError(data.message || "Failed to add unavailability")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add unavailability")
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleUpdateAvailability = async () => {
    if (!currentRange || !newStartDate || !newEndDate) {
      setError("Please select both start and end dates")
      return
    }

    try {
      setUpdateLoading(true)
      const startDateISO = newStartDate.toDate(getLocalTimeZone()).toISOString()
      const endDateParts = newEndDate
        .toDate(getLocalTimeZone())
        .toISOString()
        .split("T")
      const endDateISO = `${endDateParts[0]}T23:59:59.000Z`

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/update-availability/${guideId}/${currentRange.id}`,
        {
          startDate: startDateISO,
          endDate: endDateISO,
          reason,
        }
      )

      setCurrentRange(null)
      setNewStartDate(null)
      setNewEndDate(null)
      setReason("PERSONAL")
      setShowEditModal(false)
      fetchAvailability()
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update unavailability")
    } finally {
      setUpdateLoading(false)
    }
  }

  const openEditModal = (range: AvailabilityRange) => {
    setCurrentRange(range)
    setNewStartDate(parseDate(range.startDate.split("T")[0]))
    setNewEndDate(parseDate(range.endDate.split("T")[0]))
    setReason(range.reason)
    setShowEditModal(true)
  }

  const openDeleteModal = (range: AvailabilityRange) => {
    setCurrentRange(range)
    setShowDeleteModal(true)
  }

  const handleDeleteAvailability = async () => {
    if (!currentRange) {
      setError("Please select an unavailability to delete")
      return
    }
    try {
      setDeleteLoading(true)
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/delete-availability/${currentRange.id}`
      )
      const data = response.data
      if (data.success) {
        setCurrentRange(null)
        setShowDeleteModal(false)
        toast.success(data.message || "Unavailability deleted successfully")
      } else {
        setError(data.message || "Failed to delete unavailability")
      }
      fetchAvailability()
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete unavailability")
    } finally {
      setDeleteLoading(false)
    }
  }

  const isDateUnavailable = (date: DateValue) => {
    // Get day of week (0-6, where 0 is Sunday, 6 is Saturday)
    const dayOfWeek = getDayOfWeek(date, locale)

    return (
      // Disable past dates and today
      date.compare(now) <= 0 ||
      // Check if date falls within unavailable ranges
      availabilityRanges.some((interval) => {
        const startDate = parseDate(interval.startDate.split("T")[0])
        const endDate = parseDate(interval.endDate.split("T")[0])
        return date.compare(startDate) >= 0 && date.compare(endDate) <= 0
      })
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full mt-32 lg:mt-0">
      <div className=" mx-auto">
        <div className=" p-6">
          <div className="flex justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Unavailability Calender
              </h1>
              <p className="text-gray-500">
                Manage your unavailability dates and reasons here.
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => fetchAvailability()}
                className="bg-primary-dark hover:bg-primary-darker text-white font-medium py-2 px-2 rounded"
              >
                <RefreshCcw className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-primary-dark hover:bg-primary-darker text-white font-medium py-2 px-4 rounded"
              >
                Add Unavailability
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 mb-6 rounded">
              {error}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {/* calender part  */}
            <div className="md:w-1/2">
              <h2 className="text-lg font-semibold mb-4">Calendar View</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <Calendar
                  aria-label="Unavailable Dates"
                  calendarWidth={280}
                  isDateUnavailable={isDateUnavailable}
                  visibleMonths={1}
                />
                <div className="mt-4 flex items-center">
                  <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">
                    Unavailable dates
                  </span>
                </div>
              </div>
            </div>
            {/* Unavailable Dates List */}
            <div className="md:w-1/2">
              <h2 className="text-lg font-semibold mb-4">Unavailable Dates</h2>
              {isLoading ? (
                <div className="text-center p-4">
                  <Loader2Icon className="animate-spin w-6 h-6 text-primary-dak" />
                </div>
              ) : availabilityRanges.length === 0 ? (
                <div className="text-gray-500 p-4">
                  No unavailable dates set.
                </div>
              ) : (
                <div className="space-y-4">
                  {availabilityRanges.map((range) => (
                    <div
                      key={range.id}
                      className="bg-gray-100 p-4 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">
                          {formatDate(range.startDate)} -{" "}
                          {formatDate(range.endDate)}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Reason: {range.reason}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={() => openEditModal(range)}
                          className="text-primary-dark hover:text-primary-darker"
                        >
                          <PenBox className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(range)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2Icon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Unavailability Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Unavailability</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Start Date</label>
              <Calendar
                aria-label="Start Date"
                calendarWidth={240}
                onChange={setNewStartDate}
                value={newStartDate}
                minValue={now.add({ days: 1 })}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">End Date</label>
              <Calendar
                aria-label="End Date"
                calendarWidth={240}
                onChange={setNewEndDate}
                value={newEndDate}
                minValue={newStartDate || now.add({ days: 1 })}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Reason</label>
              <select
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value as "PERSONAL" | "BOOKED" | "HOLIDAY")
                }
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="PERSONAL">Personal</option>
                <option value="BOOKED">Booked</option>
                <option value="HOLIDAY">Holiday</option>
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAvailability}
                disabled={updateLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              >
                {updateLoading ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Unavailability Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Unavailability</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Start Date</label>
              <Calendar
                aria-label="Start Date"
                calendarWidth={240}
                onChange={setNewStartDate}
                value={newStartDate}
                minValue={now.add({ days: 1 })}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">End Date</label>
              <Calendar
                aria-label="End Date"
                calendarWidth={240}
                onChange={setNewEndDate}
                value={newEndDate}
                minValue={newStartDate || now.add({ days: 1 })}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Reason</label>
              <select
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value as "PERSONAL" | "BOOKED" | "HOLIDAY")
                }
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="PERSONAL">Personal</option>
                <option value="BOOKED">Booked</option>
                <option value="HOLIDAY">Holiday</option>
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAvailability}
                disabled={updateLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              >
                {updateLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Unavailability Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Delete Unavailability</h2>
            <p className="mb-4">
              Are you sure you want to delete this unavailability?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteAvailability()
                }}
                disabled={deleteLoading}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Availability
