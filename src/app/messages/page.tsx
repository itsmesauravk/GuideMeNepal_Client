import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"
import UserMessages from "@/components/Messages/UserMessage"
import React from "react"

const page = () => {
  return (
    <>
      <Navbar />
      <UserMessages />
    </>
  )
}

export default page
