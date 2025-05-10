"use client"
import React, { useState, useEffect } from "react"
import { Check, X } from "lucide-react"
import axios from "axios"
import { GuideDetailsType } from "@/utils/Types"

import { Switch } from "@heroui/switch"

interface OtherSettingProps {
  guideDetails: GuideDetailsType | null
  onSuccessHandler: () => void
}

const OtherSetting: React.FC<OtherSettingProps> = ({
  guideDetails,
  onSuccessHandler,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (guideDetails) {
      setIsActive(guideDetails?.availability?.isActivate)
    }
  }, [guideDetails])

  // Handle activity status change
  const handleActivityToggle = async () => {
    if (!guideDetails) return

    try {
      setLoading(true)
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/update/${guideDetails.id}`,
        {
          isActivate: !isActive,
        }
      )

      const data = response.data
      if (data.success) {
        setSuccessMessage(
          data.message ||
            `Profile ${!isActive ? "activated" : "deactivated"} successfully`
        )
        setErrorMessage("")
        onSuccessHandler()
      } else {
        setErrorMessage(data.message || "Failed to update status")
        setSuccessMessage("")
      }
    } catch (error: any) {
      console.error("Error while updating:", error)
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while updating profile"
      )
    } finally {
      setLoading(false)
    }
  }

  // Clear messages after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage("")
      setErrorMessage("")
    }, 5000)

    return () => clearTimeout(timer)
  }, [successMessage, errorMessage])

  return (
    <div className="w-full mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Account Settings</h1>

      {/* Success and Error Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md flex items-center">
          <Check className="w-5 h-5 mr-2" />
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md flex items-center">
          <X className="w-5 h-5 mr-2" />
          {errorMessage}
        </div>
      )}

      {/* Activity Status Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6 border border-gray-100">
        <h2 className="text-lg font-medium mb-4">Activity Status</h2>

        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="space-y-2 mb-4 md:mb-0 md:pr-4 md:max-w-lg">
            <p className="text-gray-700">
              Control your availability on the platform. When deactivated, your
              profile will not be shown to users and you won't receive any
              requests.
            </p>

            <p className="text-sm text-gray-500 ">
              Note: You cannot turn off when you have active bookings or trip on
              going.
            </p>
          </div>

          <div className="flex flex-col items-center">
            {guideDetails?.availability?.isActivate ? (
              <Switch
                isSelected={isActive}
                onChange={handleActivityToggle}
                color="success"
              >
                {isActive ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-gray-500">Inactive</span>
                )}
              </Switch>
            ) : (
              <p className="text-red-500">You have ongoing booking.</p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h2>

        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="space-y-2 mb-4 md:mb-0">
            <p className="text-gray-700">
              Permanently delete your account and all associated data
            </p>
            <p className="text-sm text-gray-500">
              This action cannot be undone. All your personal data will be
              removed from our system.
            </p>
          </div>

          <button className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
            Delete Account
          </button>
        </div>
      </div>

      {/* Account Information Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Account Information</h2>

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-100">
            <span className="font-medium text-gray-700">Account ID:</span>
            <span className="text-gray-600">
              {guideDetails?.id || "Not available"}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-100">
            <span className="font-medium text-gray-700">Email:</span>
            <span className="text-gray-600">
              {guideDetails?.email || "Not available"}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-100">
            <span className="font-medium text-gray-700">Account Type:</span>
            <span className="text-gray-600">Guide</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between py-2">
            <span className="font-medium text-gray-700">Member Since:</span>
            <span className="text-gray-600">
              {guideDetails?.createdAt
                ? new Date(guideDetails.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Not available"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OtherSetting
