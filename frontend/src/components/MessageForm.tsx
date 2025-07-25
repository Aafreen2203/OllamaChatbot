"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { useChatContext } from "../utils/useChatContext"

const MessageForm = () => {
  const [content, setContent] = useState("")
  const [pendingMessage, setPendingMessage] = useState("")
  const { sendMessage, stopStreaming, isStreaming, currentChat, createNewChat } = useChatContext()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" })
    }
  }, [currentChat])

  useEffect(() => {
    adjustTextareaHeight()
  }, [content])

  // Send pending message when a new chat is created
  useEffect(() => {
    if (currentChat && pendingMessage.trim()) {
      sendMessage(pendingMessage.trim())
      setPendingMessage("")
      setContent("")
    }
  }, [currentChat, pendingMessage, sendMessage])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!content.trim()) return

    // If no current chat, create one first and store the message to send later
    if (!currentChat) {
      setPendingMessage(content.trim())
      await createNewChat()
      return
    }

    await sendMessage(content.trim())
    setContent("")
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
          <div className={`rounded-5xl ${!currentChat ? 'p-6' : 'p-4'}`}>
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={currentChat ? "Type your message..." : "Start a conversation..."}
                className="w-full resize-none rounded-3xl border-0 bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm px-6 py-4 pr-14 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 min-h-[56px] max-h-[200px] overflow-hidden"
                rows={1}
                disabled={isStreaming}
              />
              
              {/* Send Button */}
              <div className="absolute right-2 top-1/2 transform -translate-y-5 flex items-center space-x-2">
                {isStreaming ? (
                  <button
                    type="button"
                    onClick={stopStreaming}
                    className="p-3 rounded-3xl bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
                    title="Stop generating"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!content.trim()}
                    className={`p-3 rounded-3xl transition-all duration-200 shadow-lg hover:shadow-xl ${
                      content.trim()
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
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
