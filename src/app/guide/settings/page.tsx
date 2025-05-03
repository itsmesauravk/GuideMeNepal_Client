import Sidebar from "@/components/common/Sidebar"
import SettingPage from "@/components/GuidePanel/SettingPage"
import React from "react"

export const metadata = {
  title: "Setting - Guide Me Nepal",
  description:
    "This is the setting page of Guide Me Nepal, where you can customize your experience.",
}

const page = () => {
  return (
    <div className="flex">
      <Sidebar />
      <SettingPage />
    </div>
  )
}

export default page
