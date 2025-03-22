"use client"
import React, { useEffect, useState } from "react"
import cities from "../../utils/Cities.json"

interface PopularCardProps {
  title: string
  image: string
}

const PopularCard: React.FC<PopularCardProps> = ({ title, image }) => {
  return (
    <div className="w-36 h-48 group cursor-pointer rounded-xl overflow-hidden shadow-lg">
      <div className="relative h-full">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        <h3 className="absolute bottom-4 left-2 font-bold text-lg text-white">
          {title}
        </h3>
      </div>
    </div>
  )
}

const Populars = () => {
  const [popularCitis, setPopularCities] = useState([])

  const popularLocations = [
    {
      id: 1,
      image:
        "https://blog.irctctourism.com/wp-content/uploads/2024/05/featured.2.png",
      title: "Solukhumbu",
    },
    {
      id: 2,
      image: "./images/rara.jpg",
      title: "Mustang",
    },
    {
      id: 3,
      image: "https://lp-cms-production.imgix.net/2019-06/53693064.jpg",
      title: "Manang",
    },
    {
      id: 4,
      image:
        "https://cdn.projectexpedition.com/photos/279668touractivityd09db5c9236a451fa0242d4dab5bf432_sized.jpg",
      title: "Kaski",
    },
    {
      id: 5,
      image:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/9d/e6/67/the-view-you-will-see.jpg?w=800&h=-1&s=1",
      title: "Chitwan",
    },
    {
      id: 6,
      image:
        "https://worldexpeditions.com/croppedImages/Indian-Sub-Continent/Nepal/Tangge-village-2-2608542-1920px.jpg",
      title: "Rasuwa",
    },
    {
      id: 7,
      image: "./images/rara.jpg",
      title: "Rasuwa",
    },
  ]

  const popularDestinations = [
    {
      id: 1,
      image: "./images/rara.jpg",
      title: "Everest Base Camp",
    },
    {
      id: 2,
      image: "./images/rara.jpg",
      title: "Annapurna Base Camp",
    },
    {
      id: 3,
      image: "./images/rara.jpg",
      title: "Poon Hill",
    },
    {
      id: 4,
      image: "./images/rara.jpg",
      title: "Rara Lake",
    },
    {
      id: 5,
      image: "./images/rara.jpg",
      title: "Phewa Lake",
    },
    {
      id: 6,
      image: "./images/rara.jpg",
      title: "Upper Mustang",
    },
    {
      id: 7,
      image: "./images/rara.jpg",
      title: "Upper Mustang",
    },
  ]

  // useEffect(() => {
  //   const pop = cities.slice(6)
  //   setPopularCities(pop)
  // }, [])

  return (
    <div className="max-w-7xl mx-auto">
      <section className="py-10  sm:px-6 lg:px-8 ">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Locations
            </h2>
            <p className="text-gray-600">
              Explore Nepal's most beloved districts
            </p>
          </div>

          <div className="flex flex-wrap justify-between">
            {popularLocations.map((location) => (
              <PopularCard
                key={location.id}
                title={location.title}
                image={location.image}
              />
            ))}
          </div>
        </div>
        <button className="bg-primary-dark text-white px-4 py-2 rounded-lg mt-4 mx-auto block">
          View All
        </button>
      </section>
      {/* 
      <section className="py-10  sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-gray-600">
              Discover our most visited attractions
            </p>
          </div>

          <div className="flex flex-wrap justify-between">
            {popularDestinations.map((destination) => (
              <PopularCard
                key={destination.id}
                title={destination.title}
                image={destination.image}
              />
            ))}
          </div>
        </div>
        <button className="bg-primary-dark text-white px-4 py-2 rounded-lg mt-4 mx-auto block">
          View All
        </button>
      </section> */}
    </div>
  )
}

export default Populars
