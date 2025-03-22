import React from "react"
import { User, Mail, Phone } from "lucide-react"
import { Input } from "../ui/input"
import { GuideRegisterForm } from "@/utils/Types"
import { InputChangeEvent } from "./GuideRegister"

interface StepOneProps {
  formData: GuideRegisterForm
  handleInputChange: (e: InputChangeEvent) => void
  handleGuideTypeChange: (type: string) => void
}

const StepOne: React.FC<StepOneProps> = ({
  formData,
  handleInputChange,
  handleGuideTypeChange,
}) => {
  const guideTypeOptions = [
    "City Guide",
    "Mountain Guide",
    "Trekking Guide",
    "Cultural Guide",
    "Adventure Guide",
  ]

  return (
    <div className="space-y-6">
      <div className="relative">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
        <Input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-3 border border-background-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary bg-background-secondary"
          placeholder="Full Name"
        />
      </div>

      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-3 border border-background-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary bg-background-secondary"
          placeholder="Email"
        />
      </div>

      <div className="relative">
        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
        <Input
          type="number"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-3 border border-background-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary bg-background-secondary"
          placeholder="Contact Number"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-text-primary font-medium">
          Type of Guide
        </label>
        <div className="grid grid-cols-2 gap-3">
          {guideTypeOptions.map((type) => (
            <label
              key={type}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Input
                type="checkbox"
                checked={formData.guideTypes.includes(type)}
                onChange={() => handleGuideTypeChange(type)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-text-primary">{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StepOne
