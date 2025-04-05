import GuideBookingsHistory from "@/components/Bookings/GuideBookingsHistory"
import Sidebar from "@/components/common/Sidebar"
import React from "react"

const page = () => {
  return (
    <div className="flex">
      <Sidebar />
      <GuideBookingsHistory />
    </div>
  )
}

export default page
