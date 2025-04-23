"use client"
import axios from "axios"
import { AlertCircleIcon, Loader2Icon, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Textarea } from "../ui/textarea"

interface ReportModalProps {
  setReportModelOpen: (open: boolean) => void
  onSuccessReport: () => void
  guideId?: number
  userId?: string
  destination?: string
  bookingDetails?: any
}

const ReportGuideModel = ({
  setReportModelOpen,
  onSuccessReport,
  guideId,
  userId,
  destination,
  bookingDetails,
}: ReportModalProps) => {
  const [reason, setReason] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Predefined reasons for reporting a guide
  const reportReasons = [
    "Inappropriate behavior",
    "No-show",
    "Misleading information",
    "Safety concerns",
    "Communication issues",
    "Other",
  ]

  const handleSubmit = async () => {
    if (!reason) {
      setError("Please select a reason for reporting")
      return
    }

    try {
      setIsSubmitting(true)
      setError("") // Reset error message

      const metadata = {
        reportedAt: new Date().toISOString(),
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/common/create-guide-report`,
        {
          guideId,
          userId,
          reason,
          description,
          metadata,
          bookingId: bookingDetails?.id,
        }
      )

      const data = response.data
      if (data.success) {
        toast.success(
          data.message || "Your report has been submitted successfully."
        )
        onSuccessReport()
        setReportModelOpen(false)
      } else {
        toast.error(data.message || "Something went wrong, Please try again.")
        setError(data.message || "Something went wrong, Please try again.")
      }

      // Reset form
      setReason("")
      setDescription("")
    } catch (error) {
      console.error("Error submitting report:", error)
      setError(
        "An error occurred while submitting your report. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Clear error message after 2 seconds
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError("")
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [error])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="flex gap-2 text-lg justify-center items-center text-red-600 font-semibold">
            {" "}
            <AlertCircleIcon className="w-8 h-8" /> Report Guide
          </h3>
          <button
            onClick={() => setReportModelOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-700 mb-4">
          Please let us know why you're reporting this guide. Your report will
          be reviewed by our team.
        </p>

        {/* Reason Selection */}
        <div className="mb-4">
          <p className="text-md font-semibold text-gray-700 mb-1">
            Reason <span className="text-red-700">*</span>
          </p>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
            required
          >
            <option value="">Select a reason</option>
            {reportReasons.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {!reason && error.includes("reason") && (
            <p className="text-red-500 text-xs mt-1">Please select a reason</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-md font-semibold text-gray-700 mb-1">
            Description <span className="text-gray-500">(optional)</span>
          </p>
          <Textarea
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
            placeholder="Please provide more details about your report..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-xs mb-2 mt-2">{error}</p>}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !reason}
            className={`px-4 py-2 rounded-md ${
              isSubmitting || !reason
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary-dark text-white hover:bg-primary-darker"
            }`}
          >
            {isSubmitting ? (
              <p className="flex items-center gap-2">
                <Loader2Icon className="animate-spin mr-2 w-4 h-4" />
                Submitting...
              </p>
            ) : (
              <p>Submit Report</p>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportGuideModel
