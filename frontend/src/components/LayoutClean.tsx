"use client"

import Head from "next/head"
import { type ReactNode, useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import Sidebar from "./Sidebar"
import MessageListImproved from "./MessageListImproved"
import MessageForm from "./MessageForm"
import { ThemeProvider } from "../utils/useTheme"

type Props = {
  children?: ReactNode
  title?: string
  description?: string
  favicon?: string
}

const Layout = ({
  title = "Chat App - Clean & Simple",
  description = "A clean and minimal chat application",
  favicon = "/img/logo.png",
}: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const layoutRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Handle window resize to close sidebar on mobile
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsSidebarOpen(false) // Keep sidebar state controlled by user on desktop
      } else {
        setIsSidebarOpen(false) // Always close on mobile when resizing
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Initial layout animation
    if (layoutRef.current) {
      gsap.fromTo(layoutRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" })
    }

    if (mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "power3.out" },
      )
    }
  }, [])

  return (
    <ThemeProvider>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href={favicon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div ref={layoutRef} className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden relative">
        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`fixed z-50 md:hidden p-2 rounded-lg backdrop-blur-sm transition-all duration-300 ${
            isSidebarOpen 
              ? 'top-4 right-4 bg-transparent border-0 text-gray-900 dark:text-white hover:bg-white/10' 
              : 'top-4 left-4 bg-white/5 border border-white/10 text-gray-900 dark:text-white hover:bg-white/10'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isSidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Hidden on mobile by default, shown when hamburger is clicked */}
        <div className={`
          fixed md:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}>
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>
        
        <div ref={mainRef} className="flex-1 flex flex-col md:ml-0 pt-16 md:pt-0">
          <MessageListImproved />
          <MessageForm />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default Layout
