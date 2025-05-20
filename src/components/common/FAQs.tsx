"use client"
import React, { useState } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import Link from "next/link"

const FAQs = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    if (openFaq === index) {
      setOpenFaq(null)
    } else {
      setOpenFaq(index)
    }
  }

  const faqs = [
    {
      question: "What is GoWithGuide?",
      answer:
        "GoWithGuide is a platform connecting travelers with local guides around Nepal. We offer authentic experiences led by knowledgeable local guides who provide personalized tours tailored to your interests and preferences.",
    },
    {
      question: "Why should I choose GoWithGuide over other tour operators?",
      answer:
        "We focus on authentic local experiences with verified guides who are passionate about sharing their knowledge and culture. Our platform allows direct communication with guides, customizable tours, transparent pricing, and a secure booking process, ensuring a unique and memorable travel experience.",
    },
    {
      question: "How do I book a tour?",
      answer:
        "Booking a tour is simple! Browse our available tours, select the one you're interested in, choose your preferred date and number of participants, and proceed to checkout. You can also message guides directly to customize a tour before booking.",
    },
    {
      question: "Can I customize any of the tours published?",
      answer:
        "Absolutely! Most of our guides are flexible and happy to customize tours to match your preferences. You can message the guide directly before booking to discuss any modifications to the itinerary, duration, or special requests.",
    },
    {
      question: "Are tours priced per person or per group?",
      answer:
        "Tour pricing varies by guide and tour type. Most tours are priced per group (up to a specified number of participants), but some may be priced per person. The pricing structure is clearly indicated on each tour page.",
    },
    {
      question: "How can I trust the guides and what is offered?",
      answer:
        "All guides on our platform go through a verification process. We check their credentials, experience, and knowledge. Additionally, each guide has a profile with reviews from previous travelers. You can read these testimonials to gauge their reliability and service quality before booking.",
    },
    {
      question: "What is GoWithGuide cancellation policy?",
      answer:
        "Our standard cancellation policy allows free cancellation up to 48 hours before the tour start time for a full refund. Cancellations within 48 hours may be subject to fees. Some tours may have specific policies, which will be clearly stated on the tour page before booking.",
    },
    {
      question: "Can I message a guide before purchasing a tour?",
      answer:
        "Yes! We encourage direct communication with guides before booking. You can ask questions about the tour, request customizations, or discuss specific requirements to ensure the experience meets your expectations.",
    },
    {
      question: "I am a guide, how do I register on GoWithGuide?",
      answer:
        "We're always looking for passionate local guides! Visit our 'Become a Guide' page to start the registration process. You'll need to complete a profile, submit your credentials for verification, and create your tour offerings.",
    },
    {
      question:
        "Does the tour include meals, transportation fees, tickets to sightseeing spots etc?",
      answer:
        "Inclusions vary by tour. Each tour page clearly lists what is included and excluded in the price. Some tours include all entrance fees, transportation, and meals, while others may have additional costs. Always check the 'What's Included' section before booking.",
    },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our services, booking
            process, and more.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="mb-16 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-4 border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full flex justify-between items-center p-5 bg-white text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.question}</span>
                {openFaq === index ? (
                  <ChevronUpIcon className="h-5 w-5 text-primary-dark" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-primary-dark" />
                )}
              </button>

              {openFaq === index && (
                <div className="p-5 bg-white border-t border-gray-200">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still need help section */}
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Please contact our support
            team.
          </p>
          <Link
            href="/help"
            className="inline-flex items-center px-6 py-3 bg-primary-dark text-white rounded-md hover:bg-primary-darker transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FAQs
