"use client"
import React, { useState, ChangeEvent, useEffect } from "react"
import { Plus, X, User, Phone, FileText, Briefcase } from "lucide-react"

import { GuideDetailsType } from "@/utils/Types"
import { Textarea } from "../ui/textarea"
import axios from "axios"
import { Form } from "react-hook-form"

// Define types for our data structures
interface Language {
  id: number
  language: string
}

interface District {
  id: number
  districtId: string
  name: string
}

interface FormData {
  fullName: string
  contact: string
  aboutMe: string
  experiences: string[]
}

interface GeneralSettingProps {
  guideDetails: GuideDetailsType | null
  onSuccessHandler: () => void
}

const GeneralSetting: React.FC<GeneralSettingProps> = ({
  guideDetails,
  onSuccessHandler,
}) => {
  // Initial form data
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    contact: "",
    aboutMe: "",
    experiences: [""],
  })
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  // Handle text input changes
  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

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
      myData.append("fullname", formData.fullName)
      myData.append("contact", formData.contact)
      myData.append("aboutMe", formData.aboutMe)
      myData.append("experiences", JSON.stringify(formData.experiences))
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
    if (guideDetails) {
      setFormData({
        fullName: guideDetails.fullname || "",
        contact: guideDetails.contact || "",
        aboutMe: guideDetails.aboutMe || "",
        experiences: guideDetails.experiences || [""],
      })
    }
  }, [guideDetails])

  useEffect(() => {
    setTimeout(() => {
      setSuccessMessage("")
      setErrorMessage("")
    }, 5000)
  }, [successMessage, errorMessage])

  return (
    <div className="w-full mx-auto p-6  ">
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-semibold">General Settings</h1>
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

      {/* Form Fields */}

      <div className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="block text-text-primary font-medium">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.fullName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("fullName", e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <label className="block text-text-primary font-medium">
              Contact
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.contact}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("contact", e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your contact number"
              />
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>
          </div>
        </div>

        {/* About Me */}
        <div className="space-y-2">
          <label className="block text-text-primary font-medium">
            About Me
          </label>
          <div className="relative">
            <Textarea
              value={formData.aboutMe}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange("aboutMe", e.target.value)
              }
              rows={10}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
              placeholder="Tell us about yourself, your experience and skills"
            ></Textarea>
            <FileText className="absolute left-3 top-4 text-gray-500 w-5 h-5" />
          </div>
        </div>

        {/* Experiences */}
        <div className="space-y-3">
          <label className="block text-text-primary font-medium">
            Experiences
          </label>

          {formData?.experiences.map((exp, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={exp}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleArrayInput("experiences", index, e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add your experience"
                />
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
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
            className="flex items-center space-x-2 text-primary-dark hover:text-primary-darker"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </button>
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
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default GeneralSetting
