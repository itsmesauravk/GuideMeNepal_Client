"use client"
import axios from "axios"
import { set } from "date-fns"
import { Loader2Icon, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface ReviewModalProps {
  setReviewModelOpen: (open: boolean) => void
  onSuccessReview: () => void
  guideId?: number
  userId?: string
  destination?: string
  bookingDetails?: any
}

const ReviewModal = ({
  setReviewModelOpen,
  onSuccessReview,
  guideId,
  userId,
  destination,
  bookingDetails,
}: ReviewModalProps) => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comments, setComments] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating)
  }

  const handleSubmit = async () => {
    if (rating >= 1) {
      try {
        setIsSubmitting(true)
        setError("") // Reset error message
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/common/create-guide-review`,
          {
            bookingId: bookingDetails?.id,
            guideId,
            userId,
            destination,
            rating,
            comments,
          }
        )

        const data = response.data
        if (data.success) {
          toast.success(data.message || "Your Feedback added successfully.")
          onSuccessReview()
          setReviewModelOpen(false)
        } else {
          toast.error(data.message || "Something went wrong, Please try again.")
          setError(data.message || "Something went wrong, Please try again.")
        }
        // Reset form
        setRating(0)
        setComments("")
      } catch (error) {
        console.error("Error submitting review:", error)

        setError(
          "An error occurred while submitting your review. Please try again."
        )
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  //settimeout for 2 seconds to remove error message
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
          <h3 className="text-lg font-semibold">Guide Feedback</h3>
          <button
            onClick={() => setReviewModelOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-700 mb-2">
          Please share your experience with the guide.
        </p>

        {/* Star Rating */}
        <div className="mb-2 mt-2">
          <p className="text-md font-semibold text-gray-700 mb-1">
            Rating <span className="text-red-700">*</span>
          </p>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => handleRatingClick(star)}
              >
                <svg
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating > 0 ? `${rating.toFixed(1)} out of 5` : "Select rating"}
            </span>
          </div>
          {rating === 0 && (
            <p className="text-red-500 text-xs mt-1">Rating is required</p>
          )}
        </div>

        {/* Comments */}
        <div className="mb-4">
          <p className="text-md font-semibold text-gray-700 mb-1">
            Comment <span className="text-red-700">*</span>
          </p>
          <textarea
            id="comments"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
            placeholder="Share your thoughts about the guide..."
            value={comments}
            required
            onChange={(e) => setComments(e.target.value)}
          ></textarea>
        </div>

        {error && <p className="text-red-500 text-xs mb-2 mt-2">{error}</p>}

        {/* Booking Details */}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className={`px-4 py-2 rounded-md ${
              rating === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary-dark text-white hover:bg-primary-darker"
            }`}
          >
            {isSubmitting ? (
              <p className="flex items-center gap-2">
                <Loader2Icon className="animate-spin mr-2 w-4 h-4 " />
                Submitting...
              </p>
            ) : (
              <p>Submit Feedback</p>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReviewModal
