import Sidebar from "@/components/common/Sidebar"
import TourGuideDashboard from "@/components/GuidePanel/Dashboard"

// import LocationTrack from "@/components/GuidePanel/LiveLocation"

import React from "react"

export const metadata = {
  title: "Dashboard - Guide Me Nepal",
  description:
    "Manage your profile, bookings, and availability. Stay organized and connected with clients.",
}

const page = () => {
  return (
    <div className="flex">
      <Sidebar />
      <TourGuideDashboard />
      {/* <LocationTrack /> */}
      {/* <h1>Dashboard will be under development soon...</h1> */}
    </div>
  )
}

export default page
