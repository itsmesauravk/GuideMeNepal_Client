import Sidebar from "@/components/common/Sidebar"
import Availability from "@/components/GuidePanel/Availability"
import React from "react"

export const metadata = {
  title: "Availability - Guide Me Nepal",
  description:
    "Manage your availability and let clients know when you're available for bookings. Set your schedule and increase your chances of getting hired.",
}

const page = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Availability />
    </div>
  )
}

export default page
