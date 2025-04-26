"use client"
import React, { useEffect, useState } from "react"
import GuideCard from "../common/GuideCard"
import axios from "axios"
import GuideCardSkeleton from "../Skeletons/GuideCardSkeleton"

const PopularGuides = () => {
  const [popularGuides, setPopularGuides] = useState([])
  const [newGuides, setNewGuides] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const handleGetPopularGuides = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/get-popular-new-guides`
      )
      const data = response.data
      if (data.success) {
        setPopularGuides(data.data.popularGuides)
        setNewGuides(data.data.newGuides)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleGetPopularGuides()
  }, [])

  return (
    <div className="max-w-7xl mx-auto">
      <section className="featured-section container mx-auto py-16">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Top Rated Guides
          </h2>
          <p className="text-gray-600">
            Trusted by travelers, loved for excellence
          </p>
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-3 md:gap-4 lg:gap-6 justify-center w-full px-2 sm:px-4">
          {isLoading
            ? [...Array(4)].map((_, index) => (
                <GuideCardSkeleton key={`skeleton-${index}`} />
              ))
            : popularGuides.map((guide, index) => (
                <GuideCard key={`guide-${index}`} details={guide} />
              ))}
        </div>
      </section>

      {/* for new guides  */}
      <section className="featured-section container mx-auto py-16">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">New Guides</h2>
          <p className="text-gray-600">
            Fresh talents ready to make your journey unforgettable
          </p>
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-3 md:gap-4 lg:gap-6 justify-center w-full px-2 sm:px-4">
          {isLoading
            ? [...Array(4)].map((_, index) => (
                <GuideCardSkeleton key={`skeleton-${index}`} />
              ))
            : newGuides.map((guide, index) => (
                <GuideCard key={`guide-${index}`} details={guide} />
              ))}
        </div>
      </section>
    </div>
  )
}

export default PopularGuides
