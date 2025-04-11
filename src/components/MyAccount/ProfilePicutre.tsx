"use client"
import React, { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Camera, Upload, ArrowLeft, UserCircle, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { SessionData } from "@/utils/Types"
import { useRouter } from "next/navigation"

const ProfilePicture = () => {
  const { data: sessionData } = useSession()
  const session: SessionData = sessionData as unknown as SessionData

  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const router = useRouter()

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (session && session.user && session.user.image) {
      setProfileImage(session.user.image)
    }
  }, [session])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage({ type: "", text: "" })

    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.includes("image/")) {
      setMessage({ type: "error", text: "Please upload an image file" })
      return
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size must be less than 2MB" })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.length) {
      setMessage({ type: "error", text: "Please select an image to upload" })
      return
    }

    setIsUploading(true)
    setMessage({ type: "", text: "" })

    const formData = new FormData()
    formData.append("profilePicture", fileInputRef.current.files[0])

    try {
      // Example API call - replace with your actual endpoint
      const response = await fetch("/api/user/upload-profile-image", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setProfileImage(data.imageUrl)
        setPreviewImage(null)
        setMessage({
          type: "success",
          text: "Profile picture updated successfully!",
        })

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        const error = await response.json()
        setMessage({
          type: "error",
          text: error.message || "Failed to upload profile picture",
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with back button */}
      <div className="mb-8">
        <div
          onClick={() => router.back()}
          className="inline-flex items-center text-primary-dark hover:text-primary-darker mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Account
        </div>
        <h1 className="text-3xl font-bold text-primary-dark">
          Profile Picture
        </h1>
        <p className="text-gray-600 mt-2">
          Upload or update your profile picture
        </p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Status message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Current Profile Picture */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Current Profile Picture</h2>
          <div className="flex justify-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <UserCircle size={120} className="text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Upload New Picture */}
        <div>
          <h2 className="text-lg font-medium mb-4">Upload New Picture</h2>

          {/* Image Preview */}
          {previewImage && (
            <div className="mb-6">
              <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden bg-gray-100">
                <Image
                  src={previewImage}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none"
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}

          {/* File Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Image
            </label>
            <div className="flex items-center">
              <label className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                <Camera size={18} className="mr-2 text-gray-500" />
                Choose File
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </label>
              <span className="ml-3 text-sm text-gray-500">
                JPG, PNG or GIF (max 2MB)
              </span>
            </div>
          </div>

          {/* Upload Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || !previewImage}
              className={`flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors ${
                isUploading || !previewImage
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isUploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <Upload size={18} className="mr-2" />
                  Upload Image
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePicture
