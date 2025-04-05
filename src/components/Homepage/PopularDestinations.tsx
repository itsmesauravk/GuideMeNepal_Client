"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { Button } from "../ui/button"

interface PopularCardProps {
  title: string
  image: string
}

interface District {
  id: number
  name: string
  slug: string
  image: string
}

const PopularCard: React.FC<PopularCardProps> = ({ title, image }) => {
  return (
    <div className="w-36 h-48 group cursor-pointer rounded-xl overflow-hidden shadow-lg">
      <div className="relative h-full">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        <h3 className="absolute bottom-4 left-2 font-bold text-lg text-white">
          {title}
        </h3>
      </div>
    </div>
  )
}

const Populars = () => {
  const [popularDistricts, setPopularDistricts] = useState<District[]>([])

  const getPopularDistricts = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/common/get-popular-districts?select=id,name,slug,image`
    )
    const data = response.data

    if (data.success) {
      setPopularDistricts(data.data)
    }
  }

  useEffect(() => {
    getPopularDistricts()
  }, [])

  return (
    <div className="max-w-7xl mx-auto">
      <section className="py-10  sm:px-6 lg:px-8 ">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Locations
            </h2>
            <p className="text-gray-600">
              Explore Nepal's most beloved districts
            </p>
          </div>

          <div className="flex flex-wrap justify-between">
            {popularDistricts.map((location) => (
              <Link href={`/districts/${location.slug}`} key={location.id}>
                <PopularCard
                  key={location.id}
                  title={location.name}
                  image={location.image}
                />
              </Link>
            ))}
          </div>
        </div>
        <Link href="/districts">
          <Button className="bg-primary-dark hover:bg-primary-darker text-white px-4 py-2 rounded-lg mt-4 mx-auto block">
            View All
          </Button>
        </Link>
      </section>
    </div>
  )
}

export default Populars
