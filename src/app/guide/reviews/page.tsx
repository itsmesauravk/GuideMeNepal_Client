import Sidebar from "@/components/common/Sidebar"
import GuideReviews from "@/components/Guides/GuideReviews"
import React from "react"

export const metadata = {
  title: "Districts - Guide Me Nepal",
  description:
    "Browse all districts of Nepal to find and connect with verified, government-licensed local guides. Discover travel experiences by location and hire trusted guides with ease.",
}

const page = () => {
  return (
    <div className="flex ">
      <Sidebar />
      <GuideReviews />
    </div>
  )
}

export default page
