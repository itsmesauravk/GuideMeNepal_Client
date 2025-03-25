"use client"
import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"
import DistrictGuideHome from "@/components/DistrictGuides/DistrictGuideHome"
import { useParams } from "next/navigation"
import React from "react"

const page = () => {
  const params = useParams()
  const slug = params.slug as string
  return (
    <>
      <Navbar />
      <DistrictGuideHome slug={slug} />
      <Footer />
    </>
  )
}

export default page
