import Sidebar from "@/components/common/Sidebar"
import GuideNotifications from "@/components/GuidePanel/GuideNotifications"
import React from "react"

export const metadata = {
  title: "Notifications - Guide Me Nepal",
  description:
    "Stay updated with the latest notifications and messages from your clients. Manage your notifications and never miss an important update.",
}

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
