import Sidebar from "@/components/common/Sidebar"

import React from "react"

const page = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="bg-blue-100 w-full">Messages</div>
    </div>
  )
}

export default page
