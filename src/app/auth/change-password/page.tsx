// "use client"
// import React, { useEffect, useState } from "react"
// import { Lock } from "lucide-react"
// import { toast } from "sonner"
// import axios from "axios"
// import { useRouter, useSearchParams } from "next/navigation"
// import Navbar from "@/components/common/Navbar"
// import Footer from "@/components/common/Footer"

// const ChangePasswordPage = () => {
//   const [password, setPassword] = useState("")
//   const [confirmPassword, setConfirmPassword] = useState("")
//   const [token, setToken] = useState<string | null>(null)

//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const authToken = searchParams.get("authToken")

//   useEffect(() => {
//     if (authToken) {
//       setToken(authToken)
//     }
//   }, [authToken])

//   const passwordChangeHandler = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()

//     if (!password || !confirmPassword) {
//       return toast.warning("Please fill all the fields")
//     }
//     if (password !== confirmPassword) {
//       return toast.warning("Passwords do not match")
//     }

//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/guide/first-time-login-password-change`,
//         { password, token },
//         { withCredentials: true }
//       )

//       if (response.data.success) {
//         toast.success(response.data.message || "Password changed successfully")
//         router.push("/dashboard")
//       } else {
//         toast.error(response.data.message || "Failed to change password")
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Something went wrong")
//     }
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="mt-28 mb-32 flex items-center justify-center p-4 ">
//         <div className="w-full max-w-md  p-8">
//           <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
//             Change Password
//           </h1>

//           {/* Form */}
//           <form className="space-y-5" onSubmit={passwordChangeHandler}>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-gray-50"
//                 placeholder="New Password"
//               />
//             </div>

//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-gray-50"
//                 placeholder="Confirm Password"
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-primary-dark hover:bg-primary-darker text-white py-3 rounded-lg transition-all text-lg font-medium shadow-md"
//             >
//               Change Password
//             </button>
//           </form>
//         </div>
//       </div>
//       <Footer />
//     </>
//   )
// }

// export default ChangePasswordPage

//new-updated
"use client"
import React, { useEffect, useState, Suspense } from "react"
import { Lock } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import Navbar from "@/components/common/Navbar"
import Footer from "@/components/common/Footer"

const ChangePasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChangePasswordContent />
    </Suspense>
  )
}

const ChangePasswordContent = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [token, setToken] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const authToken = searchParams.get("authToken")

  useEffect(() => {
    if (authToken) {
      setToken(authToken)
    }
  }, [authToken])

  const passwordChangeHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      return toast.warning("Please fill all the fields")
    }
    if (password !== confirmPassword) {
      return toast.warning("Passwords do not match")
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/first-time-login-password-change`,
        { password, token },
        { withCredentials: true }
      )

      if (response.data.success) {
        toast.success(response.data.message || "Password changed successfully")
        router.push("/guide/dashboard")
      } else {
        toast.error(response.data.message || "Failed to change password")
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <>
      <Navbar />
      <div className="mt-28 mb-32 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Change Password
          </h1>

          {/* Form */}
          <form className="space-y-5" onSubmit={passwordChangeHandler}>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-gray-50"
                placeholder="New Password"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-gray-50"
                placeholder="Confirm Password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-dark hover:bg-primary-darker text-white py-3 rounded-lg transition-all text-lg font-medium shadow-md"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ChangePasswordPage
