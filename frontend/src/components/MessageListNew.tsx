"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useChatContext } from "../utils/useChatContext"

gsap.registerPlugin(ScrollTrigger)

const MessagesList = () => {
  const { messages, isStreaming, currentChat } = useChatContext()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const welcomeRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Animate welcome screen
    if (welcomeRef.current && !currentChat) {
      gsap.fromTo(
        welcomeRef.current,
        { y: 50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
      )
    }
  }, [currentChat])

  useEffect(() => {
    // Animate new messages
    if (containerRef.current) {
      const messageElements = containerRef.current.querySelectorAll(".message-item:last-child")
      messageElements.forEach((element) => {
        gsap.fromTo(
          element,
          { y: 30, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
        )
      })
    }
  }, [messages])

  useEffect(() => {
    // Set up scroll-triggered animations for existing messages
    if (containerRef.current) {
      const messageElements = containerRef.current.querySelectorAll(".message-item")

      messageElements.forEach((element, index) => {
        gsap.fromTo(
          element,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "play none none reverse",
            },
          },
        )
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [messages])

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]" />

        <div ref={welcomeRef} className="relative text-center z-10">
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-20 animate-pulse" />
            <svg
              className="relative w-24 h-24 mx-auto text-gray-400 animate-float"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Welcome to ChatGPT Clone
          </h2>
          <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
            Select a chat from the sidebar or create a new one to get started with your AI conversation.
          </p>

          {/* Floating elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-float-delayed" />
          <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-float-slow" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto relative">
      {/* Scrolling background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-transparent to-gray-50/50 pointer-events-none" />

      <div ref={containerRef} className="relative px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, i) => {
            const isUser = message.role === "user"
            const isStreamingMessage = message.id === "streaming"

            return (
              <div
                key={message.id || i}
                className={`message-item flex ${isUser ? "justify-end" : "justify-start"} group`}
              >
                {!isUser && (
                  <div className="flex-shrink-0 mr-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[75%] rounded-3xl px-6 py-4 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:shadow-xl ${
                    isUser
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto transform group-hover:scale-[1.02]"
                      : "bg-white/90 text-gray-800 border border-gray-100 transform group-hover:scale-[1.02]"
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words leading-relaxed">
                    {message.content}
                    {isStreamingMessage && (
                      <span className="inline-block w-3 h-6 bg-current ml-2 animate-pulse rounded-sm" />
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="flex-shrink-0 ml-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Enhanced streaming indicator */}
          {isStreaming && messages.length > 0 && messages[messages.length - 1].role === "user" && (
            <div className="message-item flex justify-start group">
              <div className="flex-shrink-0 mr-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-sm opacity-75 animate-pulse" />
                  <div className="relative w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-6 h-6 text-white animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl px-6 py-4 shadow-lg border border-gray-100">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full animate-bounce" />
                  <div
                    className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}

export default MessagesList
