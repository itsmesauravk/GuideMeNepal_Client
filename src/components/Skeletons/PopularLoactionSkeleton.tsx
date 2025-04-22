import React from "react"

const PopularLoactionSkeleton = () => {
  return (
    <div className="w-36 h-48 rounded-xl overflow-hidden shadow-lg bg-white">
      <div className="relative h-full bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
        <div className="absolute bottom-4 left-2 w-24 h-6 bg-gray-300 rounded-md animate-pulse" />
      </div>
    </div>
  )
}

export default PopularLoactionSkeleton
