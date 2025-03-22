import GuideBookingHome from "@/components/Bookings/GuideBookingHome"
import Sidebar from "@/components/common/Sidebar"

import React from "react"

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
