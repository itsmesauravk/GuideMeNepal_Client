"use client"
import React, { useState, useEffect } from "react"
import UserList from "./UserList"
// import ConversationDetails from "./ConversationDetails"
import ConversationView from "./ConversationVeiw"
// import { useGetInquiriesQuery } from "@/src/services/api/user/inquiryApi"

import ConversationDetails from "./ConversationDetails"
import { useSocket } from "@/providers/ClientSocketProvider"

interface MessageUser {
  name: string
  message: string
  conversationId: number
  type: string
  avatar: string
  date: string
  activeStatus: "online" | "offline"
  status: "sent" | "delivered" | "received"
  receivedCount?: number
}

interface User {
  name: string
  activeStatus: string
  conversationId: number
  type: string
  avatar: string
}

const messagesUsersList: MessageUser[] = [
  {
    name: "Alice Johnson",
    message: "Hey, how's it going?",
    conversationId: 1,
    type: "Guide",
    avatar: "https://example.com/avatar1.jpg",
    date: "2025-03-25T10:15:00Z",
    activeStatus: "online",
    status: "sent",
  },
]

const UserMessages = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  // const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const [activeButton, setActiveButton] = useState("Messages")
  const [showDetails, setShowDetails] = useState(false)
  const [showUserList, setShowUserList] = useState(true)
  const [animatingUserList, setAnimatingUserList] = useState(false)
  const [animatingDetails, setAnimatingDetails] = useState(false)
  const [userListVisible, setUserListVisible] = useState(true)
  const [detailsVisible, setDetailsVisible] = useState(false)

  useEffect(() => {
    if (showUserList && !userListVisible) {
      setAnimatingUserList(true)
      setUserListVisible(true)
    } else if (!showUserList && userListVisible) {
      setAnimatingUserList(true)
      setTimeout(() => setUserListVisible(false), 300)
    }
  }, [showUserList, userListVisible])

  useEffect(() => {
    if (showDetails && !detailsVisible) {
      setAnimatingDetails(true)
      setDetailsVisible(true)
    } else if (!showDetails && detailsVisible) {
      setAnimatingDetails(true)
      setTimeout(() => setDetailsVisible(false), 300)
    }
  }, [showDetails, detailsVisible])

  const handleAnimationEnd = () => {
    setAnimatingUserList(false)
    setAnimatingDetails(false)
  }

  const handleTabChange = (tab: string) => {
    setActiveButton(tab)
    setSelectedUser(null)
  }

  const handleSelectUser = (user: MessageUser) => {
    setSelectedUser({
      name: user.name,
      activeStatus: user.activeStatus === "online" ? "Online" : "Offline",
      conversationId: user.conversationId,
      type: user.type,
      avatar: user.avatar,
    })
  }

  const toggleDetails = () => {
    const newShowDetails = !showDetails
    setShowDetails(newShowDetails)

    // When opening details, hide user list
    if (newShowDetails) {
      setShowUserList(false)
    } else {
      // When closing details, show user list again
      setShowUserList(true)
    }
  }

  const handleBackClick = () => {
    // Close details and show user list
    setShowDetails(false)
    setShowUserList(true)
  }

  const { onlineUsers, socket } = useSocket()

  useEffect(() => {
    if (onlineUsers.length > 0) {
      console.log("Online users form user message are : ", onlineUsers)
    }
  }, [onlineUsers, socket])

  return (
    <>
      <div className="flex flex-col w-full">
        <main className="flex items-start w-full border-t border-mistGray-400 overflow-hidden">
          {userListVisible && (
            <UserList
              messagesUsersList={messagesUsersList}
              activeButton={activeButton}
              handleTabChange={handleTabChange}
              handleSelectUser={handleSelectUser}
              selectedUser={selectedUser}
              animatingUserList={animatingUserList}
              showUserList={showUserList}
            />
          )}

          {/* Conversation section with dynamic width */}
          <section
            className={`transition-all duration-300 ease-in-out border-l border-mistGray-400 w-3/4`}
          >
            <ConversationView
              active={activeButton}
              selectedUser={selectedUser}
              onToggleDetails={toggleDetails}
              onBackClick={handleBackClick}
              showBackButton={!userListVisible}
            />
          </section>

          {/* Details section with animation */}
          {detailsVisible && (
            <section
              className={`transition-all duration-300 ease-in-out max-w-sm w-1/4 border-l border-mistGray-400 ${
                animatingDetails
                  ? showDetails
                    ? "w-1/4 opacity-100"
                    : "w-0 opacity-0"
                  : "w-1/4"
              }`}
              onTransitionEnd={handleAnimationEnd}
            >
              <ConversationDetails
                selectedUser={selectedUser}
                active={activeButton}
              />
            </section>
          )}
        </main>
      </div>
    </>
  )
}

export default UserMessages
