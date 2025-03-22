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

const LoginForm = () => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/client/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      )
      if (response.data.success) {
        toast.success(response.data.message || "Logged in successfully")
        router.push("/")
      } else {
        toast.error(response.data.message || "Failed to login")
      }
    } catch (error: any) {
      console.log(error, "error")
      toast.error(error.response?.data?.message || "Failed to login")
    }
  }

  // const oauthLoginHandler = async (provider: string) => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}`
  //     )
  //     if (response.data.success) {
  //       toast.success(response.data.message || "Logged in successfully")
  //       router.push("/")
  //     } else {
  //       toast.error(response.data.message || "Failed to login")
  //     }
  //   } catch (error) {
  //     console.log(error, "error")
  //     toast.error(error.response?.data?.message || "Failed to login")
  //   }
  // }
  const oauthLoginHandler = (provider: string) => {
    try {
      // Direct browser redirect to OAuth provider
      // window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}`
      window.location.href = `http://localhost:4000/auth/${provider}`
    } catch (error) {
      console.error("OAuth redirect error:", error)
      toast.error("Failed to initiate login")
    }
  }

  return (
    <>
      <Navbar />
      <div className=" w-full  flex items-center justify-center p-4 ">
        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h1 className="text-4xl font-semibold text-primary mb-8 text-center">
            Login
          </h1>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={loginHandler}>
            <div>
              <div className="flex gap-6 justify-center mb-6">
                <button
                  onClick={() => {
                    oauthLoginHandler("google")
                  }}
                  className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow hover:bg-background-secondary"
                >
                  <img
                    src="/google_icon.png"
                    alt="Google"
                    className="w-12 h-12"
                  />
                </button>
                <button
                  onClick={() => {
                    oauthLoginHandler("facebook")
                  }}
                  className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow hover:bg-background-secondary"
                >
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
                href={"/register"}
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

export default LoginForm
