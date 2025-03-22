// src/components/TimeAgo.tsx
import React, { useState, useEffect } from "react"

interface TimeAgoProps {
  timestamp: string | Date
  updateInterval?: number
  className?: string
}

/**
 * Format a timestamp into a relative time string (e.g., "2 days ago")
 */
const formatRelativeTime = (timestamp: string | Date): string => {
  // Return empty string if no timestamp
  if (!timestamp) return ""

  // Convert input to Date object
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp)

  // Get current time
  const now = new Date()

  // Calculate time difference in milliseconds
  const diffMs = now.getTime() - date.getTime()

  // Convert to seconds
  const diffSec = Math.floor(diffMs / 1000)

  // Less than a minute
  if (diffSec < 60) {
    return "just now"
  }

  // Less than an hour
  if (diffSec < 3600) {
    const minutes = Math.floor(diffSec / 60)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
  }

  // Less than a day
  if (diffSec < 86400) {
    const hours = Math.floor(diffSec / 3600)
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
  }

  // Less than a week
  if (diffSec < 604800) {
    const days = Math.floor(diffSec / 86400)
    return `${days} ${days === 1 ? "day" : "days"} ago`
  }

  // Less than a month
  if (diffSec < 2592000) {
    const weeks = Math.floor(diffSec / 604800)
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
  }

  // Less than a year
  if (diffSec < 31536000) {
    const months = Math.floor(diffSec / 2592000)
    return `${months} ${months === 1 ? "month" : "months"} ago`
  }

  // More than a year
  const years = Math.floor(diffSec / 31536000)
  return `${years} ${years === 1 ? "year" : "years"} ago`
}

/**
 * TimeAgo component for Next.js that displays a relative timestamp
 * Takes care of SSR and client-side hydration
 */
const TimeAgo: React.FC<TimeAgoProps> = ({
  timestamp,
  updateInterval = 60000,
  className = "",
}) => {
  // Start with a server-rendered value
  const initialValue = formatRelativeTime(timestamp)

  // State to hold the formatted time
  const [timeAgo, setTimeAgo] = useState<string>(initialValue)

  // State to track if component is mounted (client-side)
  const [isMounted, setIsMounted] = useState<boolean>(false)

  // Effect to run on client-side only
  useEffect(() => {
    // Set mounted state
    setIsMounted(true)

    // Refresh the relative time immediately
    setTimeAgo(formatRelativeTime(timestamp))

    // Set up interval for updates
    const intervalId = setInterval(() => {
      setTimeAgo(formatRelativeTime(timestamp))
    }, updateInterval)

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [timestamp, updateInterval])

  // Format date for title/tooltip
  const formattedDate = new Date(timestamp).toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <time
      dateTime={
        typeof timestamp === "string" ? timestamp : timestamp.toISOString()
      }
      title={formattedDate}
      className={className}
    >
      {timeAgo}
    </time>
  )
}

export default TimeAgo
