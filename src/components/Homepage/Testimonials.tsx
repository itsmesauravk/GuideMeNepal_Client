import React, { useEffect } from "react"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
// Import required modules
import { Pagination, Autoplay } from "swiper/modules"
import { Quote, Star } from "lucide-react"
import { GuideReviewType } from "@/utils/Types"
import axios from "axios"
import Image from "next/image"

const Testimonials = () => {
  const [reviews, setReviews] = React.useState<GuideReviewType[]>([])

  const handleGetLatestGuideReviews = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/common/latest-guide-reviews`
      )
      const data = response.data
      if (data.success) {
        setReviews(data.data)
      }
    } catch (error) {
      console.error("Error fetching guide reviews:", error)
    }
  }

  // Quote SVG component for reuse
  const QuoteIcon = () => (
    <Quote className="block w-5 h-5 text-primary-dark mb-4" />
  )

  // Star Rating component
  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex mt-1 mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  )

  useEffect(() => {
    handleGetLatestGuideReviews()
  }, [])

  // Testimonial card component for reuse
  const TestimonialCard = ({ review }: { review: GuideReviewType }) => (
    <div className="h-full max-w-3xl flex flex-col items-center justify-center ">
      <QuoteIcon />
      <span className="text-primary-darker font-semibold text-sm">
        {review.destination}
      </span>

      <StarRating rating={review.rating} />
      <p className="text-center mb-6 ">{review.comments}</p>
      <div className="inline-flex items-center">
        <Image
          src={review.user.profilePicture}
          alt={review.user.fullName}
          className="w-12 h-12 rounded-full flex-shrink-0"
          width={48}
          height={48}
        />
        <span className="flex-grow flex flex-col pl-4">
          <span className="title-font font-medium text-gray-900">
            {review.user.fullName}
          </span>
          {review.user.country && (
            <span className="text-gray-500 text-xs">{review.user.country}</span>
          )}
        </span>
      </div>
    </div>
  )

  return (
    <div className="bg-white">
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Reviews</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              View what our customers are saying about our guides and services
            </p>
          </div>

          {/* Mobile view - swiper */}
          <div className="md:hidden">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              className="mySwiper"
            >
              {reviews &&
                reviews.map((review) => (
                  <SwiperSlide key={review.id}>
                    <div className="p-4 w-full">
                      <TestimonialCard review={review} />
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>

          {/* Centered desktop testimonials without side arrows */}
          <div className="hidden md:block">
            <div className="flex justify-center">
              <div className="w-full max-w-3xl">
                <Swiper
                  modules={[Pagination, Autoplay]}
                  spaceBetween={30}
                  slidesPerView={1}
                  navigation={false}
                  // pagination={{ clickable: true }}
                  autoplay={{ delay: 4000 }}
                  className="mySwiper rounded-lg overflow-hidden"
                >
                  {reviews &&
                    reviews.map((review) => (
                      <SwiperSlide
                        key={review.id}
                        className="flex justify-center"
                      >
                        <div className="p-4">
                          <TestimonialCard review={review} />
                        </div>
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Testimonials
