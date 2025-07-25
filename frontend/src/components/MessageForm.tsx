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
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Initial form animation
    if (formRef.current) {
      gsap.fromTo(formRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" })
    }
  }, [])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!content.trim() || !currentChat) return

    // Animate button on submit
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      })
    }

    await sendMessage(content.trim())
    setContent("")

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)

    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = "auto"
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px"
  }

  const handleStop = () => {
    stopStreaming()
  }

  return (
    <div className="border-t border-gray-700/50 bg-[#1a1d29] px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div ref={formRef}>
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder={currentChat ? "Type your message..." : "Create or select a chat to start messaging"}
                  disabled={!currentChat}
                  className="w-full resize-none rounded-xl border border-gray-600/50 bg-[#2a2d3a] px-4 py-3 pr-12 text-gray-100 placeholder-gray-400 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 disabled:bg-gray-800/50 disabled:cursor-not-allowed transition-all duration-200"
                  rows={1}
                  style={{ minHeight: "48px", maxHeight: "200px" }}
                />

                {/* Send/Stop button */}
                <div className="absolute right-2 bottom-2">
                  {isStreaming ? (
                    <button
                      ref={buttonRef}
                      type="button"
                      onClick={handleStop}
                      className="p-2 text-gray-400 hover:text-red-400 focus:outline-none transition-colors duration-200"
                      title="Stop generation"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      ref={buttonRef}
                      type="submit"
                      disabled={!content.trim() || !currentChat}
                      className="p-2 text-gray-400 hover:text-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      title="Send message (Enter)"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MessageForm
