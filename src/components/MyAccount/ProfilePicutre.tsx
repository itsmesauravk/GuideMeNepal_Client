"use client"
import React, { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Camera, Upload, ArrowLeft, UserCircle, Trash2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import axios from "axios"
import { SessionData } from "@/utils/Types"

const ProfilePicture = () => {
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const { data: sessionData } = useSession()
  const session = sessionData as unknown as SessionData
  const userId = session?.user?.id

  const router = useRouter()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage({ type: "", text: "" })

    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.includes("image/")) {
      setMessage({ type: "error", text: "Please upload an image file" })
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size must be less than 2MB" })
      return
    }

    setProfileImage(file)

    const reader = new FileReader()
    reader.onload = () => {
      setPreviewImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setProfileImage(null)
    setPreviewImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!profileImage || !session?.user?.name) {
      setMessage({ type: "error", text: "Missing image or user data." })
      return
    }

    setIsUploading(true)
    setMessage({ type: "", text: "" })

    const formData = new FormData()
    formData.append("image", profileImage)
    formData.append("fullName", session.user.name)

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/client/update-profile/${userId}`,
        formData
      )

      const data = response.data
      if (data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" })
        setTimeout(() => router.push("/my-account"), 2000)
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
      setIsUploading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.image) {
      setCurrentImage(session.user.image)
    }
  }, [session])

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div
          onClick={() => router.back()}
          className="inline-flex items-center text-primary-dark hover:text-primary-darker mb-4 cursor-pointer"
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

      {/* Card */}
      <div className="bg-white rounded-lg shadow p-6">
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

        {/* Current / Preview Picture */}
        <div className="mb-8 text-center">
          <h2 className="text-lg font-medium mb-4">Current Profile Picture</h2>
          <div className="relative w-48 h-48 rounded-full overflow-hidden bg-gray-100 mx-auto flex items-center justify-center">
            {currentImage ? (
              <Image
                src={currentImage}
                alt="Preview"
                fill
                className="object-cover"
              />
            ) : (
              <UserCircle size={120} className="text-gray-400" />
            )}
          </div>
        </div>

        {/* Upload Section */}
        <div>
          <h2 className="text-lg font-medium mb-4">Upload New Picture</h2>

          {/* Preview with remove */}
          {previewImage && (
            <div className="mb-6 relative w-48 h-48 mx-auto rounded-full overflow-hidden bg-gray-100">
              <Image
                src={previewImage}
                alt="Preview"
                fill
                className="object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                title="Remove"
              >
                <Trash2 size={16} />
              </button>
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
              onClick={handleSubmit}
              disabled={isUploading || !previewImage}
              className={`flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ${
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
