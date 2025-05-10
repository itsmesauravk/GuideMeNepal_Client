"use client"
import React, { useState, ChangeEvent, useEffect } from "react"
import {
  Search,
  Bell,
  MessageSquare,
  User,
  Menu,
  X,
  HelpCircleIcon,
  LogInIcon,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import Logo from "./Logo"
import Link from "next/link"
// import districtsData from "../../utils/CitiesNames.json"
import districtsData from "../../utils/DistrictsNames.json"

import { Button as HeroButton, useDisclosure, Divider } from "@heroui/react"
import Notification from "./Notification"
import { useNotificationCount } from "@/providers/NotificationCountProvider"

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  User as HeroUser,
} from "@heroui/react"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import axios from "axios"

import { SessionData } from "@/utils/Types"

// Define the District type
interface District {
  id: number
  districtId: string
  name: string
  tags?: string[] // Optional tags property
}

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchResults, setSearchResults] = useState<District[]>([])
  const [showResults, setShowResults] = useState<boolean>(false)
  const [isLoggedIn, setIsloggedIn] = useState<boolean>(false)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const router = useRouter()

  const { notificationCount, setNotificationCount } = useNotificationCount()

  const { data: sessionData } = useSession()

  const session = sessionData as unknown as SessionData

  // Import districts data
  const districts: District[] = districtsData

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.toLowerCase()
    setSearchTerm(value)

    if (value.trim() === "") {
      setSearchResults([])
      setShowResults(false)
      return
    }

    // const filteredDistricts = districts.filter((district) =>
    //   district.name.toLowerCase().includes(value)
    // )
    //for filtring by name and tags
    const filteredDistricts = districts.filter(
      (district) =>
        district.name.toLowerCase().includes(value) ||
        (district.tags &&
          district.tags.some(
            (tag) =>
              typeof tag === "string" && tag.toLowerCase().includes(value)
          ))
    )

    setSearchResults(filteredDistricts)
    setShowResults(true)
  }

  const handleDistrictClick = (district: District): void => {
    setSearchTerm(district.name)
    setShowResults(false)
    router.push(`/districts/${district.districtId}`)
    // Close mobile menu when selecting a district
    setIsMobileMenuOpen(false)
  }

  const handleGetNotifications = async () => {
    if (!session?.user?.id) return

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/common/all-notifications/${session?.user?.id}/${session?.user?.role}`
      )
      const data = response.data
      if (data.success) {
        setNotificationCount(data.data.unreadCount || 0)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  useEffect(() => {
    if (session?.user) {
      setIsloggedIn(true)
      handleGetNotifications()
    } else {
      setIsloggedIn(false)
    }
  }, [session])

  return (
    <nav className="bg-background border-b border-ui-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo Section */}
          <Logo />

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-text-secondary" />
              </div>
              <Input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search location..."
                className="w-full h-12 pl-12 bg-background border-ui-divider focus:border-primary-light focus:ring-primary"
              />

              {/* Desktop Search Results Dropdown */}

              {showResults && (
                <div className="absolute mt-1 w-full max-w-2xl bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <ul className="py-2">
                      {searchResults.map((district) => {
                        // Find matching tags if they exist
                        const matchingTags = district.tags?.filter(
                          (tag) =>
                            typeof tag === "string" &&
                            tag.toLowerCase().includes(searchTerm.toLowerCase())
                        )

                        return (
                          <li
                            key={district.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-medium text-gray-800 text-left"
                            onClick={() => handleDistrictClick(district)}
                          >
                            <div className="flex flex-col">
                              <span>{district.name}</span>
                              {matchingTags && matchingTags.length > 0 && (
                                <span className="text-sm text-gray-500">
                                  {matchingTags.map((tag, index) => (
                                    <React.Fragment key={index}>
                                      {index > 0 && ", "}
                                      {tag}
                                    </React.Fragment>
                                  ))}
                                </span>
                              )}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <div className="px-4 py-3 text-red-500 font-medium text-left">
                      Not found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden gap-2 md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-6">
                  <Link href="/my-bookings">
                    <p className="font-medium cursor-pointer hover:underline">
                      Bookings
                    </p>
                  </Link>
                  <Link href="/messages">
                    <p className="font-medium cursor-pointer hover:underline">
                      Messages
                    </p>
                  </Link>
                </div>
                <HeroButton
                  onPress={onOpen}
                  className="relative bg-white p-2 rounded-full"
                >
                  <Bell className="w-6 h-6 text-gray-800" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </span>
                  )}
                </HeroButton>

                <Notification isOpen={isOpen} onOpenChange={onOpenChange} />

                <div className="flex items-center gap-4">
                  <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                      {session?.user?.image ? (
                        <Avatar
                          isBordered
                          as="button"
                          className="transition-transform"
                          src={session?.user?.image}
                        />
                      ) : (
                        <Avatar
                          isBordered
                          as="button"
                          className="transition-transform"
                          name={session?.user?.name || "image"}
                        />
                      )}
                    </DropdownTrigger>
                    <DropdownMenu aria-label="User Actions" variant="flat">
                      <DropdownItem href="/my-account" key="account">
                        <p className="text-lg">My Account</p>
                      </DropdownItem>
                      <DropdownItem href="/my-bookings" key="my-booking">
                        <p className="text-lg">My Bookings</p>
                      </DropdownItem>
                      <DropdownItem href="/messages" key="messages">
                        <p className="text-lg">Messages</p>
                      </DropdownItem>
                      <DropdownItem href="/help" key="help_and_feedback">
                        <p className="text-lg">Help</p>
                      </DropdownItem>
                      <DropdownItem
                        key="divider"
                        disableAnimation={true}
                        isDisabled={true}
                      >
                        <Divider className="" />
                      </DropdownItem>
                      <DropdownItem
                        key="logout"
                        color="danger"
                        onPress={() => signOut({ callbackUrl: "/" })}
                      >
                        <p className="text-lg">Log Out</p>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </>
            ) : (
              <>
                <Link href={"/help"}>
                  <Button
                    variant="ghost"
                    className="text-text-secondary hover:text-primary text-lg"
                  >
                    <HelpCircleIcon className="h-6 w-6" />
                    Help
                  </Button>
                </Link>
                <Link href={"/login"}>
                  <Button
                    variant="default"
                    className=" hover:bg-primary-dark text-white text-lg"
                  >
                    <LogInIcon className="h-6 w-6" />
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-secondary hover:text-primary"
            >
              {isMobileMenuOpen ? (
                <X className="h-24 w-24" />
              ) : (
                <Menu className="h-24 w-24" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Improved */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute z-50 left-0 right-0">
          <div className="px-4 pt-4 pb-6 space-y-4">
            {/* Search Bar - Mobile */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-text-secondary" />
              </div>
              <Input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search location..."
                className="w-full pl-10 h-12 bg-background border-ui-divider focus:border-primary focus:ring-primary"
              />

              {showResults && (
                <div className="absolute mt-1 w-full max-w-2xl bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <ul className="py-2">
                      {searchResults.map((district) => {
                        // Find matching tags if they exist
                        const matchingTags = district.tags?.filter(
                          (tag) =>
                            typeof tag === "string" &&
                            tag.toLowerCase().includes(searchTerm.toLowerCase())
                        )

                        return (
                          <li
                            key={district.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-medium text-gray-800 text-left"
                            onClick={() => handleDistrictClick(district)}
                          >
                            <div className="flex flex-col">
                              <span>{district.name}</span>
                              {matchingTags && matchingTags.length > 0 && (
                                <span className="text-sm text-gray-500">
                                  {matchingTags.map((tag, index) => (
                                    <React.Fragment key={index}>
                                      {index > 0 && ", "}
                                      {tag}
                                    </React.Fragment>
                                  ))}
                                </span>
                              )}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <div className="px-4 py-3 text-red-500 font-medium text-left">
                      Not found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Navigation Items */}
            {isLoggedIn ? (
              <div className="space-y-3 pt-2">
                <Link href="/my-account">
                  <div className="flex items-center py-3 px-2 rounded-lg hover:bg-gray-100">
                    <User className="h-6 w-6 mr-3 text-gray-700" />
                    <span className="font-medium text-lg">My Account</span>
                  </div>
                </Link>
                <Link href="/my-bookings">
                  <div className="flex items-center py-3 px-2 rounded-lg hover:bg-gray-100">
                    <Calendar className="h-6 w-6 mr-3 text-gray-700" />
                    <span className="font-medium text-lg">My Bookings</span>
                  </div>
                </Link>
                <Link href="/messages">
                  <div className="flex items-center py-3 px-2 rounded-lg hover:bg-gray-100">
                    <MessageSquare className="h-6 w-6 mr-3 text-gray-700" />
                    <span className="font-medium text-lg">Messages</span>
                  </div>
                </Link>
                <div
                  className="flex items-center py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={onOpen}
                >
                  <div className="relative">
                    <Bell className="h-6 w-6 mr-3 text-gray-700" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {notificationCount > 9 ? "9+" : notificationCount}
                      </span>
                    )}
                  </div>
                  <span className="font-medium text-lg">Notifications</span>
                </div>
                <Link href="/help">
                  <div className="flex items-center py-3 px-2 rounded-lg hover:bg-gray-100">
                    <HelpCircleIcon className="h-6 w-6 mr-3 text-gray-700" />
                    <span className="font-medium text-lg">Help</span>
                  </div>
                </Link>

                <div className="pt-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      signOut({ callbackUrl: "/" })
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full py-3 border border-red-500 text-red-500 hover:bg-red-50"
                  >
                    <LogInIcon className="h-5 w-5 mr-2 rotate-180" />
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <Link href="/help">
                  <div className="flex items-center py-3 px-2 rounded-lg hover:bg-gray-100">
                    <HelpCircleIcon className="h-6 w-6 mr-3 text-gray-700" />
                    <span className="font-medium text-lg">Help</span>
                  </div>
                </Link>
                <div className="pt-3">
                  <Link href="/login">
                    <Button
                      variant="default"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-6 bg-primary hover:bg-primary-dark text-white text-lg"
                    >
                      <LogInIcon className="h-5 w-5 mr-2" />
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
