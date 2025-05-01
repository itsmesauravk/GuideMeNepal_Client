import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"
import React from "react"

export const metadata = {
  title: "Help & Support - Guide Me Nepal",
  description:
    "Get help and support for your Guide Me Nepal account. Find answers to common questions and contact our support team.",
}

const page = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Help & Support</h1>
        <p className="text-lg mb-4">
          Welcome to our Help & Support page! If you have any questions or need
          assistance, please refer to the following resources:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Frequently Asked Questions (FAQs)</li>
          <li className="mb-2">Contact Us</li>
          <li className="mb-2">User Guides</li>
          <li>Feedback and Suggestions</li>
        </ul>
        <p>
          If you need immediate assistance, please reach out to our support
          team.
        </p>
        <p className="mt-6 mb-6 font-semibold text-red-500">
          This will be updated in future{" "}
        </p>
      </div>
      <Footer />
    </>
  )
}

export default page
