"use client"
import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"
import Booking from "@/components/Guides/Booking"
import { useParams } from "next/navigation"
import React from "react"

// Use proper function declaration with type annotation
const Page = () => {
  const params = useParams()
  const slug = params.slug as string

  return (
    <>
      <Navbar />
      <Booking id={slug} />
      <Footer />
    </>
  )
}

export default Page
