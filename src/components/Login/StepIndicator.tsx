import React from "react"

interface StepIndicatorProps {
  currentStep: number
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => (
  <div className="mb-8">
    <div className="flex justify-between items-center mb-4">
      {[1, 2, 3, 4].map((step) => (
        <div
          key={step}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === currentStep
              ? "bg-primary-dark text-white"
              : step < currentStep
              ? "bg-primary-darker text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {step}
        </div>
      ))}
    </div>
    <div className="relative h-2 bg-gray-200 rounded">
      <div
        className="absolute h-full bg-primary-dark rounded transition-all duration-300"
        style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
      ></div>
    </div>
  </div>
)

export default StepIndicator
