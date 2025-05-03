"use client"
import React, { useState, useRef, ChangeEvent, useEffect } from "react"
import { Image, FileVideo, Upload, X } from "lucide-react"

import { GuideDetailsType } from "@/utils/Types"
import axios from "axios"

interface ImagesAndVideosSettingProps {
  guideDetails: GuideDetailsType | null
  onSuccessHandler: () => void
}

const ImagesAndVideosSetting: React.FC<ImagesAndVideosSettingProps> = ({
  guideDetails,
  onSuccessHandler,
}) => {
  // File states
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>("")
  const [newProfilePhotoPreview, setNewProfilePhotoPreview] =
    useState<string>("")

  const [selfVideo, setSelfVideo] = useState<File | null>(null)
  const [selfVideoPreview, setSelfVideoPreview] = useState<string>("")
  const [newSelfVideoPreview, setNewSelfVideoPreview] = useState<string>("")

  const [successMessage, setSuccessMessage] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  // Refs for file inputs
  const profilePhotoRef = useRef<HTMLInputElement | null>(null)
  const selfVideoRef = useRef<HTMLInputElement | null>(null)

  // Handle profile photo upload
  const handleProfilePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfilePhoto(file)
      setNewProfilePhotoPreview(URL.createObjectURL(file))
    }
  }

  // Handle self video upload
  const handleSelfVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelfVideo(file)
      setNewSelfVideoPreview(URL.createObjectURL(file))
    }
  }

  // Trigger file input click
  const triggerFileInput = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref.current) {
      ref.current.click()
    }
  }

  // Cancel new photo selection
  const cancelPhotoSelection = () => {
    setProfilePhoto(null)
    setNewProfilePhotoPreview("")
  }

  // Cancel new video selection
  const cancelVideoSelection = () => {
    setSelfVideo(null)
    setNewSelfVideoPreview("")
  }

  // Save changes
  const saveChanges = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!guideDetails) {
      setErrorMessage("Guide details not available")
      return
    }

    try {
      setLoading(true)
      const myData = new FormData()
      if (profilePhoto) {
        myData.append("profilePhoto", profilePhoto)
      }
      if (selfVideo) {
        myData.append("selfVideo", selfVideo)
      }
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
      setProfilePhotoPreview(guideDetails.profilePhoto || "")
      setSelfVideoPreview(guideDetails.selfVideo || "")
    }
  }, [guideDetails])

  useEffect(() => {
    setTimeout(() => {
      setSuccessMessage("")
      setErrorMessage("")
    }, 5000)
  }, [successMessage, errorMessage])

  return (
    <div className="w-full mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Media Settings</h1>

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={profilePhotoRef}
        className="hidden"
        accept="image/*"
        onChange={handleProfilePhotoChange}
      />
      <input
        type="file"
        ref={selfVideoRef}
        className="hidden"
        accept="video/*"
        onChange={handleSelfVideoChange}
      />

      {/* Profile Photo Section */}
      <div className="mb-8 mt-8">
        <h2 className="text-lg font-medium mb-4">Profile Photo</h2>

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

        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Current Profile Photo */}
          <div className="flex flex-col items-center">
            <div className="w-56 h-56 rounded-full overflow-hidden bg-gray-200 mb-2">
              {profilePhotoPreview ? (
                <img
                  src={profilePhotoPreview}
                  alt="Current profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <span className="text-sm text-gray-500 font-semibold">Current</span>
          </div>

          {/* Arrow indicator */}
          {newProfilePhotoPreview && (
            <div className="text-4xl text-primary-dark rotate-90 lg:rotate-0">
              →
            </div>
          )}

          {/* New Profile Photo (only shown when there's a new selection) */}
          {newProfilePhotoPreview && (
            <div className="flex flex-col items-center relative">
              <div className="w-56 h-56 rounded-full overflow-hidden bg-gray-200 mb-2">
                <img
                  src={newProfilePhotoPreview}
                  alt="New profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm text-gray-500 font-semibold">New</span>
              <button
                onClick={cancelPhotoSelection}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={() => triggerFileInput(profilePhotoRef)}
            className="flex items-center gap-2 bg-blue-50 text-primary-dark px-4 py-2 rounded-md ml-4 hover:bg-blue-100 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>{profilePhotoPreview ? "Change Photo" : "Upload Photo"}</span>
          </button>
        </div>
      </div>

      {/* Self Video Section - Updated to match profile photo UI */}
      <div className="mb-8 mt-8">
        <h2 className="text-lg font-medium mb-4">Introduction Video</h2>

        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Current Video */}
          <div className="flex flex-col items-center">
            <div className="w-56 h-56 rounded-lg overflow-hidden bg-gray-200 mb-2">
              {selfVideoPreview ? (
                <video
                  src={selfVideoPreview}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileVideo className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <span className="text-sm text-gray-500 font-semibold">Current</span>
          </div>

          {/* Arrow indicator */}
          {newSelfVideoPreview && (
            <div className="text-4xl text-primary-dark rotate-90 lg:rotate-0">
              →
            </div>
          )}

          {/* New Video (only shown when there's a new selection) */}
          {newSelfVideoPreview && (
            <div className="flex flex-col items-center relative">
              <div className="w-56 h-56 rounded-lg overflow-hidden bg-gray-200 mb-2">
                <video
                  src={newSelfVideoPreview}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm text-gray-500 font-semibold">New</span>
              <button
                onClick={cancelVideoSelection}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={() => triggerFileInput(selfVideoRef)}
            className="flex items-center gap-2 bg-blue-50 text-primary-dark px-4 py-2 rounded-md ml-4 hover:bg-blue-100 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>{selfVideoPreview ? "Change Video" : "Upload Video"}</span>
          </button>
        </div>
      </div>

      {/* Save Button - Only show if there are changes */}
      {(profilePhoto || selfVideo) && (
        <div className="mt-8">
          <button
            onClick={saveChanges}
            disabled={loading}
            className={`w-full bg-primary-dark text-white py-3 rounded-md hover:bg-primary-darker transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  )
}

export default ImagesAndVideosSetting
