"use client"
import React from "react"
import Image from "next/image"

interface ConversationDetailsProps {
  selectedUser: {
    name: string
    activeStatus: string
    avatar: string
  } | null
  active: string
}

const ConversationDetails = ({
  selectedUser,
  active,
}: ConversationDetailsProps) => {
  if (!selectedUser) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-gray-500">
        <p>Select a conversation to view details</p>
      </div>
    )
  }

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header */}
      <div className="pb-4 mb-4 border-b border-mistGray-400">
        <h2 className="text-lg font-semibold">Details</h2>
      </div>

      {/* User profile */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-24 h-24 mb-4">
          <Image
            src={selectedUser.avatar}
            alt={selectedUser.name}
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <h3 className="text-xl font-medium mb-1">{selectedUser.name}</h3>
        <p className="text-sm text-gray-500">{selectedUser.activeStatus}</p>
      </div>

      {/* Options */}
      <div className="space-y-4 border-b border-mistGray-400 pb-4 mb-4">
        <button className="w-full py-2 flex items-center text-gray-700 hover:bg-gray-100 rounded px-3">
          <svg
            className="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
          View Profile
        </button>

        <button className="w-full py-2 flex items-center text-gray-700 hover:bg-gray-100 rounded px-3">
          <svg
            className="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Notification Settings
        </button>

        <button className="w-full py-2 flex items-center text-gray-700 hover:bg-gray-100 rounded px-3">
          <svg
            className="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
          Block User
        </button>
      </div>

      {/* Shared files */}
      {/* <div className="mb-4">
        <h3 className="font-medium mb-3">Shared Files</h3>
        <div className="space-y-3">
          <div className="flex items-center p-2 border border-mistGray-400 rounded">
            <div className="bg-blue-100 p-2 rounded mr-3">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Contract.pdf</p>
              <p className="text-xs text-gray-500">2.4 MB • 2 days ago</p>
            </div>
          </div>

          <div className="flex items-center p-2 border border-mistGray-400 rounded">
            <div className="bg-green-100 p-2 rounded mr-3">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Sales Report.xlsx</p>
              <p className="text-xs text-gray-500">1.8 MB • 1 week ago</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Shared links */}
      {/* <div>
        <h3 className="font-medium mb-3">Shared Links</h3>
        <div className="space-y-3">
          <div className="p-2 border border-mistGray-400 rounded">
            <div className="bg-gray-200 h-24 rounded mb-2 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <p className="text-sm font-medium">Project Resources</p>
            <p className="text-xs text-gray-500 truncate">
              https://example.com/resources
            </p>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default ConversationDetails
