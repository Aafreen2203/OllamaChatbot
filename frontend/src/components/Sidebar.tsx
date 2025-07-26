"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { useChatContext } from "../utils/useChatContext"
import { useTheme } from "../utils/useTheme"

interface SidebarProps {
  onClose?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { chats, currentChat, createNewChat, selectChat, deleteChat, renameChat } = useChatContext()
  const { theme, toggleTheme } = useTheme()
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")

  const sidebarRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const chatsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Subtle initial sidebar animation
    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current, 
        { x: -20, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
      )
    }

    // Subtle stagger animation for sections
    const timeline = gsap.timeline({ delay: 0.1 })
    timeline
      .fromTo(headerRef.current, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" })
      .fromTo(chatsRef.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, "-=0.2")
  }, [])

  useEffect(() => {
    // Subtle animation for chat items
    if (chatsRef.current) {
      const chatItems = chatsRef.current.querySelectorAll(".chat-item")
      gsap.fromTo(
        chatItems,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.2, stagger: 0.03, ease: "power2.out" },
      )
    }
  }, [chats])

  const handleNewChat = () => {
    createNewChat()
    onClose?.()
  }

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId)
    onClose?.()
  }

  const handleDeleteChat = (chatId: string) => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      deleteChat(chatId)
    }
  }

  const handleStartRename = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId)
    setEditingTitle(currentTitle)
  }

  const handleSaveRename = async (chatId: string) => {
    if (editingTitle.trim() && editingTitle.trim() !== chats.find(c => c.id === chatId)?.title) {
      await renameChat(chatId, editingTitle.trim())
    }
    setEditingChatId(null)
    setEditingTitle("")
  }

  const handleCancelRename = () => {
    setEditingChatId(null)
    setEditingTitle("")
  }

  const handleKeyPress = (e: React.KeyboardEvent, chatId: string) => {
    if (e.key === 'Enter') {
      handleSaveRename(chatId)
    } else if (e.key === 'Escape') {
      handleCancelRename()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    if (messageDate.getTime() === today.getTime()) {
      return "Today"
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div
      ref={sidebarRef}
      className="w-80 md:w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl flex flex-col h-full shadow-xl"
    >
      {/* Header */}
      <div ref={headerRef} className="p-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Chats</h2>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 text-gray-600 dark:text-gray-400 transition-all duration-200 backdrop-blur-sm"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </div>
        <button
          onClick={handleNewChat}
          className="w-full bg-white/90 dark:bg-gray-800/90 hover:bg-gray-50/90 dark:hover:bg-gray-700/90 text-gray-900 dark:text-gray-100 py-2.5 px-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm font-medium backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat History */}
      <div
        ref={chatsRef}
        className="flex-1 overflow-y-auto p-2"
      >
        {chats.map((chat, index) => (
          <div key={chat.id} className="chat-item mb-1" style={{ animationDelay: `${index * 0.1}s` }} data-chat-id={chat.id}>
            <button
              onClick={() => editingChatId !== chat.id && handleSelectChat(chat.id)}
              className={`group w-full text-left p-3 rounded-lg transition-all duration-200 relative backdrop-blur-sm ${
                currentChat?.id === chat.id
                  ? "bg-blue-100/80 dark:bg-blue-900/30 text-gray-900 dark:text-gray-100 shadow-lg border-none"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/50 hover:shadow-md border-none"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  {editingChatId === chat.id ? (
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, chat.id)}
                      onBlur={() => handleSaveRename(chat.id)}
                      className="bg-transparent border-b border-gray-800 dark:border-gray-600 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 w-full mb-1"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div className="font-medium truncate text-sm mb-1">{chat.title}</div>
                  )}
                  <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(chat.createdAt)}</div>
                </div>

                {editingChatId === chat.id ? (
                  <div className="flex items-center justify-center space-x-1 min-w-[60px] flex-shrink-0">
                    <button
                      className="p-1.5 rounded-lg hover:bg-green-100/80 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 transition-all duration-200 backdrop-blur-sm flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSaveRename(chat.id)
                      }}
                      title="Save"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      className="p-1.5 rounded-lg hover:bg-red-100/80 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all duration-200 backdrop-blur-sm flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCancelRename()
                      }}
                      title="Cancel"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                    <button
                      className="p-2 rounded-lg hover:bg-gray-200/80 dark:hover:bg-gray-700/50 text-gray-500 dark:text-gray-400 transition-all duration-200 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStartRename(chat.id, chat.title)
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-red-100/80 dark:hover:bg-red-900/30 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteChat(chat.id)
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      {/* <div ref={footerRef} className="relative p-6 border-t border-gray-700/40">
        <div className="text-center">
          <div className="inline-flex items-center space-x-3 px-5 py-3 glass-enhanced rounded-2xl backdrop-blur-xl border border-gray-600/30 shadow-xl">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            <span className="text-sm text-gray-300 font-semibold">Powered by Ollama + Gemma</span>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default Sidebar
