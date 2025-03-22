"use client"
import React, { useState } from "react"
import { Mail, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import axios from "axios"
import { useRouter } from "next/navigation"
import Navbar from "../common/Navbar"
import Footer from "../common/Footer"

const GuideLoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const router = useRouter()

  const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // console.log(email, password, userType)
    if (!email || !password) {
      return toast.warning("Please fill all the fields")
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/login`,
        {
          email,
          password,
        }
      )

      if (response.data.success) {
        toast.success(response.data.message || "Logged in successfully")
        if (response.data.data.firstTimeLogin) {
          router.push(
            `/auth/change-password?authToken=${response.data.data.guideToken}`
          )
        } else {
          router.push("/guide/dashboard")
        }
      } else {
        toast.error(response.data.message || "Failed to login")
      }
    } catch (error: any) {
      console.log(error, "error")
      toast.error(error.response?.data?.message || "Failed to login")
    }
  }

  return (
    <>
      <Navbar />
      <div className=" w-full bg-background-secondary  flex items-center justify-center p-4 ">
        {/* <div className="w-full max-w-[900px] bg-white rounded-lg shadow-lg flex overflow-hidden"> */}

        <div className="w-full mt-12 mb-12 md:w-1/2 p-8 md:p-12">
          <h1 className="text-4xl font-semibold text-primary mb-8 text-center">
            Login as a Guide
          </h1>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={loginHandler}>
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-background-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary bg-background-secondary"
                  placeholder="Email"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-background-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary bg-background-secondary"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="text-right">
              <a
                href="#"
                className="text-primary hover:text-primary-dark text-sm transition-colors underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-dark hover:bg-primary-darker text-white py-3 rounded-lg transition-colors font-medium"
            >
              Login
            </button>

            <p className="text-center text-text-secondary">
              Don't have an account?{" "}
              <Link
                href={"/guide-register"}
                className="text-primary-dark hover:text-primary-dark font-medium transition-colors underline"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default GuideLoginForm
