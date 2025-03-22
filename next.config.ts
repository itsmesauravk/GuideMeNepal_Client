import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "res.cloudinary.com",
      "via.placeholder.com", // Added for placeholder images
    ],
  },
}

export default nextConfig
