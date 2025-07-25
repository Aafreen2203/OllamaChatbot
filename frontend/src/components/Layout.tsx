"use client"

import Head from "next/head"
import { type ReactNode, useEffect, useRef } from "react"
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
  const layoutRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)

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
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-3xl" />
          
          {/* Circle 2 - Bottom right */}
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-br from-blue-500/25 to-purple-500/25 rounded-full blur-3xl" />
          
          {/* Circle 3 - Center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl" />
        </div>

        <Sidebar />

        <div ref={mainRef} className="flex-1 flex flex-col relative z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/[0.01] to-transparent pointer-events-none" />
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
