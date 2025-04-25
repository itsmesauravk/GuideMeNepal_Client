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
  totalReviews: number
  averageRating: number
  availability_date?: [
    {
      id: number
      startDate: string
      endDate: string
      reason: string
    }
  ]
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
  contact: string
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
  reviewstatus: boolean
  reportstatus?: boolean
  cancelMessage: string | null
  travelStatus: string
  travelLocations: string[]

  platformLiability: boolean
  createdAt: string
  updatedAt: string
  Guide: Guide
  User: User
}

interface User {
  id?: number
  slug?: string
  fullName: string
  email?: string
  profilePicture: string
  country?: string
}

export interface Booking {
  id: number
  userId: number
  guideId: number
  destination: string
  contact: string
  travelLocations: string[]
  startingLocation: string
  accommodation: string
  numberOfAdults: number
  numberOfChildren: number
  estimatedDays: number
  estimatedPrice: number | null
  startDate: string
  endDate: string
  cancelMessage: string | null
  bookingDate: string
  bookingMessage: string
  bookingType: string
  bookingStatus: string
  travelStatus: string
  platformLiability: boolean
  createdAt: string
  updatedAt: string
  User: User
}

//auth

export interface SessionData {
  jwt?: string
  user: {
    id: string
    email: string
    name: string
    role: string
    image: string
    firstTimeLogin?: boolean
  }
}

//guide review
export interface GuideReviewType {
  id: number
  guideId?: number
  userId?: number
  rating: number
  destination: string
  comments: string | null
  createdAt: string
  updatedAt?: string
  user: User
}

//notification types
export interface NotificationType {
  id: number
  title: string
  description: string
  notificationType: string
  isRead: boolean
  userId?: number
  guideId?: number
  bookingId?: number
  createdAt: string
}
