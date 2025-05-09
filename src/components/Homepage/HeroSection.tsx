"use client"
import { Search as SearchIcon } from "lucide-react"
import React, { useState, ChangeEvent } from "react"
// import citiesName from "../../utils/CitiesNames.json"
import citiesName from "../../utils/DistrictsNames.json"
import { useRouter } from "next/navigation"

// Define the District type
interface District {
  id: number
  districtId: string
  name: string
  tags?: string[] // Optional tags property
}

const HeroSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchResults, setSearchResults] = useState<District[]>([])
  const [showResults, setShowResults] = useState<boolean>(false)

  const router = useRouter()

  // Import districts data
  const districts: District[] = citiesName

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
  }

  return (
    <div
      className="hero-section relative h-[520px] w-full bg-cover bg-center"
      style={{ backgroundImage: "url('./images/rara.jpg')" }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-soft-white text-center px-4">
        <h1 className="text-5xl font-bold mb-6 drop-shadow-lg text-white">
          Find Trusted Guides in Nepal
        </h1>

        <p className="text-xl mb-8 max-w-2xl text-white">
          Discover authentic adventures with certified local experts who know
          Nepal like no one else
        </p>

        {/* Search Input Field with Results Dropdown */}
        <div className="w-full max-w-2xl">
          <div className="relative flex items-center p-2 bg-white bg-opacity-90 rounded-full shadow-lg">
            <SearchIcon className="absolute top-4 left-4 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Where to ..."
              className="flex-1 p-3 pl-12 font-semibold text-lg text-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-royal-blue bg-transparent w-full"
            />
          </div>

          {/* Search Results Dropdown */}
          {/* {showResults && (
            <div className="absolute mt-1 w-full max-w-2xl bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
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
          )} */}
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
    </div>
  )
}

export default HeroSection
