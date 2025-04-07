"use client"
import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  Info,
  Send,
  Paperclip,
  Calendar,
  MoreVertical,
} from "lucide-react"

interface Inquiry {
  id: number
  user: {
    name: string
    avatar: string
  }
  property: {
    name: string
    image: string
  }
  message: string
  date: string
  status: "pending" | "confirmed" | "declined"
}

interface InquiryMessageProps {
  selectedUserInquiry: Inquiry
  onToggleDetails: () => void
  onBackClick?: () => void
  showBackButton?: boolean
}

type MessageType = {
  id: number
  text: string
  sender: "host" | "guest"
  timestamp: string
  status: "sent" | "delivered" | "read"
}

const InquiryMessage: React.FC<InquiryMessageProps> = ({
  selectedUserInquiry,
  onToggleDetails,
  onBackClick,
  showBackButton = false,
}) => {
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<MessageType[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize messages based on the inquiry
    const initialMessages: MessageType[] = [
      {
        id: 1,
        text: selectedUserInquiry.message,
        sender: "guest",
        timestamp: new Date(selectedUserInquiry.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "read",
      },
    ]

    setMessages(initialMessages)
  }, [selectedUserInquiry])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: MessageType = {
        id: messages.length + 1,
        text: inputValue,
        sender: "host",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
      }
      setMessages([...messages, newMessage])
      setInputValue("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "declined":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col border-b border-mistGray-400">
        <div className="flex items-center px-4 py-3">
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
                  src={selectedUserInquiry.user.avatar}
                  alt={selectedUserInquiry.user.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <h3 className="font-medium">{selectedUserInquiry.user.name}</h3>
              <p className="text-xs text-gray-500">
                Inquiry from{" "}
                {new Date(selectedUserInquiry.date).toLocaleDateString()}
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

        {/* Property Info */}
        <div className="flex items-center px-4 py-3 bg-gray-50 border-t border-mistGray-400">
          <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden mr-3">
            <Image
              src={selectedUserInquiry.property.image}
              alt={selectedUserInquiry.property.name}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">{selectedUserInquiry.property.name}</h4>
            <div className="flex items-center mt-1">
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(
                  selectedUserInquiry.status
                )}`}
              >
                {selectedUserInquiry.status.charAt(0).toUpperCase() +
                  selectedUserInquiry.status.slice(1)}
              </span>
            </div>
          </div>
          <button className="p-2 rounded-full bg-blue-500 text-white">
            <Calendar size={18} />
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "host" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                  message.sender === "host"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white border border-mistGray-300 rounded-bl-none"
                }`}
              >
                <p>{message.text}</p>
                <div
                  className={`text-xs mt-1 flex justify-end items-center ${
                    message.sender === "host"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp}
                  {message.sender === "host" && (
                    <span className="ml-1">
                      {message.status === "sent" && "✓"}
                      {message.status === "delivered" && "✓✓"}
                      {message.status === "read" && (
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
      </div>

      {/* Action Buttons */}
      {selectedUserInquiry.status === "pending" && (
        <div className="flex justify-center gap-3 p-3 bg-gray-50 border-t border-mistGray-400">
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg flex-1">
            Decline
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg flex-1">
            Approve
          </button>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t border-mistGray-400 p-3 bg-white">
        <div className="flex items-center rounded-full border border-mistGray-300 bg-white px-3 py-2">
          <button className="text-gray-500 hover:text-gray-700 mr-2">
            <Paperclip size={20} />
          </button>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 border-none focus:ring-0 resize-none max-h-28 outline-none"
            rows={1}
          />
          <button
            onClick={handleSend}
            className={`ml-2 p-2 rounded-full ${
              inputValue.trim()
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
            disabled={!inputValue.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  )
}

export default InquiryMessage
