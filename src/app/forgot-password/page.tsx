"use client"
import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"
import ForgotPassword from "@/components/Login/ForgotPassword"
import { Loader2Icon } from "lucide-react"

import React, { Suspense } from "react"

const page = () => {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div className="flex items-center justify-center ">
            <Loader2Icon className="animate-spin text-primary" />
            <p className="text-gray-500 animate-pulse">Loading...</p>
          </div>
        }
      >
        <ForgotPassword />
      </Suspense>

      <Footer />
    </>
  )
}

export default page
