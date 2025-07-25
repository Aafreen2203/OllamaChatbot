"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"

export interface ChatFolder {
  id: string
  name: string
  color: string
  chatIds: string[]
  createdAt: string
}

interface ChatFoldersProps {
  folders: ChatFolder[]
  onCreateFolder: (name: string, color: string) => void
  onDeleteFolder: (folderId: string) => void
  onRenameFolder: (folderId: string, newName: string) => void
  onAddChatToFolder: (chatId: string, folderId: string) => void
  onRemoveChatFromFolder: (chatId: string, folderId: string) => void
  selectedFolder: string | null
  onSelectFolder: (folderId: string | null) => void
}

const ChatFolders: React.FC<ChatFoldersProps> = ({
  folders,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
  selectedFolder,
  onSelectFolder
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderColor, setNewFolderColor] = useState("#3B82F6")
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const formRef = useRef<HTMLDivElement>(null)

  const colors = [
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#8B5CF6", // Purple
    "#F97316", // Orange
    "#06B6D4", // Cyan
    "#84CC16", // Lime
  ]

  useEffect(() => {
    if (showCreateForm && formRef.current) {
      gsap.fromTo(
        formRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
      )
    }
  }, [showCreateForm])

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return
    onCreateFolder(newFolderName.trim(), newFolderColor)
    setNewFolderName("")
    setNewFolderColor("#3B82F6")
    setShowCreateForm(false)
  }

  const handleStartRename = (folderId: string, currentName: string) => {
    setEditingFolderId(folderId)
    setEditingName(currentName)
  }

  const handleSaveRename = (folderId: string) => {
    if (editingName.trim() && editingName.trim() !== folders.find(f => f.id === folderId)?.name) {
      onRenameFolder(folderId, editingName.trim())
    }
    setEditingFolderId(null)
    setEditingName("")
  }

  const handleKeyPress = (e: React.KeyboardEvent, folderId?: string) => {
    if (e.key === 'Enter') {
      if (folderId) {
        handleSaveRename(folderId)
      } else {
        handleCreateFolder()
      }
    } else if (e.key === 'Escape') {
      setEditingFolderId(null)
      setEditingName("")
      setShowCreateForm(false)
    }
  }

  return (
    <div className="mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Folders</h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-200"
          title="Create folder"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Create Folder Form */}
      {showCreateForm && (
        <div ref={formRef} className="mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e)}
            placeholder="Folder name..."
            className="w-full mb-2 px-2 py-1 text-sm bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none text-gray-900 dark:text-gray-100"
            autoFocus
          />
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewFolderColor(color)}
                  className={`w-4 h-4 rounded-full border-2 ${
                    newFolderColor === color ? 'border-gray-400' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex space-x-1">
              <button
                onClick={handleCreateFolder}
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-2 py-1 text-xs bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Chats */}
      <button
        onClick={() => onSelectFolder(null)}
        className={`w-full text-left p-2 rounded-lg transition-all duration-200 mb-1 ${
          selectedFolder === null
            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.013 8.013 0 01-7-4L5 8" />
          </svg>
          <span className="text-sm">All Chats</span>
        </div>
      </button>

      {/* Folders List */}
      {folders.map((folder) => (
        <div key={folder.id} className="group mb-1">
          <button
            onClick={() => editingFolderId !== folder.id && onSelectFolder(folder.id)}
            className={`w-full text-left p-2 rounded-lg transition-all duration-200 ${
              selectedFolder === folder.id
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: folder.color }}
                />
                {editingFolderId === folder.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, folder.id)}
                    onBlur={() => handleSaveRename(folder.id)}
                    className="bg-transparent border-b border-gray-400 text-sm focus:outline-none flex-1"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="text-sm truncate">{folder.name}</span>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({folder.chatIds.length})
                </span>
              </div>
              
              {editingFolderId !== folder.id && (
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStartRename(folder.id, folder.name)
                    }}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    title="Rename folder"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (window.confirm(`Delete folder "${folder.name}"?`)) {
                        onDeleteFolder(folder.id)
                      }
                    }}
                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    title="Delete folder"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </button>
        </div>
      ))}
    </div>
  )
}

export default ChatFolders
