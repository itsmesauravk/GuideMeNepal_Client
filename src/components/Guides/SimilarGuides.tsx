"use client"
import React, { useEffect, useState } from "react"
import GuideCard from "../common/GuideCard"
import axios from "axios"

const SimilarGuides = ({ location }: { location: string }) => {
  const [similarGuides, setSimilarGuides] = useState([])

  const handleGetSimilarGuides = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/get-popular-guides`
      )
      const data = response.data
      if (data.success) {
        setSimilarGuides(data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleGetSimilarGuides()
  }, [])

  return (
    <div className="max-w-7xl mx-auto">
      <section className="featured-section container mx-auto py-16">
        <h3 className="text-xl font-bold mb-6">Other Guides in {location}</h3>
        <div className="flex flex-wrap gap-4">
          {similarGuides.map((guide, index) => (
            <GuideCard key={index} details={guide} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default SimilarGuides
