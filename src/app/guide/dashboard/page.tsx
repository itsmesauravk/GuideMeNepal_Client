"use client"

import Sidebar from "@/components/common/Sidebar"
import Dashboard from "@/components/GuidePanel/Dashboard"

import React from "react"

const page = () => {
  return (
    <div className="flex">
      <Sidebar />
      {/* <Dashboard /> */}
      <h1>Dashboard</h1>
    </div>
  )
}

export default page
