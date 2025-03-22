import React from "react"

interface PopularCardProps {
  title: string
  image: string
}

const PopularCard: React.FC<PopularCardProps> = ({ title, image }) => {
  return (
    <div className="w-36 h-48 group cursor-pointer rounded-xl overflow-hidden shadow-lg  ">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48  object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        <h3 className="absolute bottom-4 left-2 font-bold text-xl text-white">
          {title}
        </h3>
      </div>
    </div>
  )
}

export default PopularCard
