"use client"
import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"
import axios from "axios"
import { set } from "date-fns"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

const page = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email) {
      return setError("Please enter your email address")
    }
    try {
      setLoading(true)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/client/forgot-password`,
        { email }
      )
      const data = response.data

      if (data.success) {
        setSuccess(
          data.message || "Email sent successfully, please check your inbox"
        )
      } else if (data.success === false) {
        setError(data.message || "Something went wrong, Try again !")
      }
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "An error occurred. Please try again later."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (error || success) {
      setTimeout(() => {
        setError("")
        setSuccess("")
      }, 4000)
    }
  }, [error, success])
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md py-20 lg:py-40 ">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Forgot Password
          </h1>
          <p className="mt-2 text-center text-gray-600 text-sm">
            Enter your email address and we'll send you a email to reset your
            password.
          </p>
          {error && (
            <p className="text-sm text-red-600 mt-2 bg-red-50 p-4">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-600 mt-2 bg-green-50 p-4">
              {success}
            </p>
          )}

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? <p>Verifying...</p> : <p>Verify Email</p>}
            </button>
          </form>
          <div className="mt-4 text-center">
            <a href="/login" className="text-sm text-blue-600 hover:underline">
              Back to Login
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default page
