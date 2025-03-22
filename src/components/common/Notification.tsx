import React from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button as HeroButton,
} from "@heroui/react"

// Define the props interface
interface NotificationProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  title?: string
  content?: React.ReactNode
  onAction?: () => void
  actionButtonText?: string
  closeButtonText?: string
  actionButtonColor?: string
}

const Notification: React.FC<NotificationProps> = ({
  isOpen,
  onOpenChange,
  title = "Notification",
  content,
}) => {
  return (
    <Drawer isOpen={isOpen} size="lg" onOpenChange={onOpenChange}>
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex flex-col gap-1">{title}</DrawerHeader>
            <DrawerBody>
              {content ? (
                content
              ) : (
                <>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam pulvinar risus non risus hendrerit venenatis.
                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam pulvinar risus non risus hendrerit venenatis.
                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
                  </p>
                </>
              )}
            </DrawerBody>
            <DrawerFooter>
              <HeroButton color="danger" variant="light" onPress={onClose}>
                Close
              </HeroButton>
              <HeroButton color="primary" onPress={onClose}>
                Action
              </HeroButton>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}

export default Notification
