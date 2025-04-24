import React from "react"
import { Shield, Star } from "lucide-react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

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
  averageRating?: number
  totalReviews?: number
}

interface GuideCardProps {
  details: GuideDetails
  onProfileClick?: () => void
}

const GuideCard: React.FC<GuideCardProps> = ({ details, onProfileClick }) => {
  // Validate rating is between 0 and 5

  // Default values for required fields
  const safeDetails = {
    name: details?.fullname || "Guide Name Unavailable",
    slug: details?.slug || "guide-name-unavailable",
    guidingArea: details?.guidingAreas || [],

    rating: details?.averageRating || 0,
    reviews: details?.totalReviews || 0,
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

  // return (
  //   <Link href={`/guides/${safeDetails.slug}`}>
  //     <Card className="w-72 max-w-sm h-[380px] hover:cursor-pointer">
  //       <div className="relative">
  //         <img
  //           src={safeDetails?.imageUrl || "/images/user.webp"}
  //           alt={`${safeDetails.name} - Guide Image`}
  //           className="w-full h-64 object-cover rounded-t-lg"
  //         />
  //         {safeDetails.verified && (
  //           <Badge className="absolute top-4 right-4 bg-primary-dark hover:bg-primary-dark">
  //             Verified Guide
  //           </Badge>
  //         )}
  //       </div>

  //       <CardHeader className="space-y-1 pt-4">
  //         <div className="w-full flex gap-2 justify-between items-start">
  //           <div>
  //             <h3 className="font-semibold text-lg text-gray-900">
  //               {safeDetails.name}
  //             </h3>
  //             <p className="w-full   text-sm text-gray-600">
  //               {safeDetails.languages.join(", ")}
  //             </p>
  //           </div>
  //           <div className="flex items-center">
  //             <Star size={16} fill="currentColor" className="text-yellow-400" />
  //             <span className="ml-2 text-sm text-gray-500">
  //               {safeDetails.rating.toFixed(1)}
  //             </span>

  //             <span className="ml-2 text-sm text-gray-500">
  //               ({safeDetails.reviews})
  //             </span>
  //           </div>
  //         </div>
  //       </CardHeader>

  //       <CardContent>
  //         <div className="flex flex-wrap gap-2">
  //           {safeDetails.guidingArea.map((area, index) => (
  //             <Badge key={index} variant="secondary" className="text-xs">
  //               {area}
  //             </Badge>
  //           ))}
  //         </div>
  //       </CardContent>

  //       <CardContent>
  //         <p className="text-sm text-gray-600">
  //           {safeDetails.bio.split(" ").slice(0, 20).join(" ") + "..."}
  //         </p>
  //       </CardContent>
  //     </Card>
  //   </Link>
  // )

  return (
    <Link href={`/guides/${safeDetails.slug}`}>
      <Card className="w-full sm:w-56 lg:w-72 max-w-full h-auto hover:cursor-pointer transition-all duration-200 hover:shadow-md">
        <div className="relative">
          <Image
            src={safeDetails?.imageUrl || "/images/user.webp"}
            alt={`${safeDetails.name} - Guide Image`}
            className="w-full h-48 sm:h-64 object-cover rounded-t-lg"
            width={400}
            height={256}
          />
          {safeDetails.verified && (
            <Badge className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-primary-dark hover:bg-primary-dark text-xs sm:text-sm">
              Verified Guide
            </Badge>
          )}
        </div>

        <CardHeader className="space-y-1 pt-3  px-3 sm:px-2 sm:pt-1">
          <div className="w-full flex flex-col sm:flex-row gap-1 sm:gap-1 justify-between items-start">
            <div>
              <h3 className="font-semibold text-base sm:text-xs lg:text-lg text-gray-900 line-clamp-1">
                {safeDetails.name}
              </h3>
              <p className="w-full text-xs sm:text-sm text-gray-600 line-clamp-1">
                {safeDetails.languages.join(", ")}
              </p>
            </div>
            <div className="flex items-center mt-1 sm:mt-0">
              <Star size={16} fill="currentColor" className="text-yellow-400" />
              <span className="ml-1 text-xs sm:text-sm text-gray-500">
                {safeDetails.rating.toFixed(1)}
              </span>
              <span className="ml-1 text-xs sm:text-sm text-gray-500">
                ({safeDetails.reviews})
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="py-2 px-3 sm:px-2 sm:py-1">
          <div className="flex flex-wrap gap-1 sm:gap-1">
            {safeDetails.guidingArea.map((area, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs py-0.5 px-2"
              >
                {area}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardContent className="py-2 px-3 sm:px-2 sm:py-1">
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-3">
            {safeDetails.bio.split(" ").slice(0, 20).join(" ") + "..."}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default GuideCard
