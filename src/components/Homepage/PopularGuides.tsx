"use client"
import React, { useEffect, useState } from "react"
import GuideCard from "../common/GuideCard"
import axios from "axios"

const PopularGuides = () => {

  const [popularGuides, setPopularGuides] = useState([])

  const handleGetPopularGuides = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/get-popular-guides`
      )
      const data = response.data
      if (data.success) {
        setPopularGuides(data.data)
      }
    } catch (error) {
      console.log(error)
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

        <div className="flex flex-wrap gap-4">
          {popularGuides.map((guide, index) => (
            <GuideCard key={index} details={guide} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default PopularGuides
