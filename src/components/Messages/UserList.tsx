"use client"
import React, { Suspense, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { useSocket } from "@/providers/ClientSocketProvider"
import axios from "axios"
import { useSession } from "next-auth/react"
import { SessionData } from "@/utils/Types"
import { useSearchParams } from "next/navigation"

interface Participant {
  id: number
  name: string
  profilePicture: string
  type: string
  slug: string
}

interface Conversation {
  conversationId: number
  isGroupChat: boolean
  lastMessage: string
  createdAt: string
  updatedAt: string

  participants: Participant[]
}

interface UserListProps {
  messagesUsersList: Array<{
    name: string
    message: string
    date: string
    activeStatus: "online" | "offline"
    status: "sent" | "delivered" | "received"
    receivedCount?: number
  }>
  activeButton: string
  handleTabChange: (tab: string) => void
  handleSelectUser: (user: any) => void
  selectedUser: { name: string; activeStatus: string; avatar: string } | null
  animatingUserList: boolean
  showUserList: boolean
}

const UserList = ({
  messagesUsersList,
  activeButton,
  handleTabChange,
  handleSelectUser,
  selectedUser,
  animatingUserList,
  showUserList,
}: UserListProps) => {
  // Format the date to relative time (e.g., "2 hours ago")
  const formatMessageDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return dateString || "Just now"
    }
  }

  const { onlineUsers, socket } = useSocket()
  const { data: sessionData } = useSession()
  const session = sessionData as unknown as SessionData
  const [conversations, setConversations] = useState<Conversation[]>([])

  const userRole = session?.user?.role === "user" ? "User" : "Guide"

  const myId = session?.user?.id || 0

  // Real-time updates for new messages
  useEffect(() => {
    if (socket) {
      // Listen for new conversations
      socket.on("getConversation", (newConversation) => {
        console.log("New conversation received:", newConversation)

        setConversations((prevConversations) => {
          // Check if the conversation already exists in our list
          const existingConversationIndex = prevConversations.findIndex(
            (conv) => conv.conversationId === newConversation.id
          )

          // If conversation exists, update it
          if (existingConversationIndex !== -1) {
            const updatedConversations = [...prevConversations]
            updatedConversations[existingConversationIndex] = {
              ...updatedConversations[existingConversationIndex],
              lastMessage: newConversation.lastMessage,
              updatedAt: newConversation.updatedAt,
            }
            return updatedConversations
          }
          // If it's a new conversation, we need to format it to match our Conversation type
          // and add it to the list
          else {
            // You'll need to fetch the participant details or have them in the socket response
            // This is a placeholder assuming the socket gives you this information in a future update
            const formattedConversation: Conversation = {
              conversationId: newConversation.id,
              isGroupChat: newConversation.isGroupChat,
              lastMessage: newConversation.lastMessage,
              createdAt: newConversation.createdAt,
              updatedAt: newConversation.updatedAt,
              participants: [], // You'll need to populate this from the socket response
            }

            // If this is a new conversation, you might want to fetch the full details
            // including participants
            handleGetConversations()

            return prevConversations // Return unchanged for now, as handleGetConversations will update
          }
        })
      })
    }

    return () => {
      if (socket) {
        socket.off("getConversation")
      }
    }
  }, [socket])

  //this will load all my conversation if there are created  // Fetch conversations from the server
  const handleGetConversations = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/message/get-conversations/${session?.user?.id}/${userRole}`
      )
      if (response.data.success) {
        setConversations(response.data.data)
      } else {
        console.log("Error fetching conversations:", response.data.message)
      }
    } catch (error) {
      console.error("Error fetching conversations:", error)
    }
  }

  //get the user slug from query in the url - this is for opening the chat page with the selected user
  const searchParams = useSearchParams()
  const chatId = searchParams.get("chat") // chatId is userslug
  const guideId = searchParams.get("id") // guideId is the id of the guide

  //this function is for creating new conversation with user if not exist already
  const handleCreateNewConverstion = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/message/send-message`,
        {
          senderId: myId,
          senderModel: userRole,
          reciverId: guideId,
          reciverType: "Guide",
          content: "Hello",
          contentType: "text",
        }
      )
      const data = response.data
      if (data.success) {
        console.log("New conversation created successfully:", data.data)
        // fetching the conversations again to update the list
        await handleGetConversations()
      } else {
        console.error("Error creating new conversation:", data.message)
      }
    } catch (error) {
      console.error("Error creating new conversation:", error)
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      handleGetConversations()
    }
  }, [session?.user?.id])

  const isCreatingConversation = useRef(false)

  useEffect(() => {
    if (chatId !== null) {
      // if chat id is not null then opening the user chats
      // Find the conversation with the matching chatId

      const conversation = conversations.find(
        (conv) => conv.participants[0].slug === chatId
      )
      // console.log("Selected conversation:", conversation)

      if (conversation) {
        const participant = conversation.participants[0]
        const isOnline = onlineUsers.includes(participant.id.toString())
        handleSelectUser({
          id: participant.id,
          name: participant.name,
          avatar: participant.profilePicture,
          type: participant.type,
          conversationId: conversation.conversationId,
          activeStatus: isOnline ? "online" : "offline",
          message: conversation.lastMessage,
          date: conversation.updatedAt,
        })
        // Reset the creation flag
        isCreatingConversation.current = false
      } else if (!isCreatingConversation.current && guideId) {
        // No conversation found and not already creating one
        isCreatingConversation.current = true

        // Create new conversation
        handleCreateNewConverstion().then(() => {
          // This will only run after the conversation is created
          // Keep the flag true until the next render cycle completes
          setTimeout(() => {
            isCreatingConversation.current = false
          }, 0)
        })
      }
    }
  }, [chatId, conversations, onlineUsers])

  return (
    <section
      className={`transition-all duration-300 ease-in-out h-screen max-w-sm w-1/4 ${
        animatingUserList
          ? showUserList
            ? "w-1/4 opacity-100"
            : "w-0 opacity-0"
          : ""
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Search */}
        <div className="flex gap-2 p-4 border-b border-mistGray-400">
          {/* small user profile  */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 border-2 border-green-600 bg-gray-300 rounded-full overflow-hidden">
              <Image
                src={session?.user?.image || "/images/default_user.avif"}
                alt={session?.user?.name || "User"}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </div>
          {/* search part  */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search messages"
              className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full focus:outline-none"
            />
            <svg
              className="absolute w-5 h-5 text-gray-500 left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length > 0 ? (
            conversations.map((conversation) => {
              // Add a check to ensure participants array exists and has elements
              if (
                !conversation.participants ||
                conversation.participants.length === 0
              ) {
                return null // Skip rendering this conversation
              }

              // Since we're dealing with one-to-one chats, get the other participant
              const participant = conversation.participants[0]
              const isOnline = onlineUsers.includes(participant.id.toString())

              return (
                <div
                  key={conversation.conversationId}
                  className={`flex items-start p-4 cursor-pointer border-b border-mistGray-400 hover:bg-gray-50 `}
                  onClick={() =>
                    handleSelectUser({
                      id: participant.id,
                      name: participant.name,
                      avatar: participant.profilePicture,
                      type: participant.type,
                      conversationId: conversation.conversationId,
                      activeStatus: isOnline ? "online" : "offline",
                      message: conversation.lastMessage,
                      date: conversation.updatedAt,
                    })
                  }
                >
                  {/* Avatar */}
                  <div className="relative mr-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                      <Image
                        src={
                          participant.profilePicture ||
                          "/images/default_user.avif"
                        }
                        alt={participant.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    {/* Online indicator */}
                    {isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* User info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium truncate">
                        {participant.name}{" "}
                        {participant.type === "Guide" && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Guide
                          </span>
                        )}
                      </h3>
                    </div>
                    <div className="flex gap-2 items-center">
                      {isOnline ? (
                        <p className="text-xs text-green-500 font-semibold">
                          Online
                        </p>
                      ) : (
                        <p className="text-xs text-red-500 font-semibold">
                          Offline
                        </p>
                      )}
                      •
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatMessageDate(conversation.updatedAt)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
              <svg
                className="w-12 h-12 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <p>No conversations yet</p>
              <p className="text-sm">Your messages will appear here</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default UserList
