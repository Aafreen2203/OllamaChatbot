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
  const statusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initial form animation
    if (formRef.current) {
      gsap.fromTo(formRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
    }
  }, [])

  useEffect(() => {
    // Animate status indicator
    if (statusRef.current) {
      if (isStreaming) {
        gsap.fromTo(statusRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" })
      } else {
        gsap.to(statusRef.current, {
          y: -20,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        })
      }
    }
  }, [isStreaming])

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

    // Reset textarea height with animation
    if (textareaRef.current) {
      gsap.to(textareaRef.current, {
        height: "auto",
        duration: 0.3,
        ease: "power2.out",
      })
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

    // Auto-resize textarea with smooth animation
    const textarea = e.target
    const newHeight = Math.min(textarea.scrollHeight, 200)
    gsap.to(textarea, {
      height: newHeight + "px",
      duration: 0.2,
      ease: "power2.out",
    })
  }

  const handleStop = () => {
    // Animate stop button
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        rotate: 180,
        duration: 0.3,
        ease: "power2.out",
      })
    }
    stopStreaming()
  }

  const handleFocus = () => {
    if (formRef.current) {
      gsap.to(formRef.current, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }

  const handleBlur = () => {
    if (formRef.current) {
      gsap.to(formRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }

  return (
    <div className="relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none" />

      <div className="relative border-t bg-white/80 backdrop-blur-xl px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div ref={formRef} className="relative">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-end space-x-4">
                <div className="flex-1 relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={currentChat ? "Type your message..." : "Create or select a chat to start messaging"}
                    disabled={!currentChat}
                    className="relative w-full resize-none rounded-2xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm px-6 py-4 pr-16 text-gray-800 placeholder-gray-500 shadow-lg transition-all duration-300 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:shadow-xl disabled:bg-gray-100 disabled:cursor-not-allowed hover:shadow-xl hover:border-gray-300"
                    rows={1}
                    style={{ minHeight: "56px", maxHeight: "200px" }}
                  />

                  {/* Send/Stop button */}
                  <div className="absolute right-3 bottom-3">
                    {isStreaming ? (
                      <button
                        ref={buttonRef}
                        type="button"
                        onClick={handleStop}
                        className="group relative p-3 text-red-500 hover:text-red-600 focus:outline-none transition-all duration-300 hover:scale-110"
                        title="Stop generation"
                      >
                        <div className="absolute inset-0 bg-red-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                        <svg className="relative w-6 h-6 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" strokeWidth={2} />
                          <rect x="9" y="9" width="6" height="6" strokeWidth={2} />
                        </svg>
                      </button>
                    ) : (
                      <button
                        ref={buttonRef}
                        type="submit"
                        disabled={!content.trim() || !currentChat}
                        className="group relative p-3 text-blue-500 hover:text-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 disabled:hover:scale-100"
                        title="Send message (Enter)"
                      >
                        <div className="absolute inset-0 bg-blue-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                        <svg
                          className="relative w-6 h-6 z-10 transform group-hover:rotate-12 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
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

            {/* Enhanced status indicator */}
            {isStreaming && (
              <div ref={statusRef} className="mt-4 flex items-center justify-center">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-full px-6 py-3 shadow-lg border border-green-100">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                    <span className="text-sm font-medium bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                      AI is thinking... Press Stop to interrupt
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageForm
