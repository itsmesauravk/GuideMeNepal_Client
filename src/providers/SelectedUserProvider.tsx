"use client"

import { createContext, useContext, useState } from "react"

interface SelectedUserContextType {
  selectedUser: string[] | null
  setSelecteUser: (user: string[]) => void
}

const SelectedUserContext = createContext<SelectedUserContextType>({
  selectedUser: null,
  setSelecteUser: () => {},
})

export const useSelectedUser = () => useContext(SelectedUserContext)

interface SelectedUserProviderProps {
  children: React.ReactNode
}

export function SelectedUserProvider({ children }: SelectedUserProviderProps) {
  const [selectedUser, setSelecteUser] = useState<string[] | null>(null)

  return (
    <SelectedUserContext.Provider value={{ selectedUser, setSelecteUser }}>
      {children}
    </SelectedUserContext.Provider>
  )
}
