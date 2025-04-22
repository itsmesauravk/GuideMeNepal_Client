"use client"
import React, { useEffect, useState } from "react"
import DistrictHeroSection from "./DistrictHeroSection"
import DistrictGuides from "./DistrictGuides"
import axios from "axios"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface DistrictGuideHomeProps {
  slug: string
}

interface DistrictDetails {
  id: number
  name: string
  slug: string
  image: string
  description: string
}

const DistrictGuideHome: React.FC<DistrictGuideHomeProps> = ({ slug }) => {
  const [districtData, setDistrictData] = useState<DistrictDetails>()

  const getSingleDistrictData = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/common/get-single-district/${slug}`
    )
    const data = response.data

    if (data.success) {
      setDistrictData(data.data)
    }
  }

  useEffect(() => {
    getSingleDistrictData()
  }, [])

  return (
    <div>
      <div
        className="hero-section relative h-[280px] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${districtData?.image})` }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black opacity-30"></div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-soft-white text-center px-4">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-lg text-white">
            Hire Trusted Guides in {districtData?.name}
          </h1>
          <p className="text-xl mb-8 max-w-2xl text-white">
            Connect with certified local guides in {districtData?.name} for
            authentic and unforgettable travel experiences.
          </p>
        </div>
      </div>

      {/* description about district  */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-10">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/districts">Districts</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>{slug}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="text-3xl font-bold mb-4">About {districtData?.name}</h2>
        <p className="text-lg">{districtData?.description}</p>
      </div>
      <DistrictGuides district={districtData?.slug || slug} />
    </div>
  )
}

export default DistrictGuideHome
