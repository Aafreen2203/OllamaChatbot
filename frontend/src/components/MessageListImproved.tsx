"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { useChatContext } from "../utils/useChatContext"

const MessagesList = () => {
  const { messages, isStreaming, currentChat, copyToClipboard, regenerateResponse, sendMessage } = useChatContext()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Animate new messages
    if (containerRef.current) {
      const messageElements = containerRef.current.querySelectorAll(".message-item:last-child")
      messageElements.forEach((element) => {
        gsap.fromTo(element, { y: 20, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" })
      })
    }
  }, [messages])

  const handleCopy = async (content: string) => {
    await copyToClipboard(content)
  }

  const handleRegenerate = async (messageId: string) => {
    await regenerateResponse(messageId)
  }

  const handleRegenerateUserMessage = async (message: any) => {
    if (message.role === "user") {
      // For user messages, resend the message
      await sendMessage(message.content)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting
    let formatted = content
      // Bold text with **text** or *text*
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
      // Code blocks with `code`
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">$1</code>')
      // Line breaks
      .replace(/\n/g, '<br />')

    return formatted
  }

  if (!currentChat) {
    return null // MessageForm will handle the centered state
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl">
      <div ref={containerRef} className="max-w-4xl mx-auto px-4 py-6">
        {messages.map((message) => (
          <div key={message.id} className="message-item mb-6 group">
            <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-3xl ${message.role === "user" ? "ml-12" : "mr-12"}`}>
                {message.role === "assistant" && (
                  <div className="flex items-center mb-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mr-3 shadow-lg">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Assistant</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{formatTimestamp(message.timestamp)}</span>
                  </div>
                )}
                
                <div className={`rounded-2xl px-4 py-3 backdrop-blur-lg shadow-lg border relative group ${
                  message.role === "user" 
                    ? "bg-blue-600/90 text-white border-blue-500/30 shadow-blue-500/20" 
                    : "bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 border-gray-200/50 dark:border-gray-600/50"
                }`}>
                  <div 
                    className="whitespace-pre-wrap text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
                  />
                  {message.role === "user" && (
                    <>
                      <div className="text-xs text-blue-100 mt-2 text-right opacity-80">
                        {formatTimestamp(message.timestamp)}
                      </div>
                      {/* User message action buttons */}
                      <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleCopy(message.content)}
                          className="p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100/90 dark:hover:bg-gray-700/90 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 backdrop-blur-sm shadow-lg border border-gray-200/50 dark:border-gray-600/50"
                          title="Copy prompt"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleRegenerateUserMessage(message)}
                          className="p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100/90 dark:hover:bg-gray-700/90 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 backdrop-blur-sm shadow-lg border border-gray-200/50 dark:border-gray-600/50"
                          title="Resend prompt"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {message.role === "assistant" && (
                  <div className="flex items-center space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleCopy(message.content)}
                      className="p-2 rounded-lg hover:bg-gray-200/80 dark:hover:bg-gray-700/50 text-gray-500 dark:text-gray-400 transition-all duration-200 backdrop-blur-sm"
                      title="Copy message"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleRegenerate(message.id)}
                      className="p-2 rounded-lg hover:bg-gray-200/80 dark:hover:bg-gray-700/50 text-gray-500 dark:text-gray-400 transition-all duration-200 backdrop-blur-sm"
                      title="Regenerate response"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isStreaming && (
          <div className="flex justify-start mb-6">
            <div className="max-w-3xl mr-12">
              <div className="flex items-center mb-2">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mr-3 shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Assistant</span>
              </div>
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200/50 dark:border-gray-600/50 rounded-2xl px-4 py-3 shadow-lg">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default MessagesList
