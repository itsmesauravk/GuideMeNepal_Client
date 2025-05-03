"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"

const Custom404: React.FC = () => {
  const router = useRouter()

  return (
    <div className="py-10 md:py-28 flex items-center justify-center bg-gray-50  px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="mt-6 text-8xl font-extrabold text-gray-900">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Page Not Found
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Oops! The pageyou are looking for doesn't exist.
          </p>
        </div>
        <div className="flex flex-col gap-2 mt-8 space-y-4">
          <button
            onClick={() => router.back()}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-dark hover:bg-primary-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go Back
          </button>
          <Link href="/">
            <span className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-dark underline border-primary-dark hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Return Home
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Custom404
