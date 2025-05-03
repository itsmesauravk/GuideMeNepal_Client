import * as React from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

interface ViewFullImageProps {
  handleViewFullImage: () => void
  viewFullImage: boolean
  imageUrls?: string[]
}

interface ImageListType {
  src: string
  alt: string
  width: number
  height: number
}

const FullSizeImage: React.FC<ViewFullImageProps> = ({
  handleViewFullImage,
  viewFullImage,
  imageUrls,
}) => {
  const [images, setImages] = React.useState<ImageListType[]>([])

  React.useEffect(() => {
    if (imageUrls && imageUrls.length > 0) {
      const imageList = imageUrls.map((url) => ({
        src: url,
        alt: "image",
        width: 3840,
        height: 2560,
      }))
      setImages(imageList)
    } else {
      setImages([
        {
          src: "/images/rara.jpg",
          alt: "Default image 2",
          width: 3840,
          height: 2560,
        },
      ])
    }
  }, [imageUrls])

  return (
    <Lightbox
      open={viewFullImage}
      close={handleViewFullImage}
      slides={images}
    />
  )
}

export default FullSizeImage
