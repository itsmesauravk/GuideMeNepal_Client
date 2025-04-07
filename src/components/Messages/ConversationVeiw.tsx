"use client"
import { MessageSquare } from "lucide-react"
import Message from "./Message"

interface User {
  name: string
  activeStatus: string
  conversationId: number
  type: string
  avatar: string
}
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

interface ConversationViewProps {
  selectedUser: User | null

  onToggleDetails: () => void
  onBackClick?: () => void
  active: string
  showBackButton?: boolean
}

const ConversationView: React.FC<ConversationViewProps> = ({
  selectedUser,

  onToggleDetails,
  active,
  onBackClick,
  showBackButton = false,
}) => {
  const EmptyState: React.FC = () => (
    <div className="w-full h-screen flex items-center justify-center flex-col gap-2">
      <MessageSquare size={64} className="text-mistGray-950" />
      <h6 className="text-xl font-medium text-mistGray-900">Your messages</h6>
      <p className="text-mistGray-700">Tap to view your messages.</p>
    </div>
  )

  return (
    <div className="flex flex-col h-screen">
      {selectedUser ? (
        <>
          <Message
            selectedUser={selectedUser}
            onToggleDetails={onToggleDetails}
            onBackClick={onBackClick}
            showBackButton={showBackButton}
          />
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}

export default ConversationView
