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

      <div ref={layoutRef} className="h-screen bg-black flex overflow-hidden relative">
        {/* Enhanced Animated Background */}
        <div ref={backgroundRef} className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Primary gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/15 to-purple-800/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
          
          {/* Animated grid pattern */}
          <div className="rotating-grid absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }} />
          </div>

          {/* Floating glow orbs */}
          <div className="floating-orb absolute top-20 left-1/4 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl" />
          <div className="floating-orb absolute bottom-32 right-1/3 w-96 h-96 bg-blue-500/6 rounded-full blur-3xl" style={{ animationDelay: '1s' }} />
          <div className="floating-orb absolute top-1/2 left-2/3 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl" style={{ animationDelay: '2s' }} />

          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(147,51,234,0.08),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.06),transparent_70%)]" />

          {/* Glass morphism layer */}
          <div className="absolute inset-0 backdrop-blur-[0.5px] bg-gradient-to-br from-white/[0.02] to-transparent" />

          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />

          {/* Enhanced border glow */}
          <div className="absolute inset-0 border border-purple-500/10 shadow-[inset_0_0_50px_rgba(147,51,234,0.03)]" />
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
