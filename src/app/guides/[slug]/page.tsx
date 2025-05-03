import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"
import SingleGuideView from "@/components/Guides/SingleGuideView"

import React from "react"
import { Metadata } from "next"

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/guide/single-guide-details/${slug}`
    )
    const data = await response.json()

    if (data.success && data.data) {
      const guideData = data.data
      return {
        title: `${guideData.fullname} - Guide Me Nepal`,
        description: `Explore the profile of ${guideData.fullname}, a verified guide in ${guideData.guidingAreas[0]}. Discover their experiences, reviews, and more.`,
        openGraph: {
          title: `${guideData.fullname} - Professional Guide in ${guideData.guidingAreas[0]}`,
          description: `Explore the profile of ${guideData.fullname}, a verified guide in ${guideData.guidingAreas[0]}. Discover their experiences, reviews, and more.`,
          type: "profile",
          images: [
            {
              url: guideData.profilePhoto || "/images/default_user.avif",
              width: 800,
              height: 600,
              alt: `${guideData.fullname} - Nepal Guide`,
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: `${guideData.fullname} - Guide Me Nepal`,
          description: `Professional guide in ${guideData.guidingAreas.join(
            ", "
          )}`,
          images: [guideData.profilePhoto || "/images/default_user.avif"],
        },
      }
    }

    // Return default metadata if no guide data
    return {
      title: "Guide Profile - Guide Me Nepal",
      description: "Explore profiles of verified guides in Nepal",
    }
  } catch (error) {
    console.error("Error fetching guide details:", error)
    // Return fallback metadata in case of error
    return {
      title: "Guide Profile - Guide Me Nepal",
      description: "Explore profiles of verified guides in Nepal",
    }
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <div className="w-full">
      <Navbar />
      <SingleGuideView slug={slug} />
      <Footer />
    </div>
  )
}
