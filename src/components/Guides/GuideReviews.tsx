"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { Loader2, RefreshCcw, Star, StarHalf } from "lucide-react"
import { useSession } from "next-auth/react"
import { SessionData } from "@/utils/Types"
import TimeAgo from "../common/TimeAgo"

// Define the review type based on the response structure
interface ReviewType {
  id: number
  comments: string
  rating: number
  destination: string
  createdAt: string
  user: {
    fullName: string
    profilePicture: string
  }
}

const GuideReviews = () => {
  const [reviews, setReviews] = useState<ReviewType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [totalReviews, setTotalReviews] = useState<number>(0)
  const [averageRating, setAverageRating] = useState<number>(0)

  const { data: sessionData } = useSession()
  const session = sessionData as unknown as SessionData

  const handleGetReviews = async () => {
    if (!session?.user?.id) return

    setLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/common/get-guide-reviews/${session?.user?.id}`
      )
      const data = response.data

      if (data.success) {
        setReviews(data.data.reviews || [])
        setTotalReviews(data.data.total || 0)
        setAverageRating(data.data.average || 0)
        setError(null)
      } else {
        setError("Failed to load reviews")
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
      setError("Something went wrong while fetching reviews")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGetReviews()
  }, [session?.user?.id])

  // Render star rating based on rating value
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-5 h-5 fill-yellow-400 text-yellow-400"
        />
      )
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="w-5 h-5 fill-yellow-400 text-yellow-400"
        />
      )
    }

    // Add empty stars
    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />)
    }

    return stars
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Reviews</h1>
          {totalReviews > 0 && (
            <span className="ml-2 px-2 py-1 text-xs font-bold bg-blue-100 text-blue-600 rounded-full">
              {totalReviews} review{totalReviews !== 1 ? "s" : ""}
            </span>
          )}
          {averageRating > 0 && (
            <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
              <div className="flex mr-1">{renderStars(averageRating)}</div>
              <span className="text-sm font-semibold">
                {averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleGetReviews}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
            title="Refresh reviews"
          >
            <RefreshCcw className="w-5 h-5 text-primary-dark" />
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <p>{error}</p>
            <button
              onClick={handleGetReviews}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Try again
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">⭐</div>
            <p className="text-xl font-medium text-gray-700">No reviews yet</p>
            <p className="text-gray-500 mt-2">
              Reviews from tourists will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 hover:bg-gray-50 transition-colors mb-4"
              >
                <div className="flex items-start">
                  <img
                    src={
                      review.user.profilePicture || "/images/default_user.avif"
                    }
                    alt={review.user.fullName}
                    className="w-10 h-10 rounded-full object-cover mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <h3 className="font-medium">{review.user.fullName}</h3>
                      <span className="text-xs text-gray-500 mt-1 sm:mt-0">
                        <TimeAgo timestamp={review.createdAt} />
                      </span>
                    </div>
                    <div className="flex my-1">
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-gray-600 mt-1">{review.comments}</p>
                    <div className="mt-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {review.destination}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GuideReviews
