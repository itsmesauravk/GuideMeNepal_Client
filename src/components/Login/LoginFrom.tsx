"use client"
import React, { useEffect, useState } from "react"
import { Mail, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import axios from "axios"
import { useRouter } from "next/navigation"
import Navbar from "../common/Navbar"
import Footer from "../common/Footer"
import { signIn } from "next-auth/react"
import { set } from "date-fns"

const LoginForm = () => {
  const [email, setEmail] = useState("np03cs4s230139@heraldcollege.edu.np")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const router = useRouter()

  const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // console.log(email, password, userType)
    if (!email || !password) {
      return setErrorMessage("Please fill in all fields")
    }

    try {
      // const response = await axios.post(
      //   `${process.env.NEXT_PUBLIC_API_URL}/client/login`,
      //   {
      //     email,
      //     password,
      //   },
      //   {
      //     withCredentials: true,
      //   }
      // )
      // if (response.data.success) {
      //   // toast.success(response.data.message || "Logged in successfully")
      //   router.push("/")
      setLoading(true)
      const result = await signIn("user-credentials", {
        identifier: email,
        password,
        redirect: false,
        callbackUrl: "/",
      })

      if (result?.error) {
        setErrorMessage(result.error || "Invalid Email or Password")
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (error: any) {
      console.log(error, "error")
      toast.error(error.response?.data?.message || "Failed to login")
    } finally {
      setLoading(false)
    }
  }

  const oauthLoginHandler = (provider: string) => {
    try {
      // Direct browser redirect to OAuth provider
      // window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}`
      window.location.href = `http://localhost:4000/auth/${provider}`
      // signIn("oauth-credentials", {
      //   callbackUrl: "/",
      //   provider,
      // })
    } catch (error) {
      console.error("OAuth redirect error:", error)
      toast.error("Failed to initiate login")
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage("")
    }, 3000)
  }, [errorMessage])

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
                    // oauthLoginHandler("google")
                    signIn("google")
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
                    // oauthLoginHandler("facebook")
                    signIn("facebook")
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
              {errorMessage && (
                <p className="text-red-500 bg-red-50 text-lg mb-2 p-4">
                  {errorMessage}
                </p>
              )}
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
                href="/forgot-password"
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
              {loading ? "Logging in..." : "Login"}
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
