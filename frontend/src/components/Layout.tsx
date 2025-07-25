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
  title = "ChatGPT Clone - Ollama + Gemma",
  description = "A ChatGPT-style chat application powered by Ollama and Gemma",
  favicon = "/img/logo.png",
}: Props) => {
  const layoutRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initial layout animation
    if (layoutRef.current) {
      gsap.fromTo(layoutRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" })
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
    <div className="font-basier-circle">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description}></meta>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href={favicon} />
      </Head>

      <div
        ref={layoutRef}
        className="h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(236,72,153,0.05),transparent_50%)]" />

        <Sidebar />

        <div ref={mainRef} className="flex-1 flex flex-col relative">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
