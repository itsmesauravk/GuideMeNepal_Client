import React, { useState } from "react"
import { Languages, MapPin, Plus, X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "../ui/select"

import { GuideRegisterForm } from "@/utils/Types"
import { ArrayField } from "./GuideRegister"
import LanguagesList from "../../utils/Languages.json"
import DistrictName from "../../utils/CitiesNames.json"

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
  const [languageNote, setLanguageNote] = useState(
    "Your first language selection should be your native language."
  )
  const [districtNote, setDistrictNote] = useState(
    "The first district selection will be considered your primary guiding location."
  )

  return (
    <div className="space-y-6">
      {/* Languages Section */}
      <div className="space-y-3">
        <label className="block text-text-primary font-medium">Languages</label>

        {/* Language Note */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3">
          <p className="text-blue-800 text-sm">{languageNote}</p>
        </div>

        {formData.languages.map((lang, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <div className="relative flex-1">
              <Select
                value={lang}
                onValueChange={(value) =>
                  handleArrayInput("languages", index, value)
                }
              >
                <SelectTrigger className="w-full pl-10 pr-4 py-3">
                  <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Languages</SelectLabel>
                    {LanguagesList.map((language) => (
                      <SelectItem
                        key={language.id}
                        value={language.language}
                        disabled={
                          index === 0
                            ? false
                            : formData.languages.includes(language.language)
                        }
                      >
                        {language.language}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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

      {/* Guiding Areas Section */}
      <div className="space-y-3">
        <label className="block text-text-primary font-medium">
          Guiding Areas
        </label>

        {/* District Note */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3">
          <p className="text-blue-800 text-sm">{districtNote}</p>
        </div>

        {formData.guidingAreas.map((area, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <div className="relative flex-1">
              <Select
                value={area}
                onValueChange={(value) =>
                  handleArrayInput("guidingAreas", index, value)
                }
              >
                <SelectTrigger className="w-full pl-10 pr-4 py-3">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Districts</SelectLabel>
                    {DistrictName.map((district) => (
                      <SelectItem
                        key={district.id}
                        value={district.districtId}
                        disabled={
                          index === 0
                            ? false
                            : formData.guidingAreas.includes(district.name)
                        }
                      >
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
