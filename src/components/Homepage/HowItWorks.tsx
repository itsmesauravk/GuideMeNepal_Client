"use client"
import { Search, MessageCircle, Calendar } from "lucide-react"

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Search Guides",
      description: "Browse and filter guides based on your preferences",
      icon: Search,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: 2,
      title: "Connect",
      description: "Message and discuss your travel plans directly",
      icon: MessageCircle,
      color: "bg-teal-100",
      iconColor: "text-teal-600",
    },
    {
      id: 3,
      title: "Book",
      description: "Secure your adventure with trusted local guides",
      icon: Calendar,
      color: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ]

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow these simple steps to find and book your perfect local guide
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-1 w-full bg-gray-200 hidden lg:block"></div>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step) => (
              <div
                key={step.id}
                className="bg-white p-8 rounded-2xl shadow-lg -all "
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-8">
                    <div
                      className={`h-20 w-20 rounded-full ${step.color} flex items-center justify-center ${step.iconColor}`}
                    >
                      <step.icon size={32} />
                    </div>
                    <div className="absolute -top-2 -right-2 h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {step.id}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
