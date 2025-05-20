import React from "react"
import Navbar from "@/components/common/Navbar"
import Footer from "@/components/common/Footer"

import FAQs from "@/components/common/FAQs"

export const metadata = {
  title: "Frequently Asked Questions - Guide Me Nepal",
  description:
    "Get answers to the most common questions about Guide Me Nepal's services, tour bookings, guides, and more.",
}

const page = () => {
  return (
    <>
      <Navbar />
      <FAQs />
      <Footer />
    </>
  )
}

export default page
