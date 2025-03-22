import React from "react"
import { Languages, MapPin, Plus, X } from "lucide-react"
import { Input } from "../ui/input"
import { GuideRegisterForm } from "@/utils/Types"
import { ArrayField } from "./GuideRegister"

interface StepTwoProps {
  formData: GuideRegisterForm
  handleArrayInput: (field: ArrayField, index: number, value: string) => void
  addArrayField: (field: ArrayField) => void
  removeArrayField: (field: ArrayField, index: number) => void
}

const StepTwo: React.FC<StepTwoProps> = ({
  formData,
  handleArrayInput,
  addArrayField,
  removeArrayField,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="block text-text-primary font-medium">Languages</label>
        {formData.languages.map((lang, index) => (
          <div key={index} className="flex space-x-2">
            <div className="relative flex-1">
              <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
              <Input
                type="text"
                value={lang}
                onChange={(e) =>
                  handleArrayInput("languages", index, e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 border border-background-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary bg-background-secondary"
                placeholder="Language"
              />
            </div>
            {formData.languages.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayField("languages", index)}
                className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayField("languages")}
          className="flex items-center space-x-2 text-primary hover:text-primary-dark"
        >
          <Plus className="w-4 h-4" />
          <span>Add Language</span>
        </button>
      </div>

      <div className="space-y-3">
        <label className="block text-text-primary font-medium">
          Guiding Areas
        </label>
        {formData.guidingAreas.map((area, index) => (
          <div key={index} className="flex space-x-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
              <Input
                type="text"
                value={area}
                onChange={(e) =>
                  handleArrayInput("guidingAreas", index, e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 border border-background-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary bg-background-secondary"
                placeholder="Guiding Area"
              />
            </div>
            {formData.guidingAreas.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayField("guidingAreas", index)}
                className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayField("guidingAreas")}
          className="flex items-center space-x-2 text-primary hover:text-primary-dark"
        >
          <Plus className="w-4 h-4" />
          <span>Add Area</span>
        </button>
      </div>
    </div>
  )
}

export default StepTwo
