"use client"
import React, { useEffect, useState } from "react"
import {
  Mail,
  User,
  Camera,
  Lock,
  ChevronRight,
  Check,
  Clock,
  BirdIcon,
} from "lucide-react"
import { SessionData } from "@/utils/Types"
import { useSession } from "next-auth/react"
import Link from "next/link"

const Account = () => {
  const [profile, setProfile] = useState<SessionData | null>(null)

  const { data: sessionData } = useSession()
  const session: SessionData = sessionData as unknown as SessionData

  useEffect(() => {
    if (session) {
      setProfile(session)
    }
  }, [session])

  return (
    <div className="max-w-7xl mx-auto p-6 lg:mb-24">
      {/* Header */}
      <h1 className="text-3xl font-bold text-primary-dark mb-2">Account</h1>

      {profile !== null ? (
        <>
          {/* User Info */}
          <div className="mb-8">
            <div className="flex items-center gap-1">
              <h2 className="text-lg font-bold">{session.user.name},</h2>
              <span className="text-gray-500">{session.user.email}</span>
            </div>
          </div>

          {/* General Section */}
          <div className="mb-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Personal Info Card */}
              <Link href="/my-account/personal-info" className="block">
                <div className="bg-white rounded-lg shadow p-6 relative hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="text-blue-800" size={20} />
                    <h4 className="text-lg font-medium">Personal Info</h4>
                    <ChevronRight size={16} className="text-gray-500" />
                  </div>

                  <p className="text-gray-600 text-sm">
                    Provide personal details and how we can reach you
                  </p>
                </div>
              </Link>

              {/* Profile Picture Card */}
              <Link href="/my-account/profile-picture" className="block">
                <div className="bg-white rounded-lg shadow p-6 relative hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <Camera className="text-green-800" size={20} />
                    <h4 className="text-lg font-medium">Profile Picture</h4>
                    <ChevronRight size={16} className="text-gray-500" />
                  </div>

                  <p className="text-gray-600 text-sm">
                    Upload your Profile Picture Icon
                  </p>
                </div>
              </Link>

              {/* Password Card */}
              <Link href="/my-account/password" className="block">
                <div className="bg-white rounded-lg shadow p-6 relative hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="text-red-800" size={20} />
                    <h4 className="text-lg font-medium">Password</h4>
                    <ChevronRight size={16} className="text-gray-500" />
                  </div>

                  <p className="text-gray-600 text-sm">
                    Update your password & secure your account
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center lg:mt-24 mt-12">
          <div className="flex flex-col items-center">
            <BirdIcon size={48} className="text-gray-500 mb-4" />
            <h2 className="text-lg font-bold text-gray-500 mb-2">
              Please Login to view Profile
            </h2>
          </div>
        </div>
      )}
    </div>
  )
}

export default Account
