"use client"

import { io, Socket } from "socket.io-client"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { useSession } from "next-auth/react"
import { SessionData } from "@/utils/Types"

// Create a context for socket-related state
interface SocketContextType {
  onlineUsers: string[]
  socket: Socket | null
}

const SocketContext = createContext<SocketContextType>({
  onlineUsers: [],
  socket: null,
})

// Export a hook to use the socket context
export const useSocket = () => useContext(SocketContext)

interface ClientSocketProviderProps {
  children: ReactNode
}

export function ClientSocketProvider({ children }: ClientSocketProviderProps) {
  const { data: sessionData } = useSession()
  const session = sessionData as unknown as SessionData
  const userId = session?.user?.id

  // states
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    if (userId) {
      const socket = io(process.env.NEXT_PUBLIC_API_URL_MAIN, {
        query: {
          userId: userId,
          role: session?.user?.role,
        },
        transports: ["websocket"],
      })

      setSocket(socket)

      //for listening to events

      socket.on("getOnlineUsers", (onlineUsers) => {
        console.log("Online users:", onlineUsers)
        setOnlineUsers(onlineUsers)
      })

      socket.on("disconnect", () => {
        console.log("Disconnected from server")
      })

      socket.on("error", (error) => {
        console.error("Socket error:", error)
      })
      return () => {
        socket.close()
        setSocket(null)
      }
    } else {
      console.log("No userId found, not connecting to socket")
    }
  }, [userId]) // Add userId as dependency if you want to reconnect when user changes

  // Provide the context values to children
  return (
    <SocketContext.Provider value={{ onlineUsers, socket }}>
      {children}
    </SocketContext.Provider>
  )
}
