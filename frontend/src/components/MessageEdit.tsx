"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface MessageEditProps {
  messageId: string
  originalContent: string
  isOpen: boolean
  onSave: (messageId: string, newContent: string) => void
  onCancel: () => void
}

const MessageEdit: React.FC<MessageEditProps> = ({
  messageId,
  originalContent,
  isOpen,
  onSave,
  onCancel
}) => {
  const [editedContent, setEditedContent] = useState(originalContent)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditedContent(originalContent)
  }, [originalContent])

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
      adjustTextareaHeight()
    }
  }, [isOpen])

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 300)}px`
    }
  }

  const handleSave = () => {
    if (editedContent.trim() && editedContent.trim() !== originalContent) {
      onSave(messageId, editedContent.trim())
    } else {
      onCancel()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Escape") {
      e.preventDefault()
      onCancel()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-600/50 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Edit Message
          </h3>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-gray-200/80 dark:hover:bg-gray-700/50 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <textarea
            ref={textareaRef}
            value={editedContent}
            onChange={(e) => {
              setEditedContent(e.target.value)
              adjustTextareaHeight()
            }}
            onKeyDown={handleKeyDown}
            className="w-full resize-none bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Edit your message..."
            style={{ minHeight: "100px", maxHeight: "300px" }}
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Press Ctrl+Enter to save, Esc to cancel
            </p>
            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!editedContent.trim() || editedContent.trim() === originalContent}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  editedContent.trim() && editedContent.trim() !== originalContent
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageEdit
