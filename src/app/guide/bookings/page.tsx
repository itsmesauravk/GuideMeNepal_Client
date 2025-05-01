import GuideBookingHome from "@/components/Bookings/GuideBookingHome"
import Sidebar from "@/components/common/Sidebar"

import React from "react"

export const metadata = {
  title: "Bookings - Guide Me Nepal",
  description:
    "Manage your bookings and stay organized with our easy-to-use booking system. Keep track of your clients and their itineraries.",
}

const page = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      <GuideBookingHome />
    </div>
  )
}

export default page
