"use client"
import React, { useEffect, useState } from "react"
import PopularGuides from "../Homepage/PopularGuides"
import GuideCard from "../common/GuideCard"
import axios from "axios"
import { set } from "date-fns"
import { Spinner } from "@heroui/spinner"
import { BirdIcon, Loader2Icon } from "lucide-react"
import GuideCardSkeleton from "../Skeletons/GuideCardSkeleton"
import LanguagesList from "../../utils/Languages.json"

interface DistrictGuidesProps {
  district: string
}

const DistrictGuides: React.FC<DistrictGuidesProps> = ({ district }) => {
  const [popularGuides, setPopularGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [selectedRating, setSelectedRating] = useState(0)

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

  console.log(selectedLanguage)

  const filteredGuides = popularGuides.filter((guide: any) => {
    const matchesLanguage = selectedLanguage
      ? guide.languageSpeak?.includes(selectedLanguage)
      : true

    const matchesRating =
      selectedRating > 0 ? guide.rating >= selectedRating : true

    return matchesLanguage && matchesRating
  })

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
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        {/* Language Filter */}
        <select
          onChange={(e) => setSelectedLanguage(e.target.value)}
          value={selectedLanguage}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm"
        >
          <option value="">All Languages</option>
          {LanguagesList.map((language, index) => (
            <option
              key={language.id}
              value={language.language}
              disabled={index !== 0 && selectedLanguage === language.language}
            >
              {language.language}
            </option>
          ))}
        </select>

        {/* Rating Filter */}
        <select
          onChange={(e) => setSelectedRating(Number(e.target.value))}
          value={selectedRating}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm"
        >
          <option value={0}>All Ratings</option>
          <option value={4.5}>4.5 & up</option>
          <option value={4}>4.0 & up</option>
          <option value={3}>3.0 & up</option>
        </select>
      </div>

      {loading &&
        [...Array(4)].map((_, index) => (
          <GuideCardSkeleton key={`skeleton-${index}`} />
        ))}

      <div className="flex flex-wrap gap-4">
        {/* {popularGuides.map((guide, index) => (
          <GuideCard key={index} details={guide} />
        ))} */}
        {filteredGuides.map((guide, index) => (
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
