import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { useRouter } from "next/router"
import axios from "axios"

// guide type
interface Guide {
  id: string
  fullname?: string
  email?: string
  profilePhoto?: string
  verified?: boolean
}

// Define the AuthContextType
interface AuthContextType {
  guide: Guide | null
  setGuide: React.Dispatch<React.SetStateAction<Guide | null>>
}

// Create the context with proper typing
const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [guide, setGuide] = useState<Guide | null>(null)

  return (
    <AuthContext.Provider value={{ guide, setGuide }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
