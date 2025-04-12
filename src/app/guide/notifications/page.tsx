import Sidebar from "@/components/common/Sidebar"
import GuideNotifications from "@/components/GuidePanel/GuideNotifications"
import React from "react"

const page = () => {
  return (
    <div className="flex">
      <Sidebar />
      <GuideNotifications />
      {/* <h1>Notifications</h1> */}
    </div>
  )
}

export default page
