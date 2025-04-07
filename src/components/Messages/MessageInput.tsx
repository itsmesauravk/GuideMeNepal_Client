import React, { useState, useRef, ChangeEvent } from "react"
import { Send, Paperclip, X, File, FileTypeIcon } from "lucide-react"

import Image from "next/image"
import { Button } from "../ui/button"

interface MessageInputProps {
  onSendButtonClicked: (data: { message: string; attachments: File[] }) => void
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendButtonClicked }) => {
  const [message, setMessage] = useState<string>("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({})

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFilesSelected = (files: File[]) => {
    setAttachments((prevAttachments) => [...prevAttachments, ...files])

    // Generate preview URLs for image files
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file)
        setPreviewUrls((prev) => ({ ...prev, [file.name]: url }))
      }
    })
  }

  const handleSubmit = () => {
    onSendButtonClicked({ message, attachments })
    // Clear the message and attachments.
    setMessage("")
    setAttachments([])
    // Clean up object URLs to prevent memory leaks
    Object.values(previewUrls).forEach((url) => URL.revokeObjectURL(url))
    setPreviewUrls({})
    // Reset the file input value so the same file can be selected again.
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray: File[] = Array.from(event.target.files)
      handleFilesSelected(filesArray)
    }
  }

  const removeAttachment = (index: number) => {
    const fileToRemove = attachments[index]
    // Clean up the object URL if it exists
    if (previewUrls[fileToRemove.name]) {
      URL.revokeObjectURL(previewUrls[fileToRemove.name])
      setPreviewUrls((prev) => {
        const newUrls = { ...prev }
        delete newUrls[fileToRemove.name]
        return newUrls
      })
    }

    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toUpperCase() || ""
  }

  return (
    <div className="border-t border-mistGray-400 p-3 bg-white">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((file, index) => (
            <div key={index} className="relative group flex gap-4">
              <div className="w-16 h-16 rounded-lg border border-mistGray-300 flex items-center justify-center overflow-hidden bg-gray-100">
                {file.type.startsWith("image/") ? (
                  <div className="w-full h-full">
                    <Image
                      src={previewUrls[file.name]}
                      alt={file.name}
                      width={100}
                      height={100}
                      className="w-full rounded-lg h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col rounded-lg items-center justify-center">
                    {getFileExtension(file.name) === "PDF" && (
                      <Image
                        src={"/assets/svg/pdf.svg"}
                        alt="file type icon"
                        height={100}
                        width={100}
                        className="w-6 h-6 object-cover"
                      />
                    )}
                    {getFileExtension(file.name) === "DOCX" && (
                      <Image
                        src={"/assets/svg/DOC.svg"}
                        alt="file type icon"
                        height={100}
                        width={100}
                        className="w-6 h-6 object-cover"
                      />
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => removeAttachment(index)}
                className="absolute -top-2 -right-2 bg-white text-gray-700 rounded-full w-5 h-5 flex items-center justify-center border border-gray-300"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center rounded-full border border-mistGray-300 bg-white px-3 py-2">
        <button
          className="text-gray-500 hover:text-gray-700 mr-2"
          onClick={handleButtonClick}
        >
          <Paperclip size={20} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          multiple
        />
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border-none focus:ring-0 outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              if (message.trim() || attachments.length > 0) {
                handleSubmit()
              }
            }
          }}
        />
        <button
          onClick={handleSubmit}
          className={`ml-2 p-2 rounded-full ${
            message.trim() || attachments.length > 0
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
          disabled={!message.trim() && attachments.length === 0}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}

export default MessageInput
