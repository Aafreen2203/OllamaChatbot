"use client"

import type React from "react"
import { useState } from "react"
import { Chat, Message } from "../utils/chatApi"

interface ExportMenuProps {
  chat: Chat
  messages: Message[]
  isOpen: boolean
  onClose: () => void
}

const ExportMenu: React.FC<ExportMenuProps> = ({ chat, messages, isOpen, onClose }) => {
  const [exporting, setExporting] = useState(false)

  const exportAsText = () => {
    const content = [
      `Chat Export: ${chat.title}`,
      `Date: ${new Date(chat.createdAt).toLocaleString()}`,
      `Messages: ${messages.length}`,
      '='.repeat(50),
      '',
      ...messages.map(msg => [
        `[${msg.role.toUpperCase()}] ${new Date(msg.timestamp).toLocaleString()}`,
        msg.content,
        ''
      ]).flat()
    ].join('\n')

    downloadFile(content, `${chat.title.replace(/[^a-z0-9]/gi, '_')}.txt`, 'text/plain')
  }

  const exportAsJSON = () => {
    const data = {
      chat,
      messages,
      exportedAt: new Date().toISOString(),
      totalMessages: messages.length
    }

    downloadFile(
      JSON.stringify(data, null, 2), 
      `${chat.title.replace(/[^a-z0-9]/gi, '_')}.json`, 
      'application/json'
    )
  }

  const exportAsMarkdown = () => {
    const content = [
      `# ${chat.title}`,
      '',
      `**Exported:** ${new Date().toLocaleString()}  `,
      `**Total Messages:** ${messages.length}  `,
      `**Created:** ${new Date(chat.createdAt).toLocaleString()}`,
      '',
      '---',
      '',
      ...messages.map(msg => [
        `## ${msg.role === 'user' ? '👤 User' : '🤖 Assistant'}`,
        `*${new Date(msg.timestamp).toLocaleString()}*`,
        '',
        msg.content,
        ''
      ]).flat()
    ].join('\n')

    downloadFile(content, `${chat.title.replace(/[^a-z0-9]/gi, '_')}.md`, 'text/markdown')
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    setExporting(true)
    
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    setTimeout(() => {
      setExporting(false)
      onClose()
    }, 500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-600/50 min-w-96">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Export Chat</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200/80 dark:hover:bg-gray-700/50 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Export "{chat.title}" ({messages.length} messages)
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={exportAsText}
            disabled={exporting}
            className="w-full flex items-center space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 transition-all duration-200 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Plain Text (.txt)</span>
          </button>

          <button
            onClick={exportAsMarkdown}
            disabled={exporting}
            className="w-full flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300 transition-all duration-200 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>Markdown (.md)</span>
          </button>

          <button
            onClick={exportAsJSON}
            disabled={exporting}
            className="w-full flex items-center space-x-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300 transition-all duration-200 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>JSON Data (.json)</span>
          </button>
        </div>

        {exporting && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Exporting...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExportMenu
