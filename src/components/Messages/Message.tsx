"use client"
import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, Info, Loader2Icon, MoreVertical } from "lucide-react"
import MessageInput from "./MessageInput"
import axios from "axios"
import { SessionData } from "@/utils/Types"
import { useSession } from "next-auth/react"
import { useSocket } from "@/providers/ClientSocketProvider"

interface User {
  name: string
  activeStatus: string
  conversationId: number
  type: string
  avatar: string
}

interface MessageProps {
  selectedUser: User
  onToggleDetails: () => void
  onBackClick?: () => void
  showBackButton?: boolean
}

type MessageType = {
  id?: number | string // Temporary ID for local state
  conversationId: number
  senderId: number
  senderModel: "User" | "Guide"
  content: string
  contentType: string
  isRead: boolean
  metadata: any
  createdAt: string
  updatedAt: string
}

const Message: React.FC<MessageProps> = ({
  selectedUser,
  onToggleDetails,
  onBackClick,
  showBackButton = false,
}) => {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: sessionData } = useSession()
  const session = sessionData as unknown as SessionData
  const userId = session?.user?.id || ""

  const myRole = session?.user?.role === "user" ? "User" : "Guide"

  const conversationId = selectedUser?.conversationId || 0

  const { socket } = useSocket()

  useEffect(() => {
    const handleNewMessage = (newMessage: MessageType) => {
      if (newMessage.conversationId === conversationId) {
        setMessages((prevMessages) => [...prevMessages, newMessage])
      }
    }

    socket?.on("newMessage", handleNewMessage)

    return () => {
      socket?.off("newMessage", handleNewMessage)
    }
  }, [socket, conversationId, messages.length])

  // THis is initial function to get messages
  // This function will be used to get messages from the server

  const handleGetMessages = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/message/get-messages/${conversationId}/${userId}/${myRole}`
      )
      const data = response.data
      if (data.success) {
        setMessages(data.data.messages)
      } else {
        setError(data.message || "Unable to load messages")
      }
    } catch (error) {
      setError("An error occurred while fetching messages")
    } finally {
      setLoading(false)
    }
  }

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (userId && conversationId) {
      handleGetMessages()
    }
  }, [userId, conversationId])

  const handleSendMessage = async ({
    message,
    attachments,
  }: {
    message: string
    attachments: File[]
  }) => {
    if (message.trim() || attachments.length > 0) {
      // Create a temporary ID for the message
      const tempId = `temp-${Date.now()}`

      const newMessage: MessageType = {
        id: tempId, // Use the temporary ID
        conversationId: conversationId,
        senderId: parseInt(userId),
        senderModel: myRole,
        content: message,
        contentType: "text",
        isRead: false,
        metadata: attachments.length > 0 ? { attachments: attachments } : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Add the message with temporary ID
      setMessages((prevMessages) => [...prevMessages, newMessage])

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/message/send-message`,
          {
            conversationId: conversationId,
            senderId: parseInt(userId),
            senderModel: myRole,
            content: message,
            contentType: "text",
            isRead: false,
            metadata:
              attachments.length > 0 ? { attachments: attachments } : null,
          }
        )

        const data = response.data
        if (data.success) {
          // Replace the temporary message with the one from the server
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === tempId ? { ...msg, id: data.data.id } : msg
            )
          )
        } else {
          setError(data.message || "Unable to send message")
        }
      } catch (error) {
        setError("An error occurred while sending message")
      }
    }
  }

  // Format timestamp to readable time
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Check if the message is from the current user
  const isCurrentUser = (senderModel: string, senderId: number) => {
    const isMe = senderModel === myRole && senderId === parseInt(userId)

    return isMe
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-mistGray-400">
        {showBackButton && (
          <button
            onClick={onBackClick}
            className="mr-2 p-1 rounded-full hover:bg-mistGray-100"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div className="flex items-center flex-1">
          <div className="relative mr-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
              <Image
                src={selectedUser.avatar}
                alt={selectedUser.name}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            {selectedUser.activeStatus === "online" && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h3 className="font-medium">{selectedUser.name}</h3>
            <p
              className={`text-xs font-semibold ${
                selectedUser.activeStatus === "Online"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {selectedUser.activeStatus}
            </p>
          </div>
        </div>
        <div className="flex">
          <button
            onClick={onToggleDetails}
            className="p-2 rounded-full hover:bg-mistGray-100"
            title="Show details"
          >
            <Info size={20} />
          </button>
          <button
            className="p-2 rounded-full hover:bg-mistGray-100"
            title="More options"
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>
              <Loader2Icon
                className="animate-spin text-primary-dark"
                size={40}
                aria-label="Loading"
              />
            </p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  isCurrentUser(message.senderModel, message.senderId)
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                    isCurrentUser(message.senderModel, message.senderId)
                      ? "bg-primary-dark text-white rounded-br-none"
                      : "bg-white border border-mistGray-300 rounded-bl-none"
                  }`}
                >
                  <p>{message.content}</p>
                  {message.metadata?.attachments &&
                    message.metadata.attachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.metadata.attachments.map(
                          (file: File, index: number) => (
                            <div key={index} className="text-xs">
                              📎 {file.name}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  <div
                    className={`text-xs mt-1 flex justify-end items-center ${
                      isCurrentUser(message.senderModel, message.senderId)
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTimestamp(message.createdAt)}
                    {isCurrentUser(message.senderModel, message.senderId) && (
                      <span className="ml-2">
                        {!message.isRead && "✓"}
                        {message.isRead && (
                          <span className="text-blue-200">✓✓</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input Component */}
      <MessageInput onSendButtonClicked={handleSendMessage} />
    </>
  )
}

export default Message
