"use client"
import { Tag, Users, Shield } from "lucide-react"

const Features = () => {
  const features = [
    {
      id: 1,
      title: "All Tours Customizable",
      description: "Start By Messaging Your Guide",
      icon: Tag,
      color: "bg-red-100",
      iconColor: "text-red-500",
    },
    {
      id: 2,
      title: "100% Private Tours",
      description: "Just You and Your Local Tour Guide",
      icon: Users,
      color: "bg-blue-100",
      iconColor: "text-blue-500",
    },
    {
      id: 3,
      title: "Quality Assured Guides",
      description: "Screened and Verified via Interviews",
      icon: Shield,
      color: "bg-green-100",
      iconColor: "text-green-500",
    },
  ]

  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="container max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${feature.color}`}>
                <feature.icon size={24} className={feature.iconColor} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Features
