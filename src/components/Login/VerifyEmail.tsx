"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Loader2Icon } from "lucide-react"
import axios from "axios"

const VerifyEmail = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState("")
  const [verifying, setVerifying] = useState(true)
  const [status, setStatus] = useState("")

  useEffect(() => {
    // Extract token from URL using searchParams
    const t = searchParams.get("t")
    if (t) {
      setToken(t)
      verifyEmail(t)
    } else {
      setVerifying(false)
    }
  }, [searchParams])

  const verifyEmail = async (token: string) => {
    if (!token) return

    try {
      setVerifying(true)

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/client/verify-email/${token}`
      )

      const data = response.data
      if (data.success) {
        setStatus("success")
      } else {
        setStatus("error")
      }
    } catch (error) {
      console.error("Verification error:", error)
      setStatus("error")
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="w-full my-10 md:my-36 lg:my-52 max-w-md p-6 text-center">
        {status === "success" && (
          <div className="mb-8">
            <div className="p-8 bg-green-50 rounded-xl shadow-md border border-green-200">
              <h2 className="text-3xl font-bold text-green-700 mb-4">
                Success!
              </h2>
              <p className="text-green-700 text-xl">
                Your email has been successfully verified. You can now proceed
                to login.
              </p>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="mt-8 text-primary-dark hover:text-primary-darker font-semibold text-xl flex items-center justify-center mx-auto transition duration-200"
            >
              <ChevronLeft className="mr-2" size={28} />
              <span>Continue to Login</span>
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="mb-8">
            <div className="p-8 bg-red-50 rounded-xl shadow-md border border-red-200">
              <h2 className="text-3xl font-bold text-red-700 mb-4">
                Verification Failed
              </h2>
              <p className="text-red-700 text-xl">
                There was an error verifying your email address. Please try
                again or contact support.
              </p>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="mt-8 text-primary-dark hover:text-primary-darker font-semibold text-xl flex items-center justify-center mx-auto transition duration-200"
            >
              <ChevronLeft className="mr-2" size={28} />
              <span>Return to Login</span>
            </button>
          </div>
        )}

        {!token && !verifying && (
          <div className="mb-8">
            <div className="p-8 bg-yellow-50 rounded-xl shadow-md border border-yellow-200">
              <h2 className="text-3xl font-bold text-yellow-700 mb-4">
                Missing Verification Token
              </h2>
              <p className="text-yellow-700 text-xl">
                We couldn't find your verification token. Please check your
                email link or request a new verification email.
              </p>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="mt-8 text-primary-dark hover:text-primary-darker font-semibold text-xl flex items-center justify-center mx-auto transition duration-200"
            >
              <ChevronLeft className="mr-2" size={28} />
              <span>Return to Login</span>
            </button>
          </div>
        )}

        {verifying && (
          <div className="mb-8">
            <div className="p-8 bg-blue-50 rounded-xl shadow-md border border-blue-200">
              <h2 className="text-3xl font-bold text-blue-700 mb-4">
                Verifying Your Email
              </h2>
              <div className="flex flex-col items-center justify-center">
                <p className="text-blue-700 text-xl mb-6">
                  Please wait while we verify your email address...
                </p>
                <Loader2Icon className="animate-spin text-blue-500" size={48} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail
