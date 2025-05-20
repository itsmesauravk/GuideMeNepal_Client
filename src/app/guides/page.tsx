"use client"
import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"
import {
  User,
  UserPlus,
  MapPin,
  Calendar,
  DollarSign,
  CoinsIcon,
  MapPinnedIcon,
  UsersRoundIcon,
  UserRoundPenIcon,
} from "lucide-react"
import Link from "next/link"
import React from "react"
import { Accordion, AccordionItem } from "@heroui/react"

const page = () => {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div
        className="hero-section relative h-[280px] w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('./images/guide-background.jpg')" }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black opacity-60"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-white drop-shadow-lg">
            Become a Local Guide
          </h1>
          <p className="text-xl mb-8 text-white max-w-2xl mx-auto">
            Transform your passion for your city into an exciting opportunity.
            Share your local knowledge and create unforgettable experiences for
            travelers.
          </p>
          <Link
            href="/guide-register"
            className="bg-primary-dark text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-primary-darker transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg hover:shadow-xl inline-block"
          >
            Join Now
          </Link>
        </div>
      </div>

      {/* About Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-charcoal-gray">
            Who are we?
          </h2>
          <p className="text-xl mb-10 text-charcoal-gray/80 max-w-2xl mx-auto">
            At Local Guides, we believe that travel experiences are best when
            shared with locals. Our platform connects travelers with certified
            local guides who offer authentic and unforgettable experiences.
          </p>
        </div>
      </section>

      {/* Why Become a Guide */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-0 text-charcoal-gray">
            Why Become a Guide?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <CoinsIcon className="w-16 h-16" />,
                title: "Earn Money",
                description:
                  "Turn your local expertise into a flexible income stream by guiding travelers.",
              },
              {
                icon: <MapPinnedIcon className="w-16 h-16" />,
                title: "Explore Your City",
                description:
                  "Discover hidden gems and rediscover your hometown through fresh perspectives.",
              },
              {
                icon: <UsersRoundIcon className="w-16 h-16" />,
                title: "Meet New People",
                description:
                  "Connect with travelers from around the world and share your culture.",
              },
            ].map((feature, index) => (
              <div key={index} className=" p-8  ">
                <div className=" p-4 inline-block mb-2">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-charcoal-gray/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-charcoal-gray">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <UserRoundPenIcon className="w-16 h-16" />,
                title: "Create Your Profile",
                description:
                  "Set up your guide profile with your unique skills and local knowledge.",
              },
              {
                icon: <DollarSign className="w-16 h-16" />,
                title: "Set Your Rate",
                description:
                  "Choose your pricing and availability for tour experiences.",
              },
              {
                icon: <MapPin className="w-16 h-16" />,
                title: "Start Guiding",
                description:
                  "Connect with travelers and start creating memorable experiences.",
              },
            ].map((step, index) => (
              <div key={index} className="bg-white p-8 ">
                <div className=" p-5 inline-block mb-2">{step.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                <p className="text-charcoal-gray/80">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-charcoal-gray">
            Frequently Asked Questions
          </h2>

          <div className="max-w-4xl mx-auto">
            <Accordion variant="splitted" className="space-y-4">
              <AccordionItem
                key="1"
                aria-label="Accordion 1"
                title="What qualifications do I need to become a local guide?"
                className="border-2 border-gray-200 rounded-lg"
              >
                {defaultContent}
              </AccordionItem>
              <AccordionItem
                key="2"
                aria-label="Accordion 2"
                title="How much can I earn as a local guide?"
                className="border-2 border-gray-200 rounded-lg"
              >
                {defaultContent}
              </AccordionItem>
              <AccordionItem
                key="3"
                aria-label="Accordion 3"
                title="Is training provided for new guides?"
                className="border-2 border-gray-200 rounded-lg"
              >
                {defaultContent}
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-charcoal-gray">
            Ready to Start Your Guide Journey?
          </h2>
          <p className="text-xl mb-10 text-charcoal-gray/80 max-w-2xl mx-auto">
            Have questions or need more information? Our team is here to support
            you every step of the way!
          </p>
          <Link
            href="/contact"
            className="bg-primary-dark text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-primary-darker transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default page
