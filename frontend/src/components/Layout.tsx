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
  title = "Nokat AI - ChatGPT Clone",
  description = "A ChatGPT-style chat application powered by Ollama and Gemma",
  favicon = "/img/logo.png",
}: Props) => {
  const layoutRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initial layout animation
    if (layoutRef.current) {
      gsap.fromTo(layoutRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" })
    }

    if (mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: "power2.out" },
      )
    }
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

      <div ref={layoutRef} className="h-screen bg-[#1a1d29] flex overflow-hidden">
        <Sidebar />

        <div ref={mainRef} className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
