import Sidebar from "@/components/common/Sidebar"
import UserMessages from "@/components/Messages/UserMessage"

import React from "react"

const page = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      <UserMessages />
    </div>
  )
}

export default page
