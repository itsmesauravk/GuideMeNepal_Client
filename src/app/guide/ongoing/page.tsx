import Sidebar from "@/components/common/Sidebar"
import OngoingHome from "@/components/GuidePanel/OngoingHome"
import React from "react"

export const metadata = {
  title: "Ongoing - Guide Me Nepal",
  description:
    "Manage your ongoing trips and stay organized with our easy-to-use system. Keep track of your clients and their itineraries.",
}

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
