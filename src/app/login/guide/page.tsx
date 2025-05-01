import GuideLoginForm from "@/components/Login/LoginGuide"
import React from "react"

export const metadata = {
  title: "Login - Guide Me Nepal",
  description:
    "Login to your account and access your profile, bookings, and notifications. Stay connected with your clients and manage your guide services.",
}

const page = () => {
  return (
    <div className="w-full">
      <GuideLoginForm />
    </div>
  )
}

export default page
