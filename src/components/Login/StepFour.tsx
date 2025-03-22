import React from "react"
import { Camera, Video } from "lucide-react"
import { GuideRegisterForm } from "@/utils/Types"
import { FileChangeEvent, FileField } from "./GuideRegister"

interface StepFourProps {
  formData: GuideRegisterForm
  handleFileChange: (e: FileChangeEvent, field: FileField) => void
  setFormData: React.Dispatch<React.SetStateAction<GuideRegisterForm>>
}

const StepFour: React.FC<StepFourProps> = ({
  formData,
  handleFileChange,
  setFormData,
}) => {
  return (
    <div className="space-y-6">
      {/* profile  */}
      <div>
        <label className="block text-text-primary font-medium mb-2">
          Profile Photo
        </label>
        <div className="relative">
          <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
          <input
            type="file"
            onChange={(e) => handleFileChange(e, "profilePicture")}
            className="w-full pl-10 pr-4 py-3 border border-background-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary bg-background-secondary"
            accept="image/*"
          />
        </div>
        {/* preview  */}
        {formData.profilePicture && (
          <img
            src={URL.createObjectURL(formData.profilePicture)}
            alt="profile"
            className="w-32 h-32 mt-2 rounded-lg"
          />
        )}
      </div>
      {/* liscense  */}
      <div>
        <label className="block text-text-primary font-medium mb-2">
          Guiding License Photo
        </label>
        <div className="relative">
          <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
          <input
            type="file"
            onChange={(e) => handleFileChange(e, "licensePicture")}
            className="w-full pl-10 pr-4 py-3 border border-background-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary bg-background-secondary"
            accept="image/*"
          />
        </div>
        {/* preview  */}
        {formData.licensePicture && (
          <img
            src={URL.createObjectURL(formData.licensePicture)}
            alt="license"
            className="w-40 h-32 mt-2 rounded-lg"
          />
        )}
      </div>
      {/* certification  */}
      {/* <div>
        <label className="block text-text-primary font-medium mb-2">
          Other Certification Photo
        </label>
        <div className="relative">
          <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
          <input
            type="file"
            onChange={(e) => handleFileChange(e, "certificationPicture")}
            className="w-full pl-10 pr-4 py-3 border border-background-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary bg-background-secondary"
            accept="image/*"
          />
        </div>
      </div> */}

      <div>
        <label className="block text-text-primary font-medium mb-2">
          Introduction Video
        </label>
        <div className="relative">
          <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
          <input
            type="file"
            onChange={(e) => handleFileChange(e, "introVideo")}
            className="w-full pl-10 pr-4 py-3 border border-background-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary bg-background-secondary"
            accept="video/*"
          />
        </div>
        {/* preview  */}
        {formData.introVideo && (
          <video
            src={URL.createObjectURL(formData.introVideo)}
            className="w-52 h-36 mt-2 rounded-lg"
            controls
          />
        )}
      </div>

      <div className="space-y-3">
        <label className="flex items-start space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={(e) =>
              setFormData({ ...formData, termsAccepted: e.target.checked })
            }
            className="mt-1 w-4 h-4 text-primary"
          />
          <span className="text-text-primary">
            I have read all the terms and conditions and privacy policy
          </span>
        </label>

        <label className="flex items-start space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.dataAgreement}
            onChange={(e) =>
              setFormData({ ...formData, dataAgreement: e.target.checked })
            }
            className="mt-1 w-4 h-4 text-primary"
          />
          <span className="text-text-primary">
            I agree the data provided by me is correct and my data can be viewed
            by potential clients
          </span>
        </label>
      </div>
    </div>
  )
}

export default StepFour
