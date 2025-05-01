import { Compass } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const Logo = () => {
  return (
    <Link
      href={"/"}
      className="flex items-center space-x-2"
      aria-label="GuideMeNepal Logo"
    >
      <Image
        src={"/logo.png"}
        alt="GuideMeNepal Logo"
        width={120}
        height={60}
      />
    </Link>
  )
}

export default Logo
