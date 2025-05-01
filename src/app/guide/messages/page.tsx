import Sidebar from "@/components/common/Sidebar"
import UserMessages from "@/components/Messages/UserMessage"
import { Loader2Icon } from "lucide-react"

import React, { Suspense } from "react"

export const metadata = {
  title: "Messages - Guide Me Nepal",
  description:
    "Manage your messages and stay connected with clients. Keep track of your conversations and never miss an important message.",
}

const page = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      <Suspense
        fallback={
          <div className="flex items-center justify-center w-full h-screen">
            <Loader2Icon className="animate-spin" />
          </div>
        }
      >
        <UserMessages />
      </Suspense>
    </div>
  )
}

export default page
