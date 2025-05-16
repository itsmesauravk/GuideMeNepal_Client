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
import { getSession, signIn } from "next-auth/react"
import { SessionData } from "@/utils/Types"

const GuideLoginForm = () => {
  const [email, setEmail] = useState("sanjeetkazithapa@gmail.com")
  const [password, setPassword] = useState("secret123")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // console.log(email, password, userType)
    if (!email || !password) {
      return toast.warning("Please fill all the fields")
    }

    try {
      // const response = await axios.post(
      //   `${process.env.NEXT_PUBLIC_API_URL}/guide/login`,
      //   {
      //     email,
      //     password,
      //   }
      // )

      // console.log(response.data.data.firstTimeLogin, "response")

      // if (response.data.success) {
      //   toast.success(response.data.message || "Logged in successfully")
      //   if (response.data.data.data.firstTimeLogin) {
      //     router.push(
      //       `/auth/change-password?authToken=${response.data.data.jwt}`
      //     )
      //   } else {
      //     router.push("/guide/dashboard")
      //   }
      // } else {
      //   toast.error(response.data.message || "Failed to login")
      // }
      setLoading(true)
      const result = await signIn("guide-credentials", {
        identifier: email,
        password,
        redirect: false,
        callbackUrl: "/guide/dashboard",
      })

      if (result?.error) {
        toast.error(result.error)
      } else if (result?.url) {
        // router.push(result.url)
        // Get the session to check firstTimeLogin
        const data = await getSession()

        const session = data as unknown as SessionData

        if (session?.user?.firstTimeLogin) {
          // Redirect to change password page with JWT
          router.push(`/auth/change-password?authToken=${session.jwt}`)
        } else {
          router.push(result.url)
        }
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
              <Link
                href="/forgot-password?user=guide"
                className="text-primary hover:text-primary-dark text-sm transition-colors underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-dark hover:bg-primary-darker text-white py-3 rounded-lg transition-colors font-medium"
            >
              {loading ? "Loading..." : "Login"}
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
