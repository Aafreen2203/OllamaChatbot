"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"

interface SearchBarProps {
  onSearch: (query: string) => void
  onClose: () => void
  isOpen: boolean
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onClose, isOpen }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && searchRef.current) {
      gsap.fromTo(
        searchRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
      )
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setSearchQuery("")
      onSearch("")
      onClose()
    } else if (e.key === "Enter") {
      e.preventDefault()
      onSearch(searchQuery)
    }
  }

  const handleClose = () => {
    setSearchQuery("")
    onSearch("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div 
      ref={searchRef}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200/50 dark:border-gray-600/50 rounded-2xl p-4 mb-4 shadow-lg"
    >
      <form onSubmit={handleSearch} className="flex items-center space-x-3">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            onSearch(e.target.value) // Real-time search as user types
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search messages..."
          className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleClose}
          className="p-1 rounded-lg hover:bg-gray-200/80 dark:hover:bg-gray-700/50 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </form>
    </div>
  )
}

export default SearchBar
