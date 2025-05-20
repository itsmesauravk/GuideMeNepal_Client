import React from "react"
import Navbar from "@/components/common/Navbar"
import Footer from "@/components/common/Footer"
import Link from "next/link"
import {
  Globe2Icon,
  HeartHandshakeIcon,
  UsersIcon,
  AwardIcon,
  MapIcon,
  CompassIcon,
} from "lucide-react"
import Image from "next/image"

export const metadata = {
  title: "About Us - Guide Me Nepal",
  description:
    "Learn about Guide Me Nepal's mission, values, and journey to connect travelers with authentic local experiences across Nepal.",
}

const page = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div
        className="hero-section relative h-[280px] w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('./images/mount.jpeg')" }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black opacity-60"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-white drop-shadow-lg">
            About Guide Me Nepal
          </h1>
          <p className="text-xl mb-8 text-white max-w-2xl mx-auto">
            Connecting travelers with authentic local experiences and passionate
            guides across Nepal.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-charcoal-gray">
                Our Story
              </h2>
              <p className="text-lg mb-6 text-charcoal-gray/80">
                Guide Me Nepal was founded in 2023 by a group of passionate
                travelers and local guides who saw the need for more authentic
                travel experiences in Nepal. We believed that the true essence
                of Nepal could best be experienced through the eyes of locals
                who love their homeland.
              </p>
              <p className="text-lg text-charcoal-gray/80">
                What started as a small network of trusted guides in Kathmandu
                has now grown into a nationwide community of certified local
                experts, each bringing their unique perspective and knowledge to
                create unforgettable experiences for travelers from around the
                world.
              </p>
            </div>
            <div className="bg-gray-200 h-96 rounded-lg">
              {/* Placeholder for image */}
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <Image
                  src="/images/rara.jpg"
                  alt="Our Team"
                  width={300}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-charcoal-gray">
            Our Mission
          </h2>
          <p className="text-xl mb-12 text-charcoal-gray/80 max-w-3xl mx-auto">
            At Guide Me Nepal, we're on a mission to transform how travelers
            experience Nepal by creating meaningful connections between visitors
            and local guides while supporting sustainable tourism practices that
            benefit local communities.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe2Icon className="w-16 h-16" />,
                title: "Authentic Experiences",
                description:
                  "We showcase the true Nepal through experiences crafted by locals who know their region best.",
              },
              {
                icon: <HeartHandshakeIcon className="w-16 h-16" />,
                title: "Community Support",
                description:
                  "We ensure tourism benefits local economies by connecting travelers directly with local guides.",
              },
              {
                icon: <UsersIcon className="w-16 h-16" />,
                title: "Cultural Exchange",
                description:
                  "We foster meaningful interactions that promote understanding between cultures.",
              },
            ].map((value, index) => (
              <div key={index} className="p-8">
                <div className="p-4 inline-block mb-2">{value.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{value.title}</h3>
                <p className="text-charcoal-gray/80">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-charcoal-gray">
            What Sets Us Apart
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <AwardIcon className="w-16 h-16" />,
                title: "Verified Local Guides",
                description:
                  "All our guides are thoroughly vetted for their knowledge, expertise, and passion.",
              },
              {
                icon: <MapIcon className="w-16 h-16" />,
                title: "Customizable Experiences",
                description:
                  "We offer flexible itineraries tailored to your interests and preferences.",
              },
              {
                icon: <CompassIcon className="w-16 h-16" />,
                title: "Off-the-Beaten-Path",
                description:
                  "Discover hidden gems and local secrets that typical tour companies miss.",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm">
                <div className="p-5 inline-block mb-2">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-charcoal-gray/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-charcoal-gray">
            Meet Our Team
          </h2>
          <p className="text-xl mb-12 text-charcoal-gray/80 max-w-3xl mx-auto">
            Our dedicated team brings together expertise in travel, local
            culture, and hospitality to ensure exceptional experiences for every
            traveler.
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                name: "Saurav Karki",
                role: "Founder & CEO",
                image: "/images/saurav.png",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <div className="bg-gray-200 h-48">
                  {/* Placeholder for team member image */}
                  <div className="w-full h-full flex items-center justify-center ">
                    <Image
                      src={`${member.image}`}
                      alt={member.name}
                      width={300}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-charcoal-gray/80">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-charcoal-gray">
            Join Us on the Journey
          </h2>
          <p className="text-xl mb-10 text-charcoal-gray/80 max-w-2xl mx-auto">
            Whether you're a traveler seeking authentic experiences or a local
            guide passionate about sharing your Nepal, we invite you to be part
            of our growing community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/districts"
              className="bg-primary-dark text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-primary-darker transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              Explore Districts
            </Link>
            <Link
              href="/guides"
              className="bg-white border-2 border-primary-dark text-primary-dark font-bold py-4 px-10 rounded-full text-lg hover:bg-gray-50 transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              Become a Guide
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default page
