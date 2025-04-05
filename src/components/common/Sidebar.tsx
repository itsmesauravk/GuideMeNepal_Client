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
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Cookies from "js-cookie"
import { useSession } from "next-auth/react"
import { SessionData } from "@/utils/Types"

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState("")
  const pathname = usePathname()
  const [token, setToken] = useState("")

  const { data: sessionData } = useSession()
  const session = sessionData as unknown as SessionData

  const sidebarItems = [
    {
      id: "dashboard",
      icon: <Home className="w-5 h-5" />,
      label: "Dashboard",
      url: "/guide/dashboard",
    },
    {
      id: "ongoing",
      icon: <ClockIcon className="w-5 h-5" />,
      label: "Ongoing Tour",
      url: "/guide/ongoing",
    },
    {
      id: "requests",
      icon: <NotebookIcon className="w-5 h-5" />,
      label: "Bookings Request",
      url: "/guide/bookings",
    },
    {
      id: "messages",
      icon: <MessageCircle className="w-5 h-5" />,
      label: "Messages",
      url: "/guide/messages",
    },
    {
      id: "availability",
      icon: <Calendar className="w-5 h-5" />,
      label: "Availability",
      url: "/availability",
    },
    {
      id: "profile",
      icon: <User className="w-5 h-5" />,
      label: "Profile",
      url: "/profile",
    },
    {
      id: "settings",
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      url: "/settings",
    },
  ]

  useEffect(() => {
    // Find the active item based on the current pathname
    const activeMenuItem = sidebarItems.find((item) =>
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

  return (
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
        {sidebarItems.map((item) => (
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
}

export default Sidebar

// new sidebar

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
//   Menu,
//   X,
// } from "lucide-react"
// import Image from "next/image"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import Cookies from "js-cookie"

// const Sidebar = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [isMobileOpen, setIsMobileOpen] = useState(false)
//   const [activeItem, setActiveItem] = useState("")
//   const pathname = usePathname()
//   const [token, setToken] = useState("")

//   const sidebarItems = [
//     {
//       id: "dashboard",
//       icon: <Home className="w-5 h-5" />,
//       label: "Dashboard",
//       url: "/guide/dashboard",
//     },
//     {
//       id: "requests",
//       icon: <Bell className="w-5 h-5" />,
//       label: "Bookings",
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

//   // Close sidebar when clicking outside on mobile
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const sidebar = document.getElementById("mobile-sidebar")
//       if (
//         isMobileOpen &&
//         sidebar &&
//         !sidebar.contains(event.target as Node) &&
//         !(event.target as Element).closest(".hamburger-menu")
//       ) {
//         setIsMobileOpen(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [isMobileOpen])

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth > 768) {
//         setIsMobileOpen(false)
//       }
//     }

//     window.addEventListener("resize", handleResize)
//     return () => {
//       window.removeEventListener("resize", handleResize)
//     }
//   }, [])

//   return (
//     <>
//       {/* Mobile navigation bar with hamburger */}
//       <div className="md:hidden fixed top-0 left-0 right-0 bg-white h-16 border-b flex items-center justify-between px-4 z-50">
//         <div className="font-bold text-xl text-gray-800">Guide FullName</div>
//         <button
//           className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors hamburger-menu"
//           onClick={() => setIsMobileOpen(!isMobileOpen)}
//         >
//           {isMobileOpen ? (
//             <X className="w-6 h-6" />
//           ) : (
//             <Menu className="w-6 h-6" />
//           )}
//         </button>
//       </div>

//       {/* Mobile sidebar overlay */}
//       {isMobileOpen && (
//         <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
//       )}

//       {/* Sidebar - desktop and mobile */}
//       <div
//         id="mobile-sidebar"
//         className={`
//           ${isCollapsed ? "w-16" : "w-72"}
//           bg-white
//           border-r
//           flex
//           flex-col
//           transition-all
//           duration-300
//           ease-in-out
//           shadow-md
//           md:h-screen
//           fixed
//           top-0
//           left-0
//           z-50
//           h-full
//           ${
//             isMobileOpen
//               ? "translate-x-0"
//               : "-translate-x-full md:translate-x-0"
//           }
//         `}
//       >
//         {/* Sidebar Header */}
//         <div className="flex items-center justify-between p-4 border-b">
//           {!isCollapsed && (
//             <div className="flex items-center gap-4">
//               <span className="font-bold text-xl text-gray-800">
//                 Guide FullName
//               </span>
//             </div>
//           )}
//           <button
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors md:block hidden"
//           >
//             {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
//           </button>
//           <button
//             onClick={() => setIsMobileOpen(false)}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden block"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Navigation Items */}
//         <nav className="flex-grow pt-4">
//           {sidebarItems.map((item) => (
//             <Link
//               href={item.url}
//               key={item.id}
//               onClick={() => setIsMobileOpen(false)}
//               className={`
//                 flex
//                 items-center
//                 cursor-pointer
//                 px-4
//                 py-3
//                 hover:bg-gray-100
//                 transition-colors
//                 ${
//                   activeItem === item.id
//                     ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
//                     : "text-gray-600"
//                 }
//               `}
//             >
//               <span className="mr-4">{item.icon}</span>
//               {!isCollapsed && <span>{item.label}</span>}
//             </Link>
//           ))}
//         </nav>

//         {/* Sidebar Footer */}
//         <div className="border-t p-4">
//           <div
//             className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
//             onClick={() => {
//               /* Help/Support Logic */
//               setIsMobileOpen(false)
//             }}
//           >
//             <HelpCircle className="w-5 h-5 mr-4" />
//             {!isCollapsed && (
//               <span className="text-gray-600">Help & Support</span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Main content padding for mobile */}
//       <div className="md:hidden h-16"></div>
//     </>
//   )
// }

// export default Sidebar
