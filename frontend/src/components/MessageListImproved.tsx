"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { useChatContext } from "../utils/useChatContext"
import SearchBar from "./SearchBar"
import ExportMenu from "./ExportMenu"

const MessageListImproved = () => {
  const { messages, isStreaming, currentChat, copyToClipboard, regenerateResponse, sendMessage } = useChatContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [filteredMessages, setFilteredMessages] = useState(messages)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMessages(messages)
    } else {
      const filtered = messages.filter(message =>
        message.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredMessages(filtered)
    }
  }, [messages, searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  useEffect(() => {
    scrollToBottom()
  }, [filteredMessages])

  useEffect(() => {
    // Animate new messages
    if (containerRef.current) {
      const messageElements = containerRef.current.querySelectorAll(".message-item:last-child")
      messageElements.forEach((element) => {
        gsap.fromTo(element, { y: 20, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" })
      })
    }
  }, [filteredMessages])

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
      {/* Header with search and export */}
      <div className="sticky top-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-600/30 p-4 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {currentChat?.title || "Chat"}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                showSearch
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400'
              }`}
              title="Search messages"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              onClick={() => setShowExport(true)}
              disabled={!currentChat || messages.length === 0}
              className={`p-2 rounded-lg transition-all duration-200 ${
                currentChat && messages.length > 0
                  ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
              }`}
              title={!currentChat || messages.length === 0 ? "No messages to export" : "Export chat"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <SearchBar
          isOpen={showSearch}
          onSearch={handleSearch}
          onClose={() => {
            setShowSearch(false)
            setSearchQuery("")
          }}
        />
      </div>

      <div ref={containerRef} className="max-w-4xl mx-auto px-4 py-6">
        {filteredMessages.map((message) => (
          <div key={message.id} className="message-item mb-6 group">
            <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-3xl ${message.role === "user" ? "ml-4 md:ml-12" : "mr-4 md:mr-12"}`}>
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
                      <div className="md:absolute md:-left-16 md:top-1/2 md:transform md:-translate-y-1/2 md:flex-col md:space-y-1 md:space-x-0 flex flex-row space-x-1 space-y-0 mt-2 md:mt-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleCopy(message.content)}
                          className="p-1.5 md:p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100/90 dark:hover:bg-gray-700/90 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 backdrop-blur-sm shadow-lg border border-gray-200/50 dark:border-gray-600/50"
                          title="Copy prompt"
                        >
                          <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleRegenerateUserMessage(message)}
                          className="p-1.5 md:p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100/90 dark:hover:bg-gray-700/90 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 backdrop-blur-sm shadow-lg border border-gray-200/50 dark:border-gray-600/50"
                          title="Resend prompt"
                        >
                          <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {message.role === "assistant" && (
                  <div className="flex items-center space-x-2 mt-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleCopy(message.content)}
                      className="p-1.5 md:p-2 rounded-lg hover:bg-gray-200/80 dark:hover:bg-gray-700/50 text-gray-500 dark:text-gray-400 transition-all duration-200 backdrop-blur-sm"
                      title="Copy message"
                    >
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleRegenerate(message.id)}
                      className="p-1.5 md:p-2 rounded-lg hover:bg-gray-200/80 dark:hover:bg-gray-700/50 text-gray-500 dark:text-gray-400 transition-all duration-200 backdrop-blur-sm"
                      title="Regenerate response"
                    >
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="max-w-3xl mr-4 md:mr-12">
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
      
      {/* Export Menu */}
      {showExport && currentChat && (
        <ExportMenu
          chat={currentChat}
          messages={messages}
          isOpen={showExport}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  )
}

export default MessageListImproved
