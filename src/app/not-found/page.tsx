import Custom404 from "@/components/common/404"
import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"
import React from "react"

const page = () => {
  return (
    <>
      <Navbar />
      <Custom404 />
      <Footer />
    </>
  )
}

export default page
