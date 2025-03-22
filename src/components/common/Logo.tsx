// import { Compass } from "lucide-react"

// const Logo = () => {
//   return (
//     <div className="flex items-center space-x-2">
//       <Compass className="w-8 h-8 text-primary-darker" />
//       <span className="text-2xl font-sans">
//         <span className="font-bold text-primary-darker">Guide</span>
//         <span className="font-light">Me</span>
//         <span className="font-bold text-primary-darker">Nepal</span>
//       </span>
//     </div>
//   )
// }

// export default Logo

import { Compass } from "lucide-react"
import Link from "next/link"

const Logo = () => {
  return (
    <Link
      href={"/"}
      className="flex items-center space-x-2"
      aria-label="GuideMeNepal Logo"
    >
      <Compass className="w-8 h-8 text-primary-darker" />
      <span className="text-2xl font-sans leading-tight">
        <span className="font-bold text-primary-darker">Guide</span>
        <span className="font-semibold ">Me</span>
        <span className="font-bold text-primary-darker">Nepal</span>
      </span>
    </Link>
  )
}

export default Logo
