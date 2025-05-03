"use client"
import React, { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import axios from "axios"
import { GuideDetailsType } from "@/utils/Types"

interface SecuritySettingProps {
  guideDetails: GuideDetailsType | null
  onSuccessHandler: () => void
}

const SecuritySetting: React.FC<SecuritySettingProps> = ({
  guideDetails,
  onSuccessHandler,
}) => {
  // Password states
  const [oldPassword, setOldPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")

  // UI states
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  // Form validation
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Validate form
  const validateForm = () => {
    let isValid = true
    const newErrors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    }

    if (!oldPassword) {
      newErrors.oldPassword = "Current password is required"
      isValid = false
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required"
      isValid = false
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters"
      isValid = false
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password"
      isValid = false
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!guideDetails) {
      setErrorMessage("Guide details not available")
      return
    }

    if (!validateForm()) {
      setErrorMessage("Please fix the errors in the form")
      return
    }

    try {
      setLoading(true)
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/update/${guideDetails?.id}`,
        {
          password: oldPassword,
          newPassword,
        }
      )

      const data = response.data
      if (data.success) {
        setSuccessMessage(data.message || "Password updated successfully")
        setErrorMessage("")
        // Reset form
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
        onSuccessHandler()
      } else {
        setErrorMessage(data.message || "Failed to update password")
        setSuccessMessage("")
      }
    } catch (error: any) {
      console.error("Error changing password:", error)
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while changing the password"
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
      <h1 className="text-2xl font-semibold mb-6">Security Settings</h1>

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

      {/* Password Change Form */}
      <div className=" rounded-lg shadow-sm p-6 mt-6">
        <h2 className="text-lg font-medium mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          {/* Old Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-dark"
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showOldPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.oldPassword}</p>
            )}
          </div>

          {/* New Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-dark"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm New Password Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-dark"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Save Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-primary-dark text-white py-3 rounded-md hover:bg-primary-darker transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SecuritySetting
