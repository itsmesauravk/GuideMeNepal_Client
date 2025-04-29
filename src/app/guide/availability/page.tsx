import Sidebar from "@/components/common/Sidebar"
import Availability from "@/components/GuidePanel/Availability"
import React from "react"

const page = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Availability />
    </div>
  )
}

export default page
