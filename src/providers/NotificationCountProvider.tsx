"use client"

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

interface NotificationCountContextType {
  notificationCount: number
  setNotificationCount: (count: number) => void
}

const NotificationCountContext = createContext<NotificationCountContextType>({
  notificationCount: 0,
  setNotificationCount: () => {},
})

export const useNotificationCount = () => useContext(NotificationCountContext)

interface NotificationCountProviderProps {
  children: ReactNode
}

export function NotificationCountProvider({
  children,
}: NotificationCountProviderProps) {
  const [notificationCount, setNotificationCount] = useState<number>(0)

  return (
    <NotificationCountContext.Provider
      value={{ notificationCount, setNotificationCount }}
    >
      {children}
    </NotificationCountContext.Provider>
  )
}
