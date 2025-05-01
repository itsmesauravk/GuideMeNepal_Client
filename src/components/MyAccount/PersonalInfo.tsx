"use client"
import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { User, Mail, Phone, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { SessionData } from "@/utils/Types"
import { useRouter } from "next/navigation"
import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import CountryCode from "../../utils/CountryCode.json"
import axios from "axios"

interface personalInfoInterface {
  fullName: string
  email: string
  contact?: string
  gender?: string
  dob?: string
  country?: string
}

const PersonalInfo = () => {
  const [formData, setFormData] = useState<personalInfoInterface>({
    fullName: "",
    email: "",
    contact: "",
    gender: "",
    dob: "",
    country: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({
    type: "",
    text: "",
  })

  const router = useRouter()
  const { data: sessionData } = useSession()
  const session = sessionData as unknown as SessionData

  const userId = session?.user?.id

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const getUserData = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/client/my-profile/${userId}`
    )

    const data = response.data
    if (data.success) {
      console.log(data.data)
      setFormData({
        fullName: data.data.fullName || "",
        email: data.data.email || "",
        gender: data.data.gender || "",
        contact: data.data.contact || "",
        country: data.data.country || "",
        dob: data.data.dob || "",
      })
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/client/update-profile/${userId}`,
        formData
      )
      const data = response.data
      if (data.success) {
        setMessage({
          type: "success",
          text: "Profile updated successfully!",
        })
        setTimeout(() => {
          router.push("/my-account")
        }, 2000)
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to update profile.",
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getUserData()
  }, [userId])

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with back button */}
      <div className="mb-8">
        <div
          className="inline-flex items-center text-primary-dark hover:text-primary-darker mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Account
        </div>
        <h1 className="text-3xl font-bold text-primary-dark">
          Personal Information
        </h1>
        <p className="text-gray-600 mt-2">Update your personal details</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          {/* Status message */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-md ${
                message.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              <strong>
                {message.type === "success" ? "Success!" : "Error!"}
              </strong>{" "}
              {message.text}
            </div>
          )}

          {/* Full Name */}
          <div className="mb-6">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Email (Read-only) */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address (Read-only)
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                className="pl-10 w-full rounded-md border-gray-300 bg-gray-50 shadow-sm cursor-not-allowed"
                readOnly
              />
            </div>
          </div>

          {/* country  */}
          {/* Full Name */}
          <div className="mb-6">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Country
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                placeholder="Enter your country"
                required
              />
            </div>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Number
            </label>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                type="tel"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                placeholder="Enter your contact number"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="mb-6">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Gender
            </label>

            <Select
              value={formData.gender}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, gender: value }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer_not_to_say">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date of Birth */}
          <div className="mb-6">
            <label
              htmlFor="dob"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date of Birth
            </label>
            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PersonalInfo
