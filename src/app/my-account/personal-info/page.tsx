import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"
import PersonalInfo from "@/components/MyAccount/PersonalInfo"
import React from "react"

const page = () => {
  return (
    <>
      <Navbar />
      <PersonalInfo />
      <Footer />
    </>
  )
}

export default page
