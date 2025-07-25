"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { useChatContext } from "../utils/useChatContext"

const Sidebar: React.FC = () => {
  const { chats, currentChat, createNewChat, selectChat, deleteChat } = useChatContext()

  const sidebarRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const chatsRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Enhanced initial sidebar animation
    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current, 
        { x: -350, opacity: 0, scale: 0.95 }, 
        { x: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
      )
    }

    // Enhanced stagger animation for sections
    const timeline = gsap.timeline({ delay: 0.4 })
    timeline
      .fromTo(headerRef.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
      .fromTo(chatsRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4")
      .fromTo(footerRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.4")
  }, [])

  useEffect(() => {
    // Enhanced animation for chat items
    if (chatsRef.current) {
      const chatItems = chatsRef.current.querySelectorAll(".chat-item")
      gsap.fromTo(
        chatItems,
        { x: -30, opacity: 0, scale: 0.9 },
        { x: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" },
      )
    }
  }, [chats])

  const handleNewChat = () => {
    // Enhanced button animation
    const button = headerRef.current?.querySelector("button")
    if (button) {
      gsap.to(button, {
        scale: 0.92,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      })
    }
    createNewChat()
  }

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId)
  }

  const handleDeleteChat = (chatId: string) => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      deleteChat(chatId)
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
      className="w-64 text-white flex flex-col h-full relative overflow-hidden shadow-2xl border-r border-purple-500/20 bg-black/20 backdrop-blur-xl"
    >
      {/* Remove background elements for glass effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-400" />
      
      
      {/* Header */}
      <div ref={headerRef} className="relative p-4 border-b border-purple-700/40">
        <button
          onClick={handleNewChat}
          className="group w-full glass-enhanced hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-500/20 text-white py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-2xl hover:shadow-[0_20px_40px_rgba(147,51,234,0.2)] transform hover:scale-[1.02] active:scale-[0.98] border border-purple-400/20 card-hover-3d relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
          <div className="relative">
            <div className="absolute inset-0 bg-white/25 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <svg
              className="relative w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="font-semibold text-sm relative z-10">New Chat</span>
        </button>
      </div>

      {/* Chat History */}
      <div
        ref={chatsRef}
        className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar"
      >
        {chats.map((chat, index) => (
          <div key={chat.id} className="chat-item" style={{ animationDelay: `${index * 0.1}s` }}>
            <button
              onClick={() => handleSelectChat(chat.id)}
              className={`group w-full text-left p-3 rounded-xl transition-all duration-300 relative overflow-hidden transform hover:scale-[1.01] border ${
                currentChat?.id === chat.id
                  ? "glass-enhanced bg-gradient-to-r from-purple-600/30 to-blue-500/30 text-white shadow-xl border-purple-400/40"
                  : "glass-enhanced text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-400/10 border-gray-600/20 hover:border-purple-400/30"
              }`}
            >
              {/* Enhanced hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/15 to-blue-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

              <div className="relative flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate text-sm mb-1">{chat.title}</div>
                  <div className="text-xs opacity-70">{formatDate(chat.createdAt)}</div>
                </div>

                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <div
                    className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-200 glass-enhanced border border-gray-600/20"
                    onClick={(e) => {
                      e.stopPropagation()
                      // TODO: Implement edit functionality
                    }}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <div
                    className="p-1.5 rounded-lg hover:bg-red-500/20 cursor-pointer transition-all duration-200 glass-enhanced border border-red-500/20"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteChat(chat.id)
                    }}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </div>
                </div>
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
