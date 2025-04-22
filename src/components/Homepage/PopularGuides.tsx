"use client"
import React, { useEffect, useState } from "react"
import GuideCard from "../common/GuideCard"
import axios from "axios"
import GuideCardSkeleton from "../Skeletons/GuideCardSkeleton"

const PopularGuides = () => {
  const [popularGuides, setPopularGuides] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const handleGetPopularGuides = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/get-popular-guides`
      )
      const data = response.data
      if (data.success) {
        setPopularGuides(data.data)
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
        <h2 className="text-3xl font-bold text-center mb-10 text-charcoal-gray">
          Top Rated Guides
        </h2>

        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 lg:gap-6 justify-center w-full px-2 sm:px-4">
          {isLoading
            ? [...Array(4)].map((_, index) => (
                <GuideCardSkeleton key={`skeleton-${index}`} />
              ))
            : popularGuides.map((guide, index) => (
                <GuideCard key={`guide-${index}`} details={guide} />
              ))}
        </div>
      </section>
    </div>
  )
}

export default PopularGuides
