import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"
import DistrictsHome from "@/components/DistrictGuides/DistrictsHome"
import React from "react"

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
