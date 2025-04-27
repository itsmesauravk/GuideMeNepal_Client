"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { Input } from "../ui/input"
import { Search, MapPin, ArrowRight, Loader2Icon, BirdIcon } from "lucide-react"
import Image from "next/image"
import PopularLoactionSkeleton from "../Skeletons/PopularLoactionSkeleton"

interface District {
  id: number
  name: string
  slug: string
  image: string
  province: string
  tags: string[]
}

const DistrictCard: React.FC<District> = ({ name, slug, image, tags }) => {
  return (
    <Link href={`/districts/${slug}`} className="group ">
      <div className="bg-white rounded-xl overflow-hidden shadow-lg ">
        <div className="relative h-52 w-full">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          />
          <ArrowRight className="absolute right-4 top-4 text-white z-10 transform -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-xl font-bold">{name}</h3>
            <div className="flex items-center text-sm mt-1 overflow-x-auto scrollbar-hide space-x-2">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-primary-dark/50 text-white px-2 py-1 rounded-full flex-shrink-0"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

const DistrictsHome = () => {
  const [districts, setDistricts] = useState<District[]>([])
  //   const [filteredDistricts, setFilteredDistricts] = useState<District[]>([])
  //   const [searchTerm, setSearchTerm] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  const getAllDistricts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/common/get-all-districts?select=id,name,slug,image,tags&limit=20`
      )
      const data = response.data

      if (data.success) {
        setDistricts(data.data.districts)
      }
    } catch (error) {
      console.error("Failed to fetch districts", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllDistricts()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Explore Nepal's Districts
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the diverse landscapes, rich cultures, and unique
          characteristics of Nepal's districts
        </p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <PopularLoactionSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      )}

      {!loading && districts.length === 0 && (
        <div className="flex flex-col gap-2 justify-center items-center h-64">
          <BirdIcon className="text-gray-600 h-10 w-10 mx-auto" />
          <p className="text-lg text-gray-600">No districts found</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {districts.map((district) => (
          <DistrictCard key={district.id} {...district} />
        ))}
      </div>
    </div>
  )
}

export default DistrictsHome
