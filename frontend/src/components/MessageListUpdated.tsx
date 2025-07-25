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
      gsap.fromTo(welcomeRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" })
    }
  }, [currentChat])

  useEffect(() => {
    // Animate new messages
    if (containerRef.current) {
      const messageElements = containerRef.current.querySelectorAll(".message-item:last-child")
      messageElements.forEach((element) => {
        gsap.fromTo(element, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" })
      })
    }
  }, [messages])

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1a1d29]">
        <div ref={welcomeRef} className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-100">Welcome to ChatGPT Clone</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Select a chat from the sidebar or create a new one to get started with your AI conversation.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#1a1d29]">
      {/* Today indicator */}
      <div className="flex justify-center py-4">
        <div className="px-4 py-1 bg-[#2a2d3a] border border-gray-600/50 rounded-full">
          <span className="text-sm text-gray-300">Today</span>
        </div>
      </div>

      <div ref={containerRef} className="px-6 pb-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, i) => {
            const isUser = message.role === "user"
            const isStreamingMessage = message.id === "streaming"

            return (
              <div key={message.id || i} className={`message-item flex ${isUser ? "justify-end" : "justify-start"}`}>
                {!isUser && (
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="flex flex-col max-w-[80%]">
                  {/* User label */}
                  {isUser && (
                    <div className="flex items-center justify-end mb-2">
                      <span className="text-sm text-gray-400 mr-3">You</span>
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* AI label */}
                  {!isUser && (
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-gray-400 ml-12">Nokat AI</span>
                    </div>
                  )}

                  {/* Message content */}
                  <div
                    className={`rounded-xl px-4 py-3 ${
                      isUser
                        ? "bg-[#2a2d3a] border border-gray-600/50 text-gray-100 ml-auto"
                        : "bg-[#2a2d3a] border border-gray-600/50 text-gray-100"
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {message.content}
                      {isStreamingMessage && <span className="inline-block w-2 h-5 bg-gray-400 ml-1 animate-pulse" />}
                    </div>
                  </div>

                  {/* Action buttons for AI messages */}
                  {!isUser && !isStreamingMessage && (
                    <div className="flex items-center space-x-2 mt-3 ml-12">
                      <button className="p-1.5 text-gray-500 hover:text-gray-300 transition-colors duration-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                          />
                        </svg>
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-gray-300 transition-colors duration-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13l3 3 7-7" />
                        </svg>
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-gray-300 transition-colors duration-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-gray-300 transition-colors duration-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </button>

                      {/* Model selector */}
                      <div className="ml-auto">
                        <select className="bg-[#1a1d29] border border-gray-600/50 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50">
                          <option>NokatFlax</option>
                          <option>Nokat 2.0</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Streaming indicator */}
          {isStreaming && messages.length > 0 && messages[messages.length - 1].role === "user" && (
            <div className="message-item flex justify-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white animate-spin"
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
              <div className="flex flex-col">
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-400 ml-12">Nokat AI</span>
                </div>
                <div className="bg-[#2a2d3a] border border-gray-600/50 rounded-xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
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
