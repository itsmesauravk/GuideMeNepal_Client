"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import {
  Bell,
  CheckCheck,
  Filter,
  Loader2,
  RefreshCcw,
  Search,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useSocket } from "@/providers/ClientSocketProvider"
import { useNotificationCount } from "@/providers/NotificationCountProvider"
import { SessionData, NotificationType } from "@/utils/Types"
import TimeAgo from "../common/TimeAgo"
import Link from "next/link"

const GuideNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all") // all, read, unread
  const [searchTerm, setSearchTerm] = useState<string>("")

  const { notificationCount, setNotificationCount } = useNotificationCount()
  const { socket } = useSocket()
  const { data: sessionData } = useSession()
  const session = sessionData as unknown as SessionData

  const handleGetNotifications = async () => {
    if (!session?.user?.id) return

    setLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/common/all-notifications/${session?.user?.id}/guide`
      )
      const data = response.data

      if (data.success) {
        setNotifications(
          data.data.notifications || data.data.notification || []
        )
        setNotificationCount(data.data.unreadCount || 0)
        setError(null)
      } else {
        setError("Failed to load notifications")
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setError("Something went wrong while fetching notifications")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGetNotifications()
  }, [session?.user?.id])

  useEffect(() => {
    if (socket) {
      socket.on("newNotification", (data: NotificationType) => {
        setNotifications((prev) => [data, ...prev])
      })
      socket.on("notificationCount", (count: number) => {
        setNotificationCount(count)
      })
    }

    return () => {
      if (socket) {
        socket.off("newNotification")
        socket.off("notificationCount")
      }
    }
  }, [socket, setNotificationCount])

  const markAsRead = async (id: number) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/common/mark-notification-as-read/${id}`
      )
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    if (notifications.length === 0) return

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/common/mark-all-notification-as-read/${session?.user?.id}/guide`
      )
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      )
      setNotificationCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "auth":
        return "🔐"
      case "booking":
        return "📅"
      case "trip":
        return "✈️"
      case "review":
        return "📝"
      default:
        return "📣"
    }
  }

  // Filter notifications based on selected filter and search term
  const filteredNotifications = notifications.filter((notification) => {
    // Apply read/unread filter
    if (filter === "read" && !notification.isRead) return false
    if (filter === "unread" && notification.isRead) return false

    // Apply search filter if search term exists
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      return (
        notification.title.toLowerCase().includes(term) ||
        notification.description.toLowerCase().includes(term)
      )
    }

    return true
  })

  return (
    <div className="container mx-auto px-4 py-8  ">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold">Notifications</h1>
          {notificationCount > 0 && (
            <span className="ml-2 px-2 py-1 text-xs font-bold bg-red-100 text-red-600 rounded-full">
              {notificationCount} unread
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleGetNotifications}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
            title="Refresh notifications"
          >
            <RefreshCcw className="w-5 h-5 text-primary-dark" />
          </button>

          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={markAllAsRead}
              className="flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <p>{error}</p>
            <button
              onClick={handleGetNotifications}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Try again
            </button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">📪</div>
            <p className="text-xl font-medium text-gray-700">
              No notifications found
            </p>
            <p className="text-gray-500 mt-2">
              {searchTerm || filter !== "all"
                ? "Try changing your search or filter settings"
                : "We'll notify you when something important happens"}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors mb-4 ${
                  !notification.isRead ? "bg-blue-50" : ""
                }`}
                onClick={() =>
                  !notification.isRead && markAsRead(notification.id)
                }
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4 w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full text-xl">
                    {getNotificationIcon(notification.notificationType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <h3 className="font-medium">{notification.title}</h3>
                      <span className="text-xs text-gray-500 mt-1 sm:mt-0">
                        <TimeAgo timestamp={notification.createdAt} />
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">
                      {notification.description}
                    </p>

                    {notification.notificationType === "review" && (
                      <div className="mt-3">
                        <Link
                          href={"/guide/reviews"}
                          className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                        >
                          View Rating
                        </Link>
                      </div>
                    )}

                    {notification.bookingId && (
                      <div className="mt-3">
                        <Link
                          href={"/guide/bookings"}
                          className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                        >
                          View Booking Details
                        </Link>
                      </div>
                    )}
                  </div>
                  {!notification.isRead && (
                    <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GuideNotifications
