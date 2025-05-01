import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"
import VerifyEmail from "@/components/Login/VerifyEmail"
import { Loader2Icon } from "lucide-react"
import React, { Suspense } from "react"

export const metadata = {
  title: "Verify Email - Guide Me Nepal",
  description:
    "Verify your email address to complete the registration process. Check your inbox for the verification link.",
}

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
        <VerifyEmail />
      </Suspense>
      <Footer />
    </>
  )
}

export default page
