"use client"
import React, { useState } from "react"
import { ChevronRight, ChevronLeft, Loader2Icon } from "lucide-react"
import Link from "next/link"
import { GuideRegisterForm } from "@/utils/Types"
import { Button } from "../ui/button"
import Footer from "../common/Footer"
import Navbar from "../common/Navbar"
import StepIndicator from "./StepIndicator"
import StepOne from "./StepOne"
import StepTwo from "./StepTwo"
import StepThree from "./StepThree"
import StepFour from "./StepFour"
import axios from "axios"
import { toast } from "sonner"

export const initialFormData: GuideRegisterForm = {
  fullName: "",
  email: "",
  contactNumber: "",
  guideTypes: [],
  languages: [""],
  guidingAreas: [""],
  aboutMe: "",
  experiences: [""],
  profilePicture: null,
  licensePicture: null,
  certificationPicture: null,
  introVideo: null,
  termsAccepted: false,
  dataAgreement: false,
}

export type ArrayField = "languages" | "guidingAreas" | "experiences"
export type FileField =
  | "profilePicture"
  | "licensePicture"
  | "certificationPicture"
  | "introVideo"
export type InputChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>
export type FileChangeEvent = React.ChangeEvent<HTMLInputElement>

const GuideRegister = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<GuideRegisterForm>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: InputChangeEvent): void => {
    const { name, value } = e.target
    setFormData((prev: GuideRegisterForm) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleGuideTypeChange = (type: string): void => {
    setFormData((prev: GuideRegisterForm) => ({
      ...prev,
      guideTypes: prev.guideTypes.includes(type)
        ? prev.guideTypes.filter((t) => t !== type)
        : [...prev.guideTypes, type],
    }))
  }

  const handleArrayInput = (
    field: ArrayField,
    index: number,
    value: string
  ): void => {
    setFormData((prev: GuideRegisterForm) => {
      const updated = [...prev[field]]
      updated[index] = value
      return {
        ...prev,
        [field]: updated,
      }
    })
  }

  const addArrayField = (field: ArrayField): void => {
    setFormData((prev: GuideRegisterForm) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const removeArrayField = (field: ArrayField, index: number): void => {
    setFormData((prev: GuideRegisterForm) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleFileChange = (e: FileChangeEvent, field: FileField): void => {
    const file = e.target.files?.[0] || null
    setFormData((prev: GuideRegisterForm) => ({
      ...prev,
      [field]: file,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newFormData = new FormData()
    newFormData.append("fullName", formData.fullName)
    newFormData.append("email", formData.email)
    newFormData.append("contactNumber", formData.contactNumber)
    newFormData.append("guideTypes", JSON.stringify(formData.guideTypes))
    newFormData.append("languages", JSON.stringify(formData.languages))
    newFormData.append("guidingAreas", JSON.stringify(formData.guidingAreas))
    newFormData.append("aboutMe", formData.aboutMe)
    newFormData.append("experiences", JSON.stringify(formData.experiences))

    // Ensure files are added correctly
    if (formData.licensePicture) {
      newFormData.append("liscensePhoto", formData.licensePicture)
    }
    if (formData.profilePicture) {
      newFormData.append("profilePhoto", formData.profilePicture)
    }
    // if (formData.certificationPicture) {
    //   newFormData.append("certificationPhoto", formData.certificationPicture)
    // }
    if (formData.introVideo) {
      newFormData.append("selfVideo", formData.introVideo)
    }

    try {
      setLoading(true)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/register`,
        newFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      const data = response.data
      if (data.success) {
        setSubmitted(true)
      } else {
        toast.error(data.message || "An error occurred")
      }
    } catch (error) {
      console.error("Registration Error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Function to handle going to the next step
  const goToNextStep = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    setCurrentStep(currentStep + 1)
  }

  // Function to handle going to the previous step
  const goToPreviousStep = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    setCurrentStep(currentStep - 1)
  }

  // Function to handle return
  const handleReturn = (e: React.MouseEvent) => {
    e.preventDefault()
    setSubmitted(false)
    setFormData(initialFormData)
    setCurrentStep(1)
  }

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[900px] mt-8 mb-8 md:p-12">
          {!submitted && (
            <h1 className="text-2xl font-bold text-primary mb-8 text-center">
              Guide Registration
            </h1>
          )}

          {submitted ? (
            <div className="max-w-lg mx-auto text-center">
              <div className="bg-green-50 border-l-4 border-green-500 rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center mb-4">
                  <svg
                    className="w-8 h-8 text-green-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <h3 className="text-xl font-bold text-gray-800">
                    Application Submitted Successfully!
                  </h3>
                </div>

                <p className="text-gray-600 mb-4">
                  Thank you for applying to join our guide network. Your profile
                  is now under review by our team.
                </p>

                <div className="bg-white rounded p-4 border border-gray-100 mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    What happens next?
                  </h4>
                  <ol className="text-sm text-left text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-500 rounded-full mr-2 text-xs">
                        1
                      </span>
                      <span>
                        Our team will review your qualifications within 3-5
                        business days.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-500 rounded-full mr-2 text-xs">
                        2
                      </span>
                      <span>
                        You'll receive an email notification with our decision.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-500 rounded-full mr-2 text-xs">
                        3
                      </span>
                      <span>
                        If approved, you'll get access to set up your
                        availability and complete your profile.
                      </span>
                    </li>
                  </ol>
                </div>

                <p className="text-gray-600">
                  If you have any questions, please contact us at{" "}
                  guidequery@gmn.com
                </p>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={handleReturn}
                    variant="outline"
                    className="mt-6 px-4 py-2 text-primary-dark border border-primary-dark hover:bg-gray-50 rounded transition-colors"
                  >
                    Return
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <StepIndicator currentStep={currentStep} />

              <form onSubmit={handleSubmit} className="space-y-6">
                {currentStep === 1 && (
                  <StepOne
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleGuideTypeChange={handleGuideTypeChange}
                  />
                )}
                {currentStep === 2 && (
                  <StepTwo
                    formData={formData}
                    handleArrayInput={handleArrayInput}
                    addArrayField={addArrayField}
                    removeArrayField={removeArrayField}
                  />
                )}
                {currentStep === 3 && (
                  <StepThree
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleArrayInput={handleArrayInput}
                    addArrayField={addArrayField}
                    removeArrayField={removeArrayField}
                  />
                )}
                {currentStep === 4 && (
                  <StepFour
                    formData={formData}
                    handleFileChange={handleFileChange}
                    setFormData={setFormData}
                  />
                )}

                <div className="flex justify-between pt-6">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      disabled={loading}
                      onClick={goToPreviousStep}
                      className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-text-primary font-medium"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span>Previous</span>
                    </Button>
                  )}
                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={goToNextStep}
                      className="flex items-center space-x-2 px-6 py-3 bg-primary-dark hover:bg-primary-darker text-white rounded-lg transition-colors font-medium ml-auto"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex items-center space-x-2 px-6 py-3 bg-primary-dark hover:bg-primary-darker text-white rounded-lg transition-colors font-medium ml-auto"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <span>Submitting, please wait... </span>
                          <Loader2Icon className="animate-spin w-5 h-5" />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Submit</span>
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      )}
                    </Button>
                  )}
                </div>

                <p className="text-center text-text-secondary pt-4">
                  Already have an account?{" "}
                  <Link
                    href="/login/guide"
                    className="text-primary hover:text-primary-dark font-medium transition-colors underline"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default GuideRegister
