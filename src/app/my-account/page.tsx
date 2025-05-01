import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"
import Account from "@/components/MyAccount/Account"
import React from "react"

export const metadata = {
  title: "My Account - Guide Me Nepal",
  description:
    "Manage your account settings, profile information, and preferences. Stay in control of your account and privacy.",
}

const page = () => {
  return (
    <>
      <Navbar />
      <Account />
      <Footer />
    </>
  )
}

export default page
