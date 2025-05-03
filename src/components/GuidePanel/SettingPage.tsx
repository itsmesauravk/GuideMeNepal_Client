"use client"
import React, { useEffect, useState } from "react"
import { Tabs, Tab, Card, CardBody, Switch } from "@heroui/react"
import GeneralSetting from "./GeneralSetting"
import GuidingSetting from "./GuidingSetting"
import ImagesAndVideosSetting from "./ImagesAndVideosSetting"
import SecuritySetting from "./SecuritySetting"

import { GuideDetailsType } from "@/utils/Types"
import { SessionData } from "@/utils/Types"
import { useSession } from "next-auth/react"
import axios from "axios"
import OtherSetting from "./OtherSetting"

const SettingPage = () => {
  const [isVertical, setIsVertical] = useState(false)
  const [guideDetails, setGuideDetails] = useState<GuideDetailsType | null>(
    null
  )
  const [loading, setLoading] = useState<Boolean>(false)

  const { data: sessionData } = useSession()

  const session = sessionData as unknown as SessionData
  const guideId = session?.user?.id

  //get guide details
  const handleGetGuideDetails = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/get/${guideId}`
      )
      const data = response.data
      if (data.success) {
        setGuideDetails(data.data)
      }
    } catch (error) {
      console.error("Error fetching guide details:", error)
    } finally {
      setLoading(false)
    }
  }

  const onSuccessHandler = () => {
    handleGetGuideDetails()
  }

  useEffect(() => {
    if (!guideId) return
    handleGetGuideDetails()
  }, [guideId])

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)")

    const handleResize = () => {
      setIsVertical(!mediaQuery.matches)
    }

    handleResize() // Initial check
    mediaQuery.addEventListener("change", handleResize)

    return () => mediaQuery.removeEventListener("change", handleResize)
  }, [])

  return (
    <div className=" w-full flex flex-col px-4 py-4 mt-32 lg:mt-0">
      <div className="flex items-center mt-4 mb-4">
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>
      <div className="flex w-full flex-col">
        <Tabs aria-label="Options" isVertical={isVertical}>
          <Tab key="general" title="General" className="w-full">
            <Card>
              <CardBody>
                <GeneralSetting
                  guideDetails={guideDetails}
                  onSuccessHandler={onSuccessHandler}
                />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="guiding" title="Guiding" className="w-full">
            <Card>
              <CardBody>
                <GuidingSetting
                  guideDetails={guideDetails}
                  onSuccessHandler={onSuccessHandler}
                />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="imagesvideos" title="Images & Videos" className="w-full">
            <Card>
              <CardBody>
                <ImagesAndVideosSetting
                  guideDetails={guideDetails}
                  onSuccessHandler={onSuccessHandler}
                />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="security" title="Security" className="w-full">
            <Card>
              <CardBody>
                <SecuritySetting
                  guideDetails={guideDetails}
                  onSuccessHandler={onSuccessHandler}
                />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="other" title="Others" className="w-full">
            <Card>
              <CardBody>
                <OtherSetting
                  guideDetails={guideDetails}
                  onSuccessHandler={onSuccessHandler}
                />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

export default SettingPage
