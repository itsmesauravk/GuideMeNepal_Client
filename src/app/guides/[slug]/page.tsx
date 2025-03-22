"use client"
import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"
import SingleGuideView from "@/components/Guides/SingleGuideView"
import { useParams } from "next/navigation"
import React from "react"

const page = () => {
  const router = useParams()
  const { slug } = router
  const idSlug = Array.isArray(slug) ? slug[0] : slug || ""
  return (
    <div className="w-full">
      <Navbar />
      <SingleGuideView slug={idSlug} />
      <Footer />
    </div>
  )
}

export default page
