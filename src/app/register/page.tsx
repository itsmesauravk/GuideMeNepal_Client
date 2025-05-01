import RegisterFormClient from "@/components/Login/RegisterForm"
import React from "react"

export const metadata = {
  title: "Register - Guide Me Nepal",
  description:
    "Register to create an account and start your journey with us. Fill out the form and join our community.",
}

const page = () => {
  return (
    <div>
      <RegisterFormClient />
    </div>
  )
}

export default page
