"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { useChatContext } from "../utils/useChatContext"

const MessageForm = () => {
  const [content, setContent] = useState("")
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

    setContent("")
    await sendMessage(content.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }

  // Center the form when no chat is active
  const containerClass = currentChat 
    ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 p-4"
    : "flex-1 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl"

  return (
    <div className={containerClass}>
      <div ref={formRef} className={`max-w-4xl mx-auto ${!currentChat ? 'w-full max-w-2xl' : ''}`}>
        <form onSubmit={handleSubmit} className="relative">
          <div className={`backdrop-blur-lg rounded-5xl shadow-xl ${!currentChat ? 'p-6' : 'p-4'}`}>
            <div className="relative">
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
                style={{ minHeight: "40px", maxHeight: "200px" }}
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
        </form>
      </div>
    </div>
  )
}

export default MessageForm