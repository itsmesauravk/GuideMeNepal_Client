import BookingHome from "@/components/Bookings/MyBookingHome"
import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"
import React from "react"

export const metadata = {
  title: "My Bookings - Guide Me Nepal",
  description:
    "Manage your bookings and stay organized with our easy-to-use booking system. Keep track of your clients and their itineraries.",
}

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
