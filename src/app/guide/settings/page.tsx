import Sidebar from "@/components/common/Sidebar"
import React from "react"

export const metadata = {
  title: "Districts - Guide Me Nepal",
  description:
    "Browse all districts of Nepal to find and connect with verified, government-licensed local guides. Discover travel experiences by location and hire trusted guides with ease.",
}

const page = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div>hello</div>
    </div>
  )
}

export default page
