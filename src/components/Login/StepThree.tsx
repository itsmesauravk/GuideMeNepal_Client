import React from "react"
import { FileText, Plus, X } from "lucide-react"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { GuideRegisterForm } from "@/utils/Types"
import { ArrayField, InputChangeEvent } from "./GuideRegister"

interface StepThreeProps {
  formData: GuideRegisterForm
  handleInputChange: (e: InputChangeEvent) => void
  handleArrayInput: (field: ArrayField, index: number, value: string) => void
  addArrayField: (field: ArrayField) => void
  removeArrayField: (field: ArrayField, index: number) => void
}

const StepThree: React.FC<StepThreeProps> = ({
  formData,
  handleInputChange,
  handleArrayInput,
  addArrayField,
  removeArrayField,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-text-primary font-medium mb-2">
          About Me
        </label>
        <Textarea
          name="aboutMe"
          value={formData.aboutMe}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-background-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary bg-background-secondary min-h-[150px]"
          placeholder="Tell us about yourself..."
        />
      </div>

      <div className="space-y-3">
        <label className="block text-text-primary font-medium">
          Experience
        </label>
        {formData.experiences.map((exp, index) => (
          <div key={index} className="flex space-x-2">
            <div className="relative flex-1">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
              <Input
                type="text"
                value={exp}
                onChange={(e) =>
                  handleArrayInput("experiences", index, e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 border border-background-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary bg-background-secondary"
                placeholder="Experience"
              />
            </div>
            {formData.experiences.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayField("experiences", index)}
                className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayField("experiences")}
          className="flex items-center space-x-2 text-primary hover:text-primary-dark"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>
    </div>
  )
}

export default StepThree
