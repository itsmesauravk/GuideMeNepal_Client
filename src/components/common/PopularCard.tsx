import React from "react"

interface PopularCardProps {
  title: string
  image: string
}

const PopularCard: React.FC<PopularCardProps> = ({ title, image }) => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      <div className="w-full h-40 sm:h-48 group cursor-pointer rounded-lg sm:rounded-xl overflow-hidden shadow-md sm:shadow-lg">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-40 sm:h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
          <h3 className="absolute bottom-2 sm:bottom-4 left-2 font-bold text-sm sm:text-base md:text-lg lg:text-xl text-white">
            {title}
          </h3>
        </div>
      </div>
    </div>
  )
}

export default PopularCard
