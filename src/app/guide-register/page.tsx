import GuideRegister from "@/components/Login/GuideRegister"
import React from "react"

export const metadata = {
  title: "Guide Register - Guide Me Nepal",
  description:
    "Register as a guide and start your journey with us. Fill out the form and join our community of guides.",
}

const page = () => {
  return (
    <div>
      <GuideRegister />
    </div>
  )
}

export default page
