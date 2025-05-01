import Sidebar from "@/components/common/Sidebar"
import Dashboard from "@/components/GuidePanel/Dashboard"

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
      <Dashboard />
      {/* <h1>Dashboard will be under development soon...</h1> */}
    </div>
  )
}

export default page
