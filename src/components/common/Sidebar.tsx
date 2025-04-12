// "use client"
// import React, { useState, useEffect } from "react"
// import {
//   Home,
//   MessageCircle,
//   Calendar,
//   User,
//   Settings,
//   Bell,
//   HelpCircle,
//   ChevronLeft,
//   ChevronRight,
//   NotebookIcon,
//   ClockIcon,
//   BellIcon,
// } from "lucide-react"
// import Image from "next/image"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import Cookies from "js-cookie"
// import { useSession } from "next-auth/react"
// import { SessionData } from "@/utils/Types"

// const Sidebar = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [activeItem, setActiveItem] = useState("")
//   const pathname = usePathname()
//   const [token, setToken] = useState("")

//   const { data: sessionData } = useSession()
//   const session = sessionData as unknown as SessionData

//   const sidebarItems = [
//     {
//       id: "dashboard",
//       icon: <Home className="w-5 h-5" />,
//       label: "Dashboard",
//       url: "/guide/dashboard",
//     },
//     {
//       id: "notification",
//       icon: <BellIcon className="w-5 h-5" />,
//       label: "Notification",
//       url: "/guide/notification",
//     },
//     {
//       id: "ongoing",
//       icon: <ClockIcon className="w-5 h-5" />,
//       label: "Ongoing Tour",
//       url: "/guide/ongoing",
//     },
//     {
//       id: "requests",
//       icon: <NotebookIcon className="w-5 h-5" />,
//       label: "Bookings Request",
//       url: "/guide/bookings",
//     },
//     {
//       id: "messages",
//       icon: <MessageCircle className="w-5 h-5" />,
//       label: "Messages",
//       url: "/guide/messages",
//     },
//     {
//       id: "availability",
//       icon: <Calendar className="w-5 h-5" />,
//       label: "Availability",
//       url: "/availability",
//     },
//     {
//       id: "profile",
//       icon: <User className="w-5 h-5" />,
//       label: "Profile",
//       url: "/profile",
//     },
//     {
//       id: "settings",
//       icon: <Settings className="w-5 h-5" />,
//       label: "Settings",
//       url: "/settings",
//     },
//   ]

//   useEffect(() => {
//     // Find the active item based on the current pathname
//     const activeMenuItem = sidebarItems.find((item) =>
//       pathname.startsWith(item.url)
//     )

//     // Update the active item if a match is found
//     if (activeMenuItem) {
//       setActiveItem(activeMenuItem.id)
//     }
//   }, [pathname])

//   useEffect(() => {
//     const token = Cookies.get("guideToken")
//     if (token) {
//       setToken(token)
//     }
//   }, [])

//   return (
//     <div
//       className={`
//         ${isCollapsed ? "w-16" : "w-72"}
//         bg-white
//         border-r
//         h-screen
//         flex
//         flex-col
//         transition-all
//         duration-300
//         ease-in-out
//         shadow-md
//       `}
//     >
//       {/* Sidebar Header */}
//       <div className="flex items-center justify-between p-4 border-b">
//         {!isCollapsed && (
//           <div className="flex items-center gap-4">
//             <span className="font-bold text-xl text-gray-800">
//               {session?.user?.name}
//             </span>
//           </div>
//         )}
//         <button
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//         >
//           {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
//         </button>
//       </div>

//       {/* Navigation Items */}
//       <nav className="flex-grow pt-4">
//         {sidebarItems.map((item) => (
//           <Link
//             href={item.url}
//             key={item.id}
//             className={`
//               flex
//               items-center
//               cursor-pointer
//               px-4
//               py-3
//               hover:bg-gray-100
//               transition-colors
//               ${
//                 activeItem === item.id
//                   ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
//                   : "text-gray-600"
//               }
//             `}
//           >
//             <span className="mr-4">{item.icon}</span>
//             {!isCollapsed && <span>{item.label}</span>}
//           </Link>
//         ))}
//       </nav>

//       {/* Sidebar Footer */}
//       <div className="border-t p-4">
//         <div
//           className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
//           onClick={() => {
//             /* Help/Support Logic */
//           }}
//         >
//           <HelpCircle className="w-5 h-5 mr-4" />
//           {!isCollapsed && (
//             <span className="text-gray-600">Help & Support</span>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Sidebar

