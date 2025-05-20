import ContactUs from "@/components/common/ContactUs"
import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"
import { LucideMessageCircleQuestion, MoveRightIcon } from "lucide-react"
import Link from "next/link"
import React from "react"

export const metadata = {
  title: "Help & Support - Guide Me Nepal",
  description:
    "Get help and support for your Guide Me Nepal account. Find answers to common questions and contact our support team.",
}

const SupportPage = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Help & Support
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Welcome to our support center. We're here to help you with any
              questions or issues you might have.
            </p>
          </div>

          {/* Support Options */}
          <div className=" mb-16">
            {/* FAQ Section */}
            <div className=" p-6 ">
              <div className="flex items-center mb-4">
                <LucideMessageCircleQuestion className="h-7 w-7 text-primary-dark mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Frequently Asked Questions
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                Find quick answers to common questions about our services,
                booking process, and more.
              </p>
              <Link
                href="/faqs"
                className="inline-flex items-center px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary-darkertransition-colors"
              >
                Browse FAQs
                <MoveRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className=" p-8 ">
            <ContactUs />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default SupportPage
