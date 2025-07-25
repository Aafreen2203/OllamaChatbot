"use client"

import Head from "next/head"
import { type ReactNode } from "react"
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
  return (
    <ThemeProvider>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href={favicon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <MessageListImproved />
          <MessageForm />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default Layout
