"use client"
import React, { useEffect, useState } from "react"
import PopularGuides from "../Homepage/PopularGuides"
import GuideCard from "../common/GuideCard"
import axios from "axios"
import { set } from "date-fns"
import { Spinner } from "@heroui/spinner"
import { BirdIcon } from "lucide-react"

interface DistrictGuidesProps {
  district: string
}

const DistrictGuides: React.FC<DistrictGuidesProps> = ({ district }) => {
  const [popularGuides, setPopularGuides] = useState([])
  const [loading, setLoading] = useState(true)

  const handleGetGuides = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/get-guides?guidingArea=${district}`
      )
      const data = response.data
      if (data.success) {
        setPopularGuides(data.data)
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
    <div className="max-w-7xl mx-auto py-10">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Popular Guides in {district}
        </h2>
      </div>

      {loading && (
        <div className="text-center mt-8 text-primary-dark">
          <Spinner className="text-primary-dark" />
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        {popularGuides.map((guide, index) => (
          <GuideCard key={index} details={guide} />
        ))}
      </div>

      {!loading && popularGuides.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-12 text-center">
          <BirdIcon className="w-16 h-16 text-gray-400" />
          <h3 className="text-2xl font-semibold text-gray-400">
            No guides available in {district}
          </h3>
        </div>
      )}
    </div>
  )
}

export default DistrictGuides
