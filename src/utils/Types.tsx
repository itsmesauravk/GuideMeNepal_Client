export interface GuideRegisterForm {
  fullName: string
  email: string
  contactNumber: string
  guideTypes: string[]
  languages: string[]
  guidingAreas: string[]
  aboutMe: string
  experiences: string[]
  profilePicture: File | null
  licensePicture: File | null
  certificationPicture: File | null
  introVideo: File | null
  termsAccepted: boolean
  dataAgreement: boolean
}

export interface GuideDetailsType {
  id: number
  fullname: string
  slug: string
  guidingAreas: string[]
  profilePhoto: string
  liscensePhoto: string
  selfVideo: string
  verified: boolean
  createdAt: string
  aboutMe: string
  experiences: string[]
  languageSpeak: string[]
  availability: {
    isActive: boolean
    isAvailable: boolean
  }
  created_at: string
  lastActiveAt: string
}

interface Guide {
  id: number
  slug: string
  fullname: string
  email: string
  profilePhoto: string
}

export interface BookingType {
  id: number
  userId: number
  guideId: number
  destination: string
  startingLocation: string
  accommodation: string
  numberOfAdults: number
  numberOfChildren: number
  estimatedDays: number
  estimatedPrice: number | null
  startDate: string
  endDate: string
  bookingDate: string | null
  bookingMessage: string
  bookingType: string
  bookingStatus: string
  travelStatus: string
  platformLiability: boolean
  createdAt: string
  updatedAt: string
  Guide: Guide
}
