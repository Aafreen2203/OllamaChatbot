"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { useChatContext } from "../utils/useChatContext"
import FileUpload from "./FileUpload"
import VoiceInput from "./VoiceInput"

const MessageForm = () => {
  const [content, setContent] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const { sendMessage, stopStreaming, isStreaming, currentChat } = useChatContext()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      )
    }
  }, [currentChat])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!content.trim() || !currentChat) return

    // TODO: Handle file upload with message
    if (selectedFile) {
      // For now, just include file info in the message
      const fileInfo = `[File attached: ${selectedFile.name}]\n\n`
      await sendMessage(fileInfo + content.trim())
      setSelectedFile(null)
      setFilePreview(null)
    } else {
      await sendMessage(content.trim())
    }
    
    setContent("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleFileSelect = (file: File, preview?: string) => {
    setSelectedFile(file)
    setFilePreview(preview || null)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
  }

  const handleVoiceTranscription = (text: string) => {
    setContent(prev => prev + (prev ? ' ' : '') + text)
    // Auto-resize textarea after voice input
    setTimeout(() => adjustTextareaHeight(), 100)
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200)
      textareaRef.current.style.height = `${newHeight}px`
      
      // Show scrollbar only when content exceeds max height
      if (textareaRef.current.scrollHeight > 200) {
        textareaRef.current.style.overflowY = "auto"
      } else {
        textareaRef.current.style.overflowY = "hidden"
      }
    }
  }

  // Center the form when no chat is active
  const containerClass = currentChat 
    ? "bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl p-4"
    : "flex-1 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl"

  return (
    <div className={containerClass}>
      <div ref={formRef} className={`max-w-4xl mx-auto ${!currentChat ? 'w-full max-w-2xl' : ''}`}>
        <form onSubmit={handleSubmit} className="relative">
          <div className={` rounded-5xl ${!currentChat ? 'p-6' : 'p-4'}`}>
            {/* File Upload Section */}
            {showFileUpload && (
              <div className="mb-4">
                <FileUpload
                  onFileSelect={handleFileSelect}
                  onRemoveFile={handleRemoveFile}
                  selectedFile={selectedFile}
                  preview={filePreview}
                  disabled={!currentChat || isStreaming}
                />
              </div>
            )}
            
            <div className="relative">
              <div className="flex items-end space-x-2">
                {/* File attachment button */}
                <button
                  type="button"
                  onClick={() => setShowFileUpload(!showFileUpload)}
                  disabled={!currentChat || isStreaming}
                  className={`p-3 rounded-lg transition-all duration-200 self-end ${
                    showFileUpload
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400'
                  } ${!currentChat || isStreaming ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Attach file"
                  style={{ marginBottom: '8px' }} // Align with textarea bottom padding
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>

                {/* Voice input button */}
                <div className="self-end" style={{ marginBottom: '8px' }}>
                  <VoiceInput
                    onTranscription={handleVoiceTranscription}
                    disabled={!currentChat || isStreaming}
                  />
                </div>

                {/* Textarea container */}
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value)
                      adjustTextareaHeight()
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={currentChat ? "Message..." : "Ask me anything..."}
                    disabled={!currentChat}
                    rows={1}
                    className={`w-full resize-none bg-transparent rounded-2xl pr-12 pl-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none disabled:cursor-not-allowed border-blue-400 border-1 ${!currentChat ? 'text-lg' : 'text-sm'}`}
                    style={{ 
                      minHeight: "40px", 
                      maxHeight: "200px",
                      overflowY: "hidden"
                    }}
                  />
                  
                  {/* Send button positioned inside the textarea */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    {isStreaming ? (
                      <button
                        type="button"
                        onClick={stopStreaming}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        title="Stop generation"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="6" y="6" width="12" height="12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!content.trim()}
                        className={`p-2 rounded-full transition-all duration-200 shadow-lg transform border-2 ${
                          content.trim()
                            ? "bg-transparent border-blue-400 hover:border-blue-500 text-blue-600 dark:text-blue-400 hover:shadow-xl hover:scale-105"
                            : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed border-gray-300 dark:border-gray-600"
                        }`}
                        title="Send message"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MessageForm