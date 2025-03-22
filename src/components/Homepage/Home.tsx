"use client"
import {
  Bell,
  LogIn,
  Menu,
  MessageCircle,
  SearchIcon,
  Shield,
  User,
  UserPlus,
} from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import Navbar from "../common/Navbar"
import Footer from "../common/Footer"
import PopularDestinations from "./PopularDestinations"
import HowItWorks from "./HowItWorks"
import PopularGuides from "./PopularGuides"
import Features from "./Features"
import HeroSection from "./HeroSection"

const HomePage = () => {
  return (
    <div className="bg-soft-white">
      <Navbar />

      {/* Hero Section */}
      <HeroSection />
      {/* Features  */}
      <Features />
      {/* Popular Destinations */}
      <PopularDestinations />

      {/* Featured Guides */}
      <PopularGuides />
      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials */}
      <section className="testimonials py-16 bg-soft-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-charcoal-gray">
            Traveler Experiences
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-light-gray p-6 rounded-lg shadow-md">
              <p className="italic mb-4 text-charcoal-gray">
                "An incredible experience with my local guide. Truly memorable!"
              </p>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder-avatar.jpg"
                  alt="Traveler"
                  className="w-16 h-16 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-bold text-charcoal-gray">
                    Sarah Johnson
                  </h4>
                  <p className="text-charcoal-gray/70">USA</p>
                </div>
              </div>
            </div>
            {/* Placeholder for other testimonial cards */}
          </div>
        </div>
      </section>
      {/* Trust and Safety */}
      <section className="trust-safety bg-royal-blue text-soft-white py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            Your Safety, Our Priority
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <svg
                className="mx-auto mb-4 w-16 h-16 text-soft-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4-3.28 7.69-7 8.74V12H5V6.3l7-3.11v8.8z" />
              </svg>
              <h3 className="font-bold text-xl mb-4">Verified Guides</h3>
              <p>All guides are professionally certified</p>
            </div>

            <div>
              <svg
                className="mx-auto mb-4 w-16 h-16 text-soft-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-8c0 1.93-1.57 3.5-3.5 3.5S8.5 13.93 8.5 12s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5z" />
              </svg>
              <h3 className="font-bold text-xl mb-4">Secure Bookings</h3>
              <p>Safe and transparent booking process</p>
            </div>

            <div>
              <svg
                className="mx-auto mb-4 w-16 h-16 text-soft-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z" />
              </svg>
              <h3 className="font-bold text-xl mb-4">24/7 Support</h3>
              <p>We're here to help throughout your journey</p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default HomePage
