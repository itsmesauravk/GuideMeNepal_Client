"use client"
import React, { useEffect, useState } from "react"
import { Textarea } from "../ui/textarea"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Mail } from "lucide-react"
import axios from "axios"

const ContactUs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/client/contact`,
        formData
      )
      const data = response.data
      if (data.success) {
        setSuccessMessage(data.message || "Message sent successfully!")
        setErrorMessage("")
        // Reset form
        setFormData({
          name: "",
          email: "",
          message: "",
        })
      } else {
        setErrorMessage(data.message || "An error occurred. Please try again.")
        setSuccessMessage("")
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      )
      setSuccessMessage("")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setSuccessMessage("")
      setErrorMessage("")
    }, 4000)
  }, [successMessage, errorMessage])

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-2 items-center flex">
        <Mail className="inline-block mr-2 w-7 h-7 text-primary-dark" />
        Contact Us
      </h2>
      <p className="mb-4">
        Can't find what you're looking for? Send us a message and we'll get back
        to you as soon as possible.
      </p>

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-dark"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-dark"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="message" className="block text-gray-700 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-dark"
            required
          ></Textarea>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-dark text-white py-2 px-4 rounded-md hover:bg-primary-darker transition-colors"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  )
}

export default ContactUs
