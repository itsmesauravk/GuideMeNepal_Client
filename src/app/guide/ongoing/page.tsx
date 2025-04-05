import Sidebar from "@/components/common/Sidebar"
import OngoingHome from "@/components/GuidePanel/OngoingHome"
import React from "react"

const page = () => {
  return (
    <div className="flex ">
      <Sidebar />
      <OngoingHome />
      {/* <h1>Ongoing</h1> */}
    </div>
  )
}

export default page
