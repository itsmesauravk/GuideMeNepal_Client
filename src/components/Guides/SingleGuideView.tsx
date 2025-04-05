"use client"
import axios from "axios"
import React, { useEffect, useState } from "react"
import {
  Star,
  MapPin,
  MessageSquare,
  Clock,
  Calendar,
  CheckCircle,
} from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Button } from "../ui/button"
import GuideProfileSidebar from "./GuideProfileSidebar"
import SimilarGuides from "./SimilarGuides"

import { GuideDetailsType } from "@/utils/Types"

const SingleGuideView = ({ slug }: { slug: string }) => {
  const [guideDetails, setGuideDetails] = useState<GuideDetailsType | null>(
    null
  )
  const [loading, setLoading] = useState(true)

  const [expanded, setExpanded] = useState(false)

  const handleGetGuideDetails = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/single-guide-details/${slug}`
      )
      const data = response.data
      if (data.success) {
        setGuideDetails(data.data)
      }
    } catch (error) {
      console.error("Error fetching guide details:", error)
    } finally {
      setLoading(false)
    }
  }

  // Function to get first 100 words
  const getPreviewText = (text: string, wordLimit = 100) => {
    const words = text.split(" ")
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text
  }

  useEffect(() => {
    handleGetGuideDetails()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-medium">Loading...</div>
      </div>
    )
  }

  if (!guideDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-medium">Guide not found</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/districts">Districts</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/districts/${guideDetails.guidingAreas[0].toLowerCase()}`}
            >
              {" "}
              {guideDetails.guidingAreas[0]}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{guideDetails.fullname}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Main content */}
        <div className="md:col-span-2">
          {/* Photo gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Main profile video */}
            <div className="md:col-span-2 bg-gray-100 rounded-lg overflow-hidden relative h-64">
              {guideDetails.selfVideo && (
                <video
                  controls
                  className="w-full h-full object-cover"
                  poster={guideDetails.profilePhoto}
                >
                  <source src={guideDetails.selfVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            {/* Image gallery */}
            <div className="space-y-4">
              {/* Sample Gallery Images - Replace with actual gallery when available */}
              <div className="bg-gray-100 rounded-lg h-28 overflow-hidden">
                {guideDetails.profilePhoto && (
                  <img
                    src={guideDetails.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="bg-gray-100 rounded-lg h-28 overflow-hidden">
                {guideDetails.liscensePhoto && (
                  <img
                    src={guideDetails.liscensePhoto}
                    alt="License"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Guide Info */}
          <div className="flex items-center gap-4 border-b pb-4 mb-6">
            <div className="h-16 w-16 rounded-full overflow-hidden">
              {guideDetails.profilePhoto && (
                <img
                  src={guideDetails.profilePhoto}
                  alt={guideDetails.fullname}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {guideDetails.fullname}{" "}
                <span className="font-semibold text-green-500 text-sm">
                  (Verified)
                </span>
              </h2>
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="ml-1 font-semibold">5 / 5</span>
                <span className="ml-1 text-blue-600">
                  ({guideDetails.id} reviews)
                </span>
              </div>
              <div className="flex gap-2 mt-1">
                {guideDetails.verified && (
                  <span className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-blue-600 mr-1" />
                    Identity Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Joined {new Date(guideDetails.createdAt).getFullYear()}
              </p>
            </div>
          </div>

          {/* About Guide */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 pb-2 border-b border-red-500 inline-block">
              About {guideDetails.fullname}
            </h3>

            {guideDetails.experiences.length > 0 && (
              <div>
                <h4 className="font-bold mt-4">Experience:</h4>
                <ul className="list-disc pl-5 mb-4">
                  {guideDetails.experiences?.map((exp, index) => (
                    <li key={index}>{exp}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="mb-4">
                {expanded
                  ? guideDetails.aboutMe
                  : getPreviewText(guideDetails.aboutMe)}
              </p>

              {guideDetails.aboutMe.split(" ").length > 100 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="border border-gray-300 rounded-full px-8 py-2 mt-2 hover:bg-gray-50 transition"
                >
                  {expanded ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold mb-4 pb-2 border-b border-red-500 inline-block">
                Reviews
              </h3>
              <Button className="mt-4 bg-primary-dark hover:bg-primary-darker">
                Write a review
              </Button>
            </div>

            <p className="text-gray-600 mt-4">
              No reviews yet. Be the first to review {guideDetails.fullname}.
            </p>

            <div className="border-b pb-6 mb-6">
              {/* <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div>
                    <p className="font-bold">Sample Client</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="ml-1">5 / 5</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">Service Example</p>
                  <p className="text-sm text-gray-600">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div> */}

              {/* <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <p className="font-bold mb-2">"Great Service"</p>
                <p className="text-gray-700">
                  This would be a sample review. When you have actual reviews,
                  they will appear here.
                </p>
              </div> */}

              {/* Guide Response */}
              {/* <div className="mt-4 ml-12 bg-white p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    {guideDetails.profilePhoto && (
                      <img
                        src={guideDetails.profilePhoto}
                        alt={guideDetails.fullname}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <p className="font-bold">
                    {guideDetails.fullname}{" "}
                    <span className="font-normal text-blue-600">
                      ({guideDetails.id} reviews)
                    </span>
                  </p>
                </div>
                <p className="text-gray-700">
                  Thank you for your review! I'm glad I could help make your
                  trip enjoyable.
                </p>
              </div> */}
            </div>
          </div>
        </div>

        {/* Right column - Booking info */}
        <GuideProfileSidebar {...guideDetails} />
      </div>

      {/* Similar guides section */}

      <SimilarGuides location={guideDetails.guidingAreas[0]} />

      {/* Footer CTA */}
      <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
        <h3 className="text-xl font-bold mb-3">
          Ready to plan your trip with {guideDetails.fullname}?
        </h3>
        <p className="mb-6 max-w-lg mx-auto">
          Get personalized guidance and make your Nepal adventure unforgettable
          with a local expert who knows the region inside out.
        </p>
        <button className="bg-blue-600 text-white rounded-lg px-8 py-3 font-medium hover:bg-blue-700 transition">
          Message {guideDetails.fullname}
        </button>
      </div>
    </div>
  )
}

export default SingleGuideView
