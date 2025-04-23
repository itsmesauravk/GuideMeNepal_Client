import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"
import UserMessages from "@/components/Messages/UserMessage"
import { Loader2Icon } from "lucide-react"
import React, { Suspense } from "react"

const page = () => {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div className="flex items-center justify-center w-full h-screen">
            <Loader2Icon className="animate-spin" />
          </div>
        }
      >
        <UserMessages />
      </Suspense>
    </>
  )
}

export default page
