import type { NextConfig } from "next"


const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "res.cloudinary.com",
      "via.placeholder.com", // Added for placeholder images
      "lh3.googleusercontent.com", // Added for Google profile images
      "cdn.discordapp.com", // Added for Discord profile images
      "images.unsplash.com", // Added for Unsplash images
    ],
  },

}

export default nextConfig
