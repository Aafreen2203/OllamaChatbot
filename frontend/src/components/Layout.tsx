"use client"

import Head from "next/head"
import { type ReactNode, useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import Sidebar from "./Sidebar"

type Props = {
  children: ReactNode
  title?: string
  description?: string
  favicon?: string
}

const Layout = ({
  children,
  title = "Promptly AI - ChatGPT Clone",
  description = "A ChatGPT-style chat application powered by Ollama and Gemma",
  favicon = "/img/logo.png",
}: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const layoutRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)

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

    // Animate background elements
    if (backgroundRef.current) {
      gsap.fromTo(
        backgroundRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.2, delay: 0.1, ease: "power2.out" }
      )
    }

    // Floating animation for glow orbs
    gsap.to(".floating-orb", {
      y: -20,
      duration: 3,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.5
    })

    gsap.to(".rotating-grid", {
      rotation: 360,
      duration: 100,
      ease: "none",
      repeat: -1
    })
  }, [])

  return (
    <div className="font-sans">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description}></meta>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href={favicon} />
      </Head>

      <div ref={layoutRef} className="h-screen bg-gray-900 flex overflow-hidden relative">
        {/* Fixed positioned blurred gradient circles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Circle 1 - Top left */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-slate-600/30 rounded-full blur-3xl" />
          
          {/* Circle 2 - Bottom right (increased size) */}
          <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] bg-gradient-to-br from-blue-500/25 to-gray-600/25 rounded-full blur-3xl" />
          
          {/* Circle 3 - Center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-slate-500/20 rounded-full blur-3xl" />
          
          {/* Circle 4 - Top right (new) */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br from-slate-600/25 to-blue-500/25 rounded-full blur-3xl" />
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`fixed z-50 md:hidden p-2 transition-all duration-300 ${
            isSidebarOpen 
              ? 'top-4 right-4 bg-transparent border-0 text-white' 
              : 'top-4 left-4 bg-transparent border-0 text-white'
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

        <div ref={mainRef} className="flex-1 flex flex-col relative z-10 md:ml-0 pt-16 md:pt-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/[0.01] to-transparent pointer-events-none" />
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
