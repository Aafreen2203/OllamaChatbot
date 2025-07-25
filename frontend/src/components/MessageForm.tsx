import React, { useState, useRef } from 'react';
import { useChatContext } from '../utils/useChatContext';

const MessageForm = () => {
  const [content, setContent] = useState('');
  const { sendMessage, stopStreaming, isStreaming, currentChat } = useChatContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim() || !currentChat) return;

    await sendMessage(content.trim());
    setContent('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  };

  const handleStop = () => {
    stopStreaming();
  };

  return (
    <div className="border-t bg-white px-4 py-4">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder={currentChat ? "Type your message..." : "Create or select a chat to start messaging"}
                disabled={!currentChat}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '200px' }}
              />
              
              {/* Send button */}
              <div className="absolute right-2 bottom-2">
                {isStreaming ? (
                  <button
                    type="button"
                    onClick={handleStop}
                    className="p-2 text-gray-500 hover:text-red-600 focus:outline-none"
                    title="Stop generation"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 10h6v4H9z"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!content.trim() || !currentChat}
                    className="p-2 text-gray-500 hover:text-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Send message (Enter)"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Status indicator */}
          {isStreaming && (
            <div className="mt-2 text-sm text-gray-500 flex items-center">
              <div className="flex space-x-1 mr-2">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              AI is thinking... Press Stop to interrupt
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default MessageForm;
