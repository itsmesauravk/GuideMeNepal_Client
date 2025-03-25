"use client"
import React from "react"

interface DistrictGuideHomeProps {
  district: string
}

const DistrictHeroSection: React.FC<DistrictGuideHomeProps> = ({
  district,
}) => {
  return (
    <div
      className="hero-section relative h-[280px] w-full bg-cover bg-center"
      style={{ backgroundImage: "url('./images/rara.jpg')" }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-soft-white text-center px-4">
        <h1 className="text-5xl font-bold mb-6 drop-shadow-lg text-white">
          Hire Trusted Guides in {district}
        </h1>
        <p className="text-xl mb-8 max-w-2xl text-white">
          Connect with certified local guides in {district} for authentic and
          unforgettable travel experiences.
        </p>
      </div>
    </div>
  )
}

export default DistrictHeroSection
