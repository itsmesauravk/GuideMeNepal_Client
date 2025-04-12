"use client"
import React, { useEffect, useState } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button as HeroButton,
} from "@heroui/react"

import { useSocket } from "@/providers/ClientSocketProvider"
import { useNotificationCount } from "@/providers/NotificationCountProvider"
import { NotificationType } from "@/utils/Types"
import axios from "axios"

import { SessionData } from "@/utils/Types"
import { useSession } from "next-auth/react"

import { Loader2Icon } from "lucide-react"
import TimeAgo from "./TimeAgo"
import Link from "next/link"

// Define the props interface
interface NotificationProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  title?: string
}

const Notification: React.FC<NotificationProps> = ({
  isOpen,
  onOpenChange,
  title = "Notifications",
}) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const { setNotificationCount } = useNotificationCount()

  const { socket } = useSocket()
  const { data: sessionData } = useSession()
  const session = sessionData as unknown as SessionData

  const handleGetNotifications = async () => {
    if (!session?.user?.id) return

    setLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/common/all-notifications/${session?.user?.id}/${session?.user?.role}`
      )
      const data = response.data
      if (data.success) {
        setNotifications(data.data.notification)
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
    if (isOpen) {
      handleGetNotifications()
    }
  }, [isOpen, session?.user?.id])

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
        socket.off("notification")
      }
    }
  }, [socket])

  const markAsRead = async (id: number) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/common/mark-notification-read/${id}`
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
        `${process.env.NEXT_PUBLIC_API_URL}/common/mark-all-notifications-read/${session?.user?.id}/${session?.user?.role}`
      )
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      )
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
      default:
        return "📣"
    }
  }

  return (
    <Drawer isOpen={isOpen} size="lg" onOpenChange={onOpenChange}>
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{title}</h2>
                <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {notifications.filter((n) => !n.isRead).length}
                </span>
              </div>
              {notifications.length > 0 && (
                <HeroButton
                  size="sm"
                  variant="light"
                  onPress={markAllAsRead}
                  className="text-sm mr-6 text-primary-dark"
                >
                  Mark all as read
                </HeroButton>
              )}
            </DrawerHeader>

            <DrawerBody>
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2Icon className="w-10 h-10 text-primary-dark animate-spin" />
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-full text-red-500">
                  {error}
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-full text-gray-500">
                  <div className="text-5xl mb-4">📬</div>
                  <p className="text-lg font-medium">No notifications yet</p>
                  <p className="text-sm">
                    We'll notify you when something important happens
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={`notification-${notification.id}-${notification.userId}`}
                      className={`p-4 rounded-lg border ${
                        notification.isRead ? "bg-white" : "bg-blue-50"
                      } transition-all hover:shadow-md`}
                      onClick={() =>
                        !notification.isRead && markAsRead(notification.id)
                      }
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full text-lg">
                          {getNotificationIcon(notification.notificationType)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">
                              {notification.title}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {/* {formatDate(notification.createdAt)} */}
                              <TimeAgo timestamp={notification.createdAt} />
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.description}
                          </p>

                          {/* {notification.metadata && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                              <pre className="whitespace-pre-wrap">{JSON.stringify(notification.metadata, null, 2)}</pre>
                            </div>
                          )} */}

                          {notification.bookingId && (
                            <div className="mt-2">
                              <Link
                                href={`/my-bookings`}
                                className="text-blue-600 hover:underline"
                              >
                                View Booking Details
                              </Link>
                            </div>
                          )}
                        </div>
                        {!notification.isRead && (
                          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DrawerBody>

            <DrawerFooter className="border-t">
              <HeroButton color="primary" variant="light" onPress={onClose}>
                Close
              </HeroButton>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}

export default Notification