"use client"
import React, { useState, useEffect } from "react"
import {
  Home,
  MessageCircle,
  Calendar,
  User,
  Settings,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  NotebookIcon,
  ClockIcon,
  BellIcon,
  Menu,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Cookies from "js-cookie"
import { useSession } from "next-auth/react"
import { SessionData } from "@/utils/Types"
import { useNotificationCount } from "@/providers/NotificationCountProvider"

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [activeItem, setActiveItem] = useState("")
  const pathname = usePathname()
  const [token, setToken] = useState("")

  const { data: sessionData } = useSession()
  const session = sessionData as unknown as SessionData
  const { notificationCount } = useNotificationCount()

  const navItems = [
    {
      id: "dashboard",
      icon: <Home className="w-5 h-5" />,
      label: "Dashboard",
      url: "/guide/dashboard",
      value: 0,
    },
    {
      id: "notification",
      icon: <BellIcon className="w-5 h-5" />,
      label: "Notification",
      url: "/guide/notifications",
      value: notificationCount || 0,
    },
    {
      id: "ongoing",
      icon: <ClockIcon className="w-5 h-5" />,
      label: "Ongoing Tour",
      url: "/guide/ongoing",
      value: 0,
    },
    {
      id: "requests",
      icon: <NotebookIcon className="w-5 h-5" />,
      label: "Bookings Request",
      url: "/guide/bookings",
      value: 0,
    },
    {
      id: "messages",
      icon: <MessageCircle className="w-5 h-5" />,
      label: "Messages",
      url: "/guide/messages",
      value: 0,
    },
    {
      id: "availability",
      icon: <Calendar className="w-5 h-5" />,
      label: "Availability",
      url: "/availability",
      value: 0,
    },
    {
      id: "profile",
      icon: <User className="w-5 h-5" />,
      label: "Profile",
      url: "/profile",
      value: 0,
    },
    {
      id: "settings",
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      url: "/settings",
      value: 0,
    },
  ]

  useEffect(() => {
    // Find the active item based on the current pathname
    const activeMenuItem = navItems.find((item) =>
      pathname.startsWith(item.url)
    )

    // Update the active item if a match is found
    if (activeMenuItem) {
      setActiveItem(activeMenuItem.id)
    }
  }, [pathname])

  useEffect(() => {
    const token = Cookies.get("guideToken")
    if (token) {
      setToken(token)
    }
  }, [])

  // Hide mobile menu when navigating
  useEffect(() => {
    setIsMobileNavOpen(false)
  }, [pathname])

  // Function to determine what items to show in mobile top nav (limit to 4)
  const getMobileNavItems = () => {
    return navItems.slice(0, 5)
  }

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div
      className={`
        ${isCollapsed ? "w-16" : "w-72"}
        bg-white
        border-r
        h-screen
        flex
        flex-col
        transition-all
        duration-300
        ease-in-out
        shadow-md
        hidden lg:flex
      `}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center gap-4">
            <span className="font-bold text-xl text-gray-800">
              {session?.user?.name}
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-grow pt-4">
        {navItems.map((item) => (
          <Link
            href={item.url}
            key={item.id}
            className={`
              flex
              items-center
              cursor-pointer
              px-4
              py-3
              hover:bg-gray-100
              transition-colors
              ${
                activeItem === item.id
                  ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                  : "text-gray-600"
              }
            `}
          >
            <span className="mr-4">{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}

            {!isCollapsed && item.value > 0 && (
              <span className="ml-auto text-xs bg-blue-100 text-blue-600 font-semibold  px-2 py-1 rounded-full">
                {item.value}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t p-4">
        <div
          className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => {
            /* Help/Support Logic */
          }}
        >
          <HelpCircle className="w-5 h-5 mr-4" />
          {!isCollapsed && (
            <span className="text-gray-600">Help & Support</span>
          )}
        </div>
      </div>
    </div>
  )

  // Mobile Top Navigation Bar
  const MobileTopNav = () => (
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b shadow-md z-10">
      <div className="flex items-center justify-between px-4 h-16">
        <span className="font-bold text-gray-800 truncate">
          {session?.user?.name}
        </span>
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Secondary navigation row with icons */}
      <div className="flex justify-around items-center border-t py-1">
        {getMobileNavItems().map((item) => (
          <Link
            href={item.url}
            key={item.id}
            className={`
              flex flex-col items-center justify-center py-1 px-2
              ${activeItem === item.id ? "text-blue-600" : "text-gray-600"}
            `}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )

  // Mobile Full Screen Menu (for all items)
  const MobileFullMenu = () =>
    isMobileNavOpen && (
      <div className="lg:hidden fixed inset-0 bg-white z-20 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-xl text-gray-800">
            {session?.user?.name}
          </span>
          <button
            onClick={() => setIsMobileNavOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          {navItems.map((item) => (
            <Link
              href={item.url}
              key={item.id}
              className={`
                flex items-center px-4 py-4 border-b
                ${
                  activeItem === item.id
                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                    : "text-gray-600"
                }
              `}
            >
              <span className="mr-4">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="p-4 border-t mt-auto">
            <div
              className="flex items-center cursor-pointer hover:bg-gray-100 p-3 rounded"
              onClick={() => {
                /* Help/Support Logic */
              }}
            >
              <HelpCircle className="w-5 h-5 mr-4" />
              <span className="text-gray-600">Help & Support</span>
            </div>
          </div>
        </div>
      </div>
    )

  // Add padding to content when mobile top nav is present
  const ContentPadding = () => <div className="lg:hidden h-28"></div>

  return (
    <>
      <DesktopSidebar />
      <MobileTopNav />
      <MobileFullMenu />
      <ContentPadding />
    </>
  )
}

export default Sidebar
