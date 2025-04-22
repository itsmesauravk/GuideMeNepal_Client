import Sidebar from "@/components/common/Sidebar"
import GuideReviews from "@/components/Guides/GuideReviews"
import React from "react"

const page = () => {
  return (
    <div className="flex ">
      <Sidebar />
      <GuideReviews />
    </div>
  )
}

export default page
