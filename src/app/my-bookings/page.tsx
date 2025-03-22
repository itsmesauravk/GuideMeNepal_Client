import BookingHome from "@/components/Bookings/MyBookingHome"
import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"
import React from "react"

const page = () => {
  return (
    <>
      <Navbar />
      <BookingHome />
      <Footer />
    </>
  )
}

export default page
