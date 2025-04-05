"use client"
import React, { useEffect, useState } from "react"
import GuideCard from "../common/GuideCard"
import axios from "axios"
import { Spinner } from "@heroui/spinner"

const SimilarGuides = ({ location }: { location: string }) => {
  const [similarGuides, setSimilarGuides] = useState([])
  const [loading, setLoading] = useState(true)

  const handleGetGuides = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/get-guides?guidingArea=${location}`
      )
      const data = response.data
      if (data.success) {
        setSimilarGuides(data.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGetGuides()
  }, [])

  return (
    <div className="max-w-7xl mx-auto">
      <section className="featured-section container mx-auto py-16">
        <h3 className="text-xl font-bold mb-6">Other Guides in {location}</h3>
        {loading && (
          <div className="text-center mt-8 text-primary-dark">
            <Spinner className="text-primary-dark" />
          </div>
        )}
        {!loading && similarGuides.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-12 text-center">
            <p className="text-gray-500">No guides found in this location</p>
          </div>
        )}
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
