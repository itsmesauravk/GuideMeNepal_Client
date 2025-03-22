"use client"
import React, { useState, ChangeEvent } from "react"
import {
  Search,
  Bell,
  MessageSquare,
  User,
  Menu,
  X,
  HelpCircleIcon,
  LogInIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import Logo from "./Logo"
import Link from "next/link"
import districtsData from "../../utils/CitiesNames.json"
import Cookies from "js-cookie"

import { Button as HeroButton, useDisclosure, Divider } from "@heroui/react"
import Notification from "./Notification"

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  User as HeroUser,
} from "@heroui/react"

// Define the District type
interface District {
  id: number
  districtId: string
  name: string
}

interface NavbarProps {
  isLoggedIn?: boolean
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn = true }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchResults, setSearchResults] = useState<District[]>([])
  const [showResults, setShowResults] = useState<boolean>(false)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const userToken = Cookies.get("userToken")
  console.log("User Token: ", userToken)

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

    const filteredDistricts = districts.filter((district) =>
      district.name.toLowerCase().includes(value)
    )

    setSearchResults(filteredDistricts)
    setShowResults(true)
  }

  const handleDistrictClick = (district: District): void => {
    setSearchTerm(district.name)
    setShowResults(false)
    // You can add navigation or other actions here
    console.log(
      `Selected district: ${district.name} (ID: ${district.id}, District ID: ${district.districtId})`
    )
  }

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
                placeholder="Search..."
                className="w-full h-12 pl-12 bg-background border-ui-divider focus:border-primary-light focus:ring-primary"
              />

              {/* Desktop Search Results Dropdown */}
              {showResults && (
                <div className="absolute mt-1 w-full bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <ul className="py-2">
                      {searchResults.map((district) => (
                        <li
                          key={district.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-medium text-gray-800 text-left"
                          onClick={() => handleDistrictClick(district)}
                        >
                          {district.name}
                        </li>
                      ))}
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
          <div className="hidden gap-4 md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <HeroButton onPress={onOpen}>
                  <Bell className="w-6 h-6" />
                </HeroButton>
                <Notification isOpen={isOpen} onOpenChange={onOpenChange} />

                {/* <MessageSquare className="h-6 w-6 hover:text-primary-light font-semibold hover:cursor-pointer" /> */}

                <div className="flex items-center gap-4">
                  <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                      <Avatar
                        isBordered
                        as="button"
                        className="transition-transform"
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                      />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="User Actions" variant="flat">
                      <DropdownItem href="/account" key="account">
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
                      <DropdownItem key="logout" color="danger">
                        <p className="text-lg">Log Out</p>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-text-secondary hover:text-primary text-lg"
                >
                  <HelpCircleIcon className="h-6 w-6" />
                  Help
                </Button>
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
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-secondary hover:text-primary"
            >
              {isMobileMenuOpen ? (
                <X className="h-10 w-10" />
              ) : (
                <Menu className="h-10 w-10" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Search Bar - Mobile */}
            <div className="p-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-10 w-10 text-text-secondary" />
                </div>
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search..."
                  className="w-full pl-12 bg-background border-ui-divider focus:border-primary focus:ring-primary"
                />

                {/* Mobile Search Results Dropdown */}
                {showResults && (
                  <div className="absolute mt-1 w-full bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <ul className="py-2">
                        {searchResults.map((district) => (
                          <li
                            key={district.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-medium text-gray-800 text-left"
                            onClick={() => handleDistrictClick(district)}
                          >
                            {district.name}
                          </li>
                        ))}
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

            {/* Mobile Navigation Items */}
            {isLoggedIn ? (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-text-secondary hover:text-primary text-lg"
                >
                  <Bell className="h-10 w-10 mr-2" />
                  Notifications
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-text-secondary hover:text-primary text-lg"
                >
                  <MessageSquare className="h-10 w-10 mr-2" />
                  Messages
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-text-secondary hover:text-primary text-lg"
                >
                  <User className="h-10 w-10 mr-2" />
                  Profile
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-text-secondary hover:text-primary text-lg"
                >
                  Help
                </Button>
                <Button
                  variant="default"
                  className="w-full bg-primary hover:bg-primary-dark text-white text-lg"
                >
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
