"use client"
import React, { useState, useEffect, ChangeEvent } from "react"
import { Languages, MapPin, Plus, X } from "lucide-react"
import LanguagesList from "../../utils/Languages.json"
import DistrictName from "../../utils/CitiesNames.json"
import { GuideDetailsType } from "@/utils/Types"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "../ui/select"
import axios from "axios"

interface FormData {
  guideTypes: string[]
  languageSpeak: string[]
  guidingAreas: string[]
}

interface GuidingSettingProps {
  guideDetails: GuideDetailsType | null
  onSuccessHandler: () => void
}

const GuidingSetting: React.FC<GuidingSettingProps> = ({
  guideDetails,
  onSuccessHandler,
}) => {
  // Initial form data
  const [formData, setFormData] = useState<FormData>({
    guideTypes: guideDetails?.guideType || [],
    languageSpeak: guideDetails?.languageSpeak || [""],
    guidingAreas: guideDetails?.guidingAreas || [""],
  })

  const [successMessage, setSuccessMessage] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  // Update form data when guideDetails changes
  useEffect(() => {
    if (guideDetails) {
      setFormData({
        guideTypes: guideDetails.guideType || [],
        languageSpeak: guideDetails.languageSpeak || [""],
        guidingAreas: guideDetails.guidingAreas || [""],
      })
    }
  }, [guideDetails])

  // Guide type options
  const guideTypeOptions: string[] = [
    "City Guide",
    "Mountain Guide",
    "Trekking Guide",
    "Cultural Guide",
    "Adventure Guide",
  ]

  // Handle array field updates
  const handleArrayInput = (
    field: keyof FormData,
    index: number,
    value: string
  ): void => {
    if (Array.isArray(formData[field])) {
      const newArray = [...(formData[field] as string[])]
      newArray[index] = value
      setFormData({
        ...formData,
        [field]: newArray,
      })
    }
  }

  // Add new field to arrays
  const addArrayField = (field: keyof FormData): void => {
    if (Array.isArray(formData[field])) {
      setFormData({
        ...formData,
        [field]: [...(formData[field] as string[]), ""],
      })
    }
  }

  // Remove field from arrays
  const removeArrayField = (field: keyof FormData, index: number): void => {
    if (Array.isArray(formData[field])) {
      const newArray = [...(formData[field] as string[])]
      newArray.splice(index, 1)
      setFormData({
        ...formData,
        [field]: newArray,
      })
    }
  }

  // Handle guide type checkboxes
  const handleGuideTypeChange = (type: string): void => {
    if (formData.guideTypes.includes(type)) {
      setFormData({
        ...formData,
        guideTypes: formData.guideTypes.filter((item) => item !== type),
      })
    } else {
      setFormData({
        ...formData,
        guideTypes: [...formData.guideTypes, type],
      })
    }
  }

  // Notes for user guidance
  const [languageNote] = useState<string>(
    "Your first language selection should be your native language."
  )

  const [districtNote] = useState<string>(
    "The first district selection will be considered your primary guiding location."
  )

  // Submit handler
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!guideDetails) {
      setErrorMessage("Guide details not available")
      return
    }

    try {
      setLoading(true)
      const myData = new FormData()
      myData.append("guideType", JSON.stringify(formData.guideTypes))
      myData.append("languageSpeak", JSON.stringify(formData.languageSpeak))
      myData.append("guidingAreas", JSON.stringify(formData.guidingAreas))
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/update/${guideDetails?.id}`,
        myData
      )
      const data = response.data
      if (data.success) {
        setSuccessMessage(data.message || "Profile updated successfully")
        setErrorMessage("")
        onSuccessHandler()
      } else {
        setErrorMessage(data.message || "Failed to update profile")
        setSuccessMessage("")
      }
    } catch (error) {
      console.error("Error fetching guide details:", error)
      setErrorMessage("An error occurred while updating the profile")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setSuccessMessage("")
      setErrorMessage("")
    }, 5000)
  }, [successMessage, errorMessage])

  return (
    <div className="w-full mx-auto p-6">
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-semibold">Guiding Settings</h1>
      </div>
      {/* Success and Error Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}
      <div className="space-y-6">
        {/* Guide Types */}
        <div className="space-y-3">
          <label className="block text-text-primary font-semibold">
            Type of Guide
          </label>
          <div className="grid grid-cols-2 gap-3">
            {guideTypeOptions.map((type) => (
              <label
                key={type}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.guideTypes.includes(type)}
                  onChange={() => handleGuideTypeChange(type)}
                  className="w-4 h-4 text-primary-dark"
                />
                <span className="text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-10">
          {/* Languages Section */}
          <div className="space-y-3">
            <label className="block text-text-primary font-semibold">
              Languages Spoken
            </label>

            {/* Language Note */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3">
              <p className="text-blue-800 text-sm">{languageNote}</p>
            </div>

            {formData.languageSpeak.map((lang, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <div className="relative flex-1">
                  <select
                    value={lang}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      handleArrayInput("languageSpeak", index, e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Select Language</option>
                    {LanguagesList.map((language) => (
                      <option
                        key={language.id}
                        value={language.language}
                        disabled={
                          index === 0
                            ? false
                            : formData.languageSpeak.includes(
                                language.language
                              ) && lang !== language.language
                        }
                      >
                        {language.language}
                      </option>
                    ))}
                  </select>
                  <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                </div>
                {formData.languageSpeak.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField("languageSpeak", index)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("languageSpeak")}
              className="flex items-center space-x-2 text-primary-dark hover:text-primary-darker"
            >
              <Plus className="w-4 h-4" />
              <span>Add Language</span>
            </button>
          </div>

          {/* Guiding Areas Section */}
          <div className="space-y-3">
            <label className="block text-text-primary font-semibold">
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
              className="flex items-center space-x-2 text-primary-dark hover:text-primary-darker"
            >
              <Plus className="w-4 h-4" />
              <span>Add Area</span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full bg-primary-dark text-white py-3 rounded-md hover:bg-primary-darker transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating..." : "Update Settings"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default GuidingSetting
