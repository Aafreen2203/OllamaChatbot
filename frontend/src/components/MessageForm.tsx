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
    // Initial form animation with enhanced effects
    if (formRef.current) {
      gsap.fromTo(
        formRef.current, 
        { y: 50, opacity: 0, scale: 0.95 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
      )
    }
  }, [])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!content.trim() || !currentChat) return

    // Enhanced button animation
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.9,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      })
    }

    await sendMessage(content.trim())
    setContent("")

    // Reset textarea height with smooth animation
    if (textareaRef.current) {
      gsap.to(textareaRef.current, {
        height: "auto",
        duration: 0.3,
        ease: "power2.out"
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
    textarea.style.height = "auto"
    const newHeight = Math.min(textarea.scrollHeight, 200)
    gsap.to(textarea, {
      height: newHeight + "px",
      duration: 0.2,
      ease: "power2.out"
    })
  }

  const handleStop = () => {
    // Animate stop button
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      })
    }
    stopStreaming()
  }

  return (
    <div className="relative">
      {/* Form container - positioned normally without covering chats */}
      <div className="relative">
        <div className="relative px-6 py-8">
          {/* Transparent background with blur */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-md" />
          
          {/* Subtle top border glow only */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

          <div className="max-w-4xl mx-auto relative">
            <div ref={formRef}>
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-end space-x-4">
                  <div className="flex-1 relative group">
                    {/* Enhanced glowing border effect */}
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/40 via-blue-500/30 to-purple-500/40 opacity-60 blur-sm group-focus-within:opacity-80 transition-opacity duration-300" />
                    <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-purple-500/30 via-blue-500/20 to-purple-500/30 opacity-40 group-focus-within:opacity-60 transition-opacity duration-300" />
                    
                    {/* Pulsing glow effect */}
                    <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-purple-500/20 via-blue-500/15 to-purple-500/20 opacity-0 group-focus-within:opacity-100 blur-lg animate-pulse transition-opacity duration-500" />
                    
                    {/* Transparent textarea container with glass effect */}
                    <div className="relative rounded-3xl overflow-hidden border border-purple-500/20 group-focus-within:border-purple-500/40 transition-colors duration-300 bg-black/20 backdrop-blur-md">
                      <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder={currentChat ? "Type your message..." : "Create or select a chat to start messaging"}
                        disabled={!currentChat}
                        className="relative w-full resize-none border-0 bg-transparent px-6 py-5 pr-16 text-gray-100 placeholder-gray-400/70 transition-all duration-300 focus:outline-none focus:ring-0 focus:border-0 disabled:cursor-not-allowed rounded-3xl backdrop-blur-sm"
                        rows={1}
                        style={{ 
                          minHeight: "64px", 
                          maxHeight: "200px", 
                          outline: "none", 
                          boxShadow: "none"
                        }}
                      />
                      
                      {/* Subtle inner glow */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
                    </div>

                    {/* Enhanced Send/Stop button - centered vertically */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      {isStreaming ? (
                        <button
                          ref={buttonRef}
                          type="button"
                          onClick={handleStop}
                          className="group relative p-3.5 text-red-400 hover:text-red-300 focus:outline-none transition-all duration-300 transform hover:scale-110 rounded-xl"
                          title="Stop generation"
                        >
                          {/* Enhanced glow effects */}
                          <div className="absolute -inset-2 bg-red-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg" />
                          <div className="absolute -inset-1 bg-red-500/15 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                          <div className="absolute inset-0 bg-gradient-to-br from-red-500/25 to-red-600/25 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <svg className="relative w-6 h-6 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" strokeWidth={2.5} />
                            <rect x="9" y="9" width="6" height="6" strokeWidth={2.5} />
                          </svg>
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-xl pointer-events-none" />
                        </button>
                      ) : (
                        <button
                          ref={buttonRef}
                          type="submit"
                          disabled={!content.trim() || !currentChat}
                          className="group relative p-3.5 text-blue-200 hover:text-blue-500 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 disabled:hover:scale-100 rounded-xl"
                          title="Send message (Enter)"
                        >
                          <svg
                            className="relative w-6 h-6 z-10 transform rotate-90 group-hover:rotate-[102deg] group-disabled:rotate-90 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
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
      </div>
    </div>
  )
}

export default MessageForm
