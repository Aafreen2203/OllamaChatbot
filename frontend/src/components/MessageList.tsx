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
      <div className="flex-1 flex items-center justify-center relative">
        {/* Simple static background - transparent with blur */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-md" />
        
        <div ref={welcomeRef} className="text-center max-w-md mx-auto p-8 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border border-purple-400/30 relative overflow-hidden">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 animate-pulse rounded-full blur-xl" />
            <svg className="w-10 h-10 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Welcome to Promptly AI
          </h2>
          <p className="text-gray-400 max-w-md mx-auto leading-relaxed text-lg">
            Select a chat from the sidebar or create a new one to get started with your AI conversation.
          </p>
          
          {/* Animated suggestions */}
          <div className="mt-8 space-y-3">
            <div className="glass-enhanced bg-black/20 border border-purple-600/20 rounded-xl p-4 text-left hover:border-purple-400/40 transition-all duration-300 cursor-pointer group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="flex items-center space-x-3 relative z-10">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors duration-300">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-gray-300 text-sm">Start a creative writing session</span>
              </div>
            </div>
            
            <div className="glass-enhanced bg-black/20 border border-blue-600/20 rounded-xl p-4 text-left hover:border-blue-400/40 transition-all duration-300 cursor-pointer group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="flex items-center space-x-3 relative z-10">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span className="text-gray-300 text-sm">Get help with problem solving</span>
              </div>
            </div>
            
            <div className="glass-enhanced bg-black/20 border border-pink-600/20 rounded-xl p-4 text-left hover:border-pink-400/40 transition-all duration-300 cursor-pointer group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="flex items-center space-x-3 relative z-10">
                <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center group-hover:bg-pink-500/30 transition-colors duration-300">
                  <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-gray-300 text-sm">Learn something new today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar relative">
      {/* Simple static background - transparent with blur */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-md" />
      
      {/* Enhanced Today indicator */}
      <div className="flex justify-center py-6 relative z-10">
        <div className="px-6 py-2 glass-enhanced border border-purple-400/30 rounded-full shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 animate-pulse rounded-full" />
          <span className="text-sm text-purple-300 font-medium relative z-10">Today</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
        </div>
      </div>

      <div ref={containerRef} className="px-6 pb-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8 relative">
          {messages.map((message, i) => {
            const isUser = message.role === "user"
            const isStreamingMessage = message.id === "streaming"

            return (
              <div key={message.id || i} className={`message-item flex ${isUser ? "justify-end" : "justify-start"} group`}>
                {!isUser && (
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg border border-purple-400/30 group-hover:shadow-purple-500/30 group-hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 animate-pulse rounded-full" />
                      <svg className="w-5 h-5 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="flex flex-col max-w-[85%] w-full">
                  {/* Enhanced User label */}
                  {isUser && (
                    <div className="flex items-center justify-end mb-3">
                      <span className="text-sm text-purple-300 mr-3 font-medium">You</span>
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-lg border border-purple-500/40 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse rounded-full" />
                        <svg className="w-4 h-4 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                  {/* Enhanced AI label */}
                  {!isUser && (
                    <div className="flex items-center mb-3">
                      <span className="text-sm text-purple-300 ml-14 font-medium">Promptly AI</span>
                    </div>
                  )}

                  {/* Enhanced Message content */}
                  <div
                    className={`rounded-2xl px-6 py-4 shadow-lg relative overflow-hidden transition-all duration-300 group-hover:shadow-xl border ${
                      isUser
                        ? "bg-gradient-to-br from-purple-600/90 to-blue-600/90 border-purple-400/40 text-white ml-auto shadow-purple-500/20 group-hover:shadow-purple-500/40"
                        : "glass-enhanced bg-black/40 border-purple-600/30 text-gray-100 shadow-gray-900/20 group-hover:shadow-purple-900/40"
                    }`}
                  >
                    {/* Enhanced glow effect for user messages */}
                    {isUser && (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 -z-10" />
                    )}

                    {/* Enhanced glow effect for assistant messages */}
                    {!isUser && (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10" />
                    )}

                    <div className="whitespace-pre-wrap break-words leading-relaxed relative z-10">
                      {message.content}
                      {isStreamingMessage && <span className="inline-block w-2 h-5 bg-purple-400 ml-1 animate-pulse rounded-sm" />}
                    </div>

                    {/* Message timestamp */}
                    <div className={`flex ${isUser ? 'justify-start' : 'justify-end'} mt-3`}>
                      <span className="text-xs opacity-60">
                        {new Date(message.timestamp || Date.now()).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Action buttons for AI messages */}
                  {!isUser && !isStreamingMessage && (
                    <div className="flex items-center space-x-3 mt-4 ml-14 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <button className="p-2 text-gray-500 hover:text-purple-400 transition-all duration-200 glass-enhanced rounded-lg border border-gray-600/20 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-500/20">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                          />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-500 hover:text-green-400 transition-all duration-200 glass-enhanced rounded-lg border border-gray-600/20 hover:border-green-400/40 hover:shadow-lg hover:shadow-green-500/20">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13l3 3 7-7" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-500 hover:text-blue-400 transition-all duration-200 glass-enhanced rounded-lg border border-gray-600/20 hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-500/20">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-500 hover:text-pink-400 transition-all duration-200 glass-enhanced rounded-lg border border-gray-600/20 hover:border-pink-400/40 hover:shadow-lg hover:shadow-pink-500/20">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </button>

                      {/* Enhanced Model selector */}
                      <div className="ml-auto">
                        <select className="glass-enhanced bg-black/40 border border-purple-600/30 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 hover:border-purple-400/40">
                          <option>PromptlyFlax</option>
                          <option>Promptly 2.0</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Enhanced Streaming indicator */}
          {isStreaming && messages.length > 0 && messages[messages.length - 1].role === "user" && (
            <div className="message-item flex justify-start group">
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg border border-blue-400/30 animate-pulse">
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
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col max-w-[85%]">
                <div className="flex items-center mb-3">
                  <span className="text-sm text-blue-300 ml-14 font-medium">Promptly AI</span>
                </div>
                <div className="glass-enhanced border border-gray-600/30 rounded-2xl px-6 py-4 shadow-lg">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" />
                    <div
                      className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
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
