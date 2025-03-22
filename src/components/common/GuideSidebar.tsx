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
  ShoppingCartIcon,
  AlignRightIcon,
  XIcon,
  ChevronDownIcon,
} from "lucide-react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Cookies from "js-cookie"

const GuideSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [token, setToken] = useState("")

  const pathname = usePathname()
  const router = useRouter()

  // Main navigation items from GuideSidebar
  const navItems = [
    {
      id: "dashboard",
      icon: <Home className="w-5 h-5" />,
      label: "Dashboard",
      url: "/guide/dashboard",
    },
    {
      id: "requests",
      icon: <Bell className="w-5 h-5" />,
      label: "Bookings",
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

  // Dropdown items from GuideSidebar
  const dropdownItems = [
    {
      id: "about",
      icon: <HelpCircle className="w-5 h-5" />,
      label: "About",
      url: "/about",
    },
    {
      id: "faqs",
      icon: <HelpCircle className="w-5 h-5" />,
      label: "FAQs",
      url: "/faqs",
    },
    {
      id: "privacy",
      icon: <HelpCircle className="w-5 h-5" />,
      label: "Privacy Policy",
      url: "/privacy-policy",
    },
    {
      id: "terms",
      icon: <HelpCircle className="w-5 h-5" />,
      label: "Terms and Conditions",
      url: "/terms-and-conditions",
    },
    {
      id: "reviews",
      icon: <HelpCircle className="w-5 h-5" />,
      label: "View Reviews",
      url: "/reviews",
    },
  ]

  // Dummy user data for logged in state
  const sessionData = {
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
  }

  const collapseHandler = () => {
    setIsCollapsed(!isCollapsed)
    localStorage.setItem("isCollapsed", JSON.stringify(!isCollapsed))
  }

  useEffect(() => {
    // Find the active item based on the current pathname
    const activeMenuItem = [...navItems, ...dropdownItems].find(
      (item) => pathname === item.url
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
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = () => {
    // Login logic here
    setMobileOpen(false)
  }

  const handleSignup = () => {
    // Signup logic here
    setMobileOpen(false)
  }

  const handleSignOut = () => {
    Cookies.remove("guideToken")
    setToken("")
    setIsLoggedIn(false)
  }

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div
      className={`
        ${isCollapsed ? "w-24" : "w-72"} 
        bg-white 
        border-r 
        h-screen 
        hidden md:flex 
        flex-col 
        transition-all 
        duration-300 
        ease-in-out 
        shadow-md
        fixed
        top-0
        left-0
        z-40
      `}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <h1 className="font-bold text-xl text-gray-800">
                Guide Me Nepal
              </h1>
              <p className="text-xs text-gray-500">Online Guide Finding</p>
            </div>
          </div>
        )}

        <button
          onClick={collapseHandler}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-grow py-4 overflow-y-auto">
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
                  ? "bg-[#E8B86D]/10 text-[#E8B86D] border-r-4 border-[#E8B86D]"
                  : "text-gray-600"
              }
            `}
          >
            <span className={`${!isCollapsed ? "mr-4" : "mx-auto"}`}>
              {item.icon}
            </span>
            {!isCollapsed && (
              <span className="text-sm uppercase tracking-wider">
                {item.label}
              </span>
            )}
          </Link>
        ))}

        {/* More Dropdown */}
        <div className="px-4 py-2">
          <div
            className={`
              flex 
              items-center 
              cursor-pointer 
              py-3 
              hover:bg-gray-100 
              transition-colors
              ${mobileMoreOpen ? "bg-gray-100" : ""}
            `}
            onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
          >
            <span className={`${!isCollapsed ? "mr-4" : "mx-auto"}`}>
              <HelpCircle className="w-5 h-5" />
            </span>
            {!isCollapsed && (
              <div className="flex justify-between items-center w-full">
                <span className="text-sm uppercase tracking-wider text-gray-600">
                  More
                </span>
                <ChevronDownIcon
                  className={`transition-transform duration-300 ${
                    mobileMoreOpen ? "rotate-180" : ""
                  }`}
                  size={16}
                />
              </div>
            )}
          </div>

          {mobileMoreOpen && !isCollapsed && (
            <div className="ml-8 mt-1">
              {dropdownItems.map((item) => (
                <Link
                  href={item.url}
                  key={item.id}
                  className={`
                    flex 
                    items-center 
                    cursor-pointer 
                    py-2 
                    hover:text-[#E8B86D] 
                    transition-colors 
                    ${
                      activeItem === item.id
                        ? "text-[#E8B86D]"
                        : "text-gray-500"
                    }
                  `}
                >
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t p-4">
        {isLoggedIn ? (
          <div className="flex flex-col gap-2">
            {!isCollapsed && (
              <div className="flex items-center gap-2 p-2">
                <div className="size-10 bg-[#E8B86D] rounded-full flex items-center justify-center text-white">
                  {sessionData.user.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-gray-600">
                    {sessionData.user.name}
                  </p>
                  {!isCollapsed && (
                    <p className="text-xs text-gray-400">
                      {sessionData.user.email}
                    </p>
                  )}
                </div>
              </div>
            )}

            {!isCollapsed && (
              <>
                <Link href="/profile">
                  <div className="p-2 text-sm text-gray-600 hover:bg-gray-100 rounded">
                    Profile
                  </div>
                </Link>
              </>
            )}

            <div
              className="p-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer flex items-center"
              onClick={handleSignOut}
            >
              {isCollapsed ? (
                <span className="mx-auto">
                  <ChevronLeft className="w-5 h-5" />
                </span>
              ) : (
                "Sign out"
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {!isCollapsed ? (
              <>
                <button
                  className="w-full py-2 text-white bg-[#E8B86D] rounded-md text-sm"
                  onClick={handleLogin}
                >
                  Login
                </button>
                <button
                  className="w-full py-2 text-[#E8B86D] border border-[#E8B86D] rounded-md text-sm"
                  onClick={handleSignup}
                >
                  Signup
                </button>
              </>
            ) : (
              <button
                className="mx-auto bg-[#E8B86D] text-white p-2 rounded-md"
                onClick={handleLogin}
              >
                <User className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )

  // Mobile Header with toggle
  const MobileHeader = () => (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-30 px-4 py-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <h1 className="text-xl leading-5">GMN</h1>
            <p className="text-xs text-gray-500">Perfect Solution for you</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-1" onClick={() => setMobileOpen(!mobileOpen)}>
            <AlignRightIcon size={24} className="text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  )

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-2">
              <h1 className="text-xl leading-5">Khandbari</h1>
            </div>
            <button className="p-1" onClick={() => setMobileOpen(false)}>
              <XIcon size={24} className="text-gray-700" />
            </button>
          </div>

          {isLoggedIn ? (
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-[#E8B86D] rounded-full flex items-center justify-center text-white">
                  {sessionData.user.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-600">{sessionData.user.name}</p>
                  <p className="text-xs text-gray-400">
                    {sessionData.user.email}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <Link href="/profile" onClick={() => setMobileOpen(false)}>
                  <p className="text-sm text-gray-600 hover:text-[#E8B86D] p-1">
                    Profile
                  </p>
                </Link>

                <p
                  className="text-sm text-gray-600 hover:text-[#E8B86D] cursor-pointer p-1"
                  onClick={() => {
                    handleSignOut()
                    setMobileOpen(false)
                  }}
                >
                  Sign out
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b">
              <div className="flex flex-col gap-3">
                <button
                  className="py-2 text-white rounded-md bg-[#E8B86D] w-full"
                  onClick={handleLogin}
                >
                  Login
                </button>
                <button
                  className="py-2 text-[#E8B86D] border border-[#E8B86D] rounded-md w-full"
                  onClick={handleSignup}
                >
                  Signup
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4">
            <ul className="flex flex-col gap-3">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link href={item.url} onClick={() => setMobileOpen(false)}>
                    <div
                      className={`p-2 rounded-md flex items-center ${
                        activeItem === item.id
                          ? "bg-[#E8B86D]/10 text-[#E8B86D]"
                          : "text-gray-600"
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <p className="font-normal text-sm uppercase tracking-wider">
                        {item.label}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}

              <li>
                <div
                  className="p-2 rounded-md text-gray-600 cursor-pointer"
                  onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <HelpCircle className="w-5 h-5 mr-3" />
                      <p className="font-normal text-sm uppercase tracking-wider">
                        More
                      </p>
                    </div>
                    <ChevronDownIcon
                      className={`transition-transform duration-300 ${
                        mobileMoreOpen ? "rotate-180" : ""
                      }`}
                      size={16}
                    />
                  </div>
                </div>

                {mobileMoreOpen && (
                  <ul className="ml-10 mt-1 flex flex-col gap-2">
                    {dropdownItems.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={item.url}
                          onClick={() => setMobileOpen(false)}
                        >
                          <p className="text-sm text-gray-500 p-1 hover:text-[#E8B86D]">
                            {item.label}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
    </>
  )

  return (
    <>
      <DesktopSidebar />
      <MobileHeader />
      <MobileSidebar />

      <div
        className={`md:ml-${
          isCollapsed ? "16" : "64"
        } transition-all duration-300 mt-14 md:mt-0`}
      >
        {/* content goes here */}
      </div>
    </>
  )
}

export default GuideSidebar
