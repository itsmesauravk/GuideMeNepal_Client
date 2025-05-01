import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"
import DistrictsHome from "@/components/DistrictGuides/DistrictsHome"
import React from "react"

export const metadata = {
  title: "Districts - Guide Me Nepal",
  description:
    "Browse all districts of Nepal to find and connect with verified, government-licensed local guides. Discover travel experiences by location and hire trusted guides with ease.",
}

const page = () => {
  return (
    <>
      <Navbar />
      <DistrictsHome />
      <Footer />
    </>
  )
}

export default page
