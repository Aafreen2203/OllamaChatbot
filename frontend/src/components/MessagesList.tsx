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
    // Enhanced welcome screen animation
    if (welcomeRef.current && !currentChat) {
      gsap.fromTo(
        welcomeRef.current,
        { y: 50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out", delay: 0.3 }
      )
    }
  }, [currentChat])

  useEffect(() => {
    // Enhanced message animations with stagger
    if (containerRef.current) {
      const messageElements = containerRef.current.querySelectorAll(".message-item:last-child")
      messageElements.forEach((element) => {
        gsap.fromTo(
          element,
          { y: 30, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
        )
      })
    }
  }, [messages])

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a0e13] relative overflow-hidden">
        {/* Enhanced background with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/8 via-transparent to-purple-900/8" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.08),transparent_60%)]" />

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-float-glow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div ref={welcomeRef} className="text-center relative z-10 max-w-2xl px-8">
          {/* Enhanced welcome icon with multiple glow layers */}
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-blue-500/25 rounded-full blur-3xl animate-pulse" />
            <div className="absolute inset-0 bg-purple-500/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30 border border-blue-400/40 glass-enhanced">
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
              <svg className="relative w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-6 gradient-text-enhanced">
            Welcome to Nokat AI
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-xl leading-relaxed mb-8">
            Select a chat from the sidebar or create a new one to get started with your AI conversation.
          </p>

          {/* Enhanced feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: "⚡", title: "Fast Responses", desc: "Powered by Ollama + Gemma" },
              { icon: "💬", title: "Smart Conversations", desc: "Context-aware AI chat" },
              { icon: "🎨", title: "Beautiful Interface", desc: "Modern design with animations" }
            ].map((feature, index) => (
              <div key={index} className="glass-enhanced rounded-2xl p-6 card-hover-3d group">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#0a0e13] relative custom-scrollbar">
      {/* Enhanced background with animated elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/4 via-transparent to-purple-900/4" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.06),transparent_60%)]" />

      {/* Today indicator with enhanced styling */}
      <div className="flex justify-center py-8 relative">
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-500/15 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors duration-300" />
          <div className="relative px-8 py-3 glass-enhanced rounded-2xl shadow-2xl border border-blue-400/20 group-hover:border-blue-400/30 transition-all duration-300">
            <span className="relative text-sm text-gray-300 font-semibold tracking-wide">Today</span>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="px-6 pb-8">
        <div className="max-w-4xl mx-auto space-y-10">
          {messages.map((message, i) => {
            const isUser = message.role === "user"
            const isStreamingMessage = message.id === "streaming"

            return (
              <div
                key={message.id || i}
                className={`message-item flex ${isUser ? "justify-end" : "justify-start"} group`}
              >
                {!isUser && (
                  <div className="flex-shrink-0 mr-5">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/25 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30 border border-blue-400/40 transform group-hover:scale-110 transition-all duration-300 glass-enhanced">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                        <svg
                          className="relative w-7 h-7 text-white"
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
                )}

                <div className="flex flex-col max-w-[85%]">
                  {/* Enhanced user label */}
                  {isUser && (
                    <div className="flex items-center justify-end mb-4">
                      <span className="text-sm text-gray-400 mr-4 font-semibold">You</span>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gray-500/25 rounded-full blur-md opacity-75" />
                        <div className="relative w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-xl border border-gray-500/40 glass-enhanced">
                          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                          <svg
                            className="relative w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
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

                  {/* Enhanced AI label */}
                  {!isUser && (
                    <div className="flex items-center mb-4">
                      <span className="text-sm text-gray-400 ml-16 font-semibold">Nokat AI</span>
                    </div>
                  )}

                  {/* Enhanced message content with premium styling */}
                  <div
                    className={`relative rounded-2xl px-8 py-6 shadow-2xl transition-all duration-300 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transform group-hover:scale-[1.01] card-hover-3d ${
                      isUser
                        ? "glass-enhanced border border-blue-400/20 text-gray-100 ml-auto"
                        : "glass-enhanced border border-purple-400/20 text-gray-100"
                    }`}
                  >
                    {/* Enhanced glow effects */}
                    <div
                      className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                        isUser
                          ? "bg-gradient-to-r from-blue-500/8 to-cyan-500/8 opacity-0 group-hover:opacity-100"
                          : "bg-gradient-to-r from-purple-500/8 to-pink-500/8 opacity-0 group-hover:opacity-100"
                      }`}
                    />

                    <div className="relative whitespace-pre-wrap break-words leading-relaxed text-lg">
                      {message.content}
                      {isStreamingMessage && (
                        <span className="inline-block w-3 h-7 bg-gradient-to-r from-blue-400 to-purple-400 ml-3 animate-pulse rounded-sm shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                      )}
                    </div>
                  </div>

                  {/* Enhanced action buttons for AI messages */}
                  {!isUser && !isStreamingMessage && (
                    <div className="flex items-center justify-between mt-6 ml-16">
                      <div className="flex items-center space-x-4">
                        {[
                          { path: "M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5", tooltip: "Like" },
                          { path: "M7 13l3 3 7-7", tooltip: "Mark as helpful" },
                          { path: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z", tooltip: "Copy" },
                          { path: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", tooltip: "Regenerate" }
                        ].map((action, index) => (
                          <button
                            key={index}
                            className="relative group/btn p-3 text-gray-500 hover:text-gray-300 transition-all duration-300 transform hover:scale-110 glass-enhanced rounded-xl border border-gray-600/20"
                            title={action.tooltip}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                            <svg className="relative w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.path} />
                            </svg>
                          </button>
                        ))}
                      </div>

                      {/* Enhanced model selector */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/10 rounded-xl blur-md opacity-0 hover:opacity-100 transition-all duration-300" />
                        <select className="relative glass-enhanced border border-blue-400/20 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500/50 shadow-xl cursor-pointer">
                          <option>NokatFlax</option>
                          <option>Nokat 2.0</option>
                          <option>Gemma Pro</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Enhanced streaming indicator */}
          {isStreaming && messages.length > 0 && messages[messages.length - 1].role === "user" && (
            <div className="message-item flex justify-start group">
              <div className="flex-shrink-0 mr-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-lg animate-pulse" />
                  <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/40 border border-blue-400/50 glass-enhanced">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                    <svg
                      className="relative w-7 h-7 text-white animate-spin"
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
              <div className="flex flex-col">
                <div className="flex items-center mb-4">
                  <span className="text-sm text-gray-400 ml-16 font-semibold">Nokat AI</span>
                </div>
                <div className="relative glass-enhanced border border-purple-400/30 rounded-2xl px-8 py-6 shadow-2xl">
                  <div className="relative flex space-x-3">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-4 h-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full animate-bounce shadow-[0_0_12px_rgba(59,130,246,0.8)]"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
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
