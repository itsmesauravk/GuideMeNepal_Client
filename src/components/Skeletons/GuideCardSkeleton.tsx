import React from "react"

// GuideCardSkeleton component
const GuideCardSkeleton = () => {
  return (
    <div className="w-full sm:w-72 max-w-full sm:max-w-sm h-auto sm:h-[380px] animate-pulse rounded-lg bg-white border border-gray-200">
      {/* Image placeholder */}
      <div className="w-full h-48 sm:h-64 bg-gray-200 rounded-t-lg" />

      {/* Header content */}
      <div className="p-3 sm:p-6 pt-3 sm:pt-4">
        <div className="w-full flex flex-col sm:flex-row gap-1 sm:gap-2 justify-between items-start">
          {/* Guide name and languages */}
          <div className="space-y-2 w-3/4">
            <div className="h-5 sm:h-6 bg-gray-200 rounded-md" />
            <div className="h-3 sm:h-4 bg-gray-200 rounded-md w-4/5" />
          </div>

          {/* Rating */}
          <div className="flex items-center mt-1 sm:mt-0 w-1/4">
            <div className="h-4 w-16 sm:w-20 bg-gray-200 rounded-md" />
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="px-3 sm:px-6 py-2">
        <div className="flex flex-wrap gap-1 sm:gap-2">
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
          <div className="h-5 w-20 bg-gray-200 rounded-full" />
          <div className="h-5 w-14 bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* Bio */}
      <div className="px-3 sm:px-6 py-2">
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded-md" />
          <div className="h-3 bg-gray-200 rounded-md" />
          <div className="h-3 bg-gray-200 rounded-md w-4/5" />
        </div>
      </div>
    </div>
  )
}

export default GuideCardSkeleton
