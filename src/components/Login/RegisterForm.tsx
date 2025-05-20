"use client"
import React, { useEffect, useState } from "react"
import { Mail, Lock, User, EyeIcon, EyeClosed } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import axios from "axios"
import { useRouter } from "next/navigation"
import Navbar from "../common/Navbar"
import Footer from "../common/Footer"

const RegisterFormClient = () => {
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [viewPassword, setViewPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const router = useRouter()

  const passwordValdiation = (password: string) => {
    // minimun 6 characters, at least one uppercase letter, one lowercase letter, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/
    return passwordRegex.test(password)
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email || !password || !fullName) {
      return toast.warning("Please fill all the fields")
    }

    if (!passwordValdiation(password)) {
      return setErrorMessage(
        "Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, and one number"
      )
    }

    try {
      setLoading(true)
      setErrorMessage("")
      const formData = new FormData()

      formData.append("email", email)
      formData.append("fullName", fullName)
      formData.append("password", password)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/client/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      if (response.data.success) {
        // toast.success(response.data.message || "Registered successfully")
        // router.push("/login")
        setSuccessMessage("Please check your email to verify your account")
        setErrorMessage("")
      } else {
        // toast.error(response.data.message || "Failed to register")
        setErrorMessage(response.data.message || "Failed to register")
        setSuccessMessage("")
      }
    } catch (error: any) {
      console.log(error, "error")
      // toast.error(error.response?.data?.message || "Failed to register")
      setErrorMessage(error.response?.data?.message || "Failed to register")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setSuccessMessage("")
      setErrorMessage("")
    }, 5000)
  }, [successMessage, errorMessage])

  return (
    <>
      <Navbar />
      <div className=" w-full bg-background-secondary  flex items-center justify-center p-4 ">
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h1 className="text-4xl font-semibold text-primary mb-8 text-center mt-8 ">
            Register
          </h1>

          <div className="flex gap-6 justify-center mb-6">
            <button className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow hover:bg-background-secondary">
              <img src="/google_icon.png" alt="Google" className="w-12 h-12" />
            </button>
            <button className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow hover:bg-background-secondary">
              <img
                src="/facebook_icon.png"
                alt="Facebook"
                className="w-10 h-10"
              />
            </button>
          </div>
          <p className="text-center text-text-secondary mb-6">
            or use your email
          </p>

          {/* Login Form */}
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              {successMessage && (
                <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                  {errorMessage}
                </div>
              )}
            </div>
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                <input
                  type="text"
                  value={fullName}
                  required
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-background-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary bg-background-secondary"
                  placeholder="Full Name"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-background-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary bg-background-secondary"
                  placeholder="Email"
                  required
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                <input
                  type={viewPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-background-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary bg-background-secondary"
                  placeholder="Password"
                  required
                />
                {viewPassword ? (
                  <EyeIcon
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5 cursor-pointer"
                    onClick={() => setViewPassword(!viewPassword)}
                  />
                ) : (
                  <EyeClosed
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5 cursor-pointer"
                    onClick={() => setViewPassword(!viewPassword)}
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-dark hover:bg-primary-darker text-white py-3 rounded-lg transition-colors font-medium"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="text-center text-text-secondary">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary-dark font-medium transition-colors underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default RegisterFormClient
