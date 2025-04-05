import React from "react"
import { Shield, Star } from "lucide-react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface GuideDetails {
  fullname: string
  slug: string
  guidingAreas?: string[]
  guidingLocation?: string[]
  rating: number
  reviews: number
  languageSpeak: string[]
  verified: boolean
  profilePhoto?: string
  aboutMe?: string
}

interface GuideCardProps {
  details: GuideDetails
  onProfileClick?: () => void
}

const GuideCard: React.FC<GuideCardProps> = ({ details, onProfileClick }) => {
  // Validate rating is between 0 and 5
  const validRating = Math.min(Math.max(details?.rating || 0, 0), 5)

  // Default values for required fields
  const safeDetails = {
    name: details?.fullname || "Guide Name Unavailable",
    slug: details?.slug || "guide-name-unavailable",
    guidingArea: details?.guidingAreas || [],

    rating: validRating,
    reviews: details?.reviews || 0,
    languages: details?.languageSpeak || [],
    verified: details?.verified || false,
    imageUrl: details?.profilePhoto || "/api/placeholder/400/256",
    bio: details?.aboutMe || "Bio Unavailable",
  }

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick()
    }
  }

  return (
    <Link href={`/guides/${safeDetails.slug}`}>
      <Card className="w-72 max-w-sm h-[380px] hover:cursor-pointer">
        <div className="relative">
          <img
            src={safeDetails?.imageUrl || "/images/user.webp"}
            alt={`${safeDetails.name} - Guide Image`}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          {safeDetails.verified && (
            <Badge className="absolute top-4 right-4 bg-primary-dark hover:bg-primary-dark">
              Verified Guide
            </Badge>
          )}
        </div>

        <CardHeader className="space-y-1 pt-4">
          <div className="w-full flex gap-2 justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {safeDetails.name}
              </h3>
              <p className="w-full   text-sm text-gray-600">
                {safeDetails.languages.join(", ")}
              </p>
            </div>
            <div className="flex items-center">
              <Star size={16} fill="currentColor" className="text-yellow-400" />
              <span className="ml-2 text-sm text-gray-500">
                {safeDetails.rating.toFixed(1)}
              </span>

              <span className="ml-2 text-sm text-gray-500">
                ({safeDetails.reviews})
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2">
            {safeDetails.guidingArea.map((area, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {area}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardContent>
          <p className="text-sm text-gray-600">
            {safeDetails.bio.split(" ").slice(0, 20).join(" ") + "..."}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default GuideCard
