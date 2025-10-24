'use client'
import { useState } from 'react'

interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  actions?: Array<{ type: string; label: string }>
}

interface ChatWidgetProps {
  context?: any
}

export default function ChatWidget({ context = {} }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! I\'m your TowOps support assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputText, context })
      })

      const data = await response.json()

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date(),
        actions: data.actions || []
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble connecting. Please try again.',
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = async (actionType: string) => {
    const actionMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `Performing ${actionType.replace('_', ' ')}...`,
      isUser: false,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, actionMessage])
    
    // Here you would implement the actual action logic
    setTimeout(() => {
      const resultMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `${actionType.replace('_', ' ')} completed successfully.`,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, resultMessage])
    }, 1000)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg w-80 h-96 flex flex-col">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Support Assistant</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-2 rounded-lg ${
                  message.isUser 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleAction(action.type)}
                          className="block w-full text-left text-xs bg-white text-blue-600 px-2 py-1 rounded hover:bg-blue-50"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="border-t p-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || isLoading}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white rounded-full w-12 h-12 shadow-lg hover:bg-blue-700 flex items-center justify-center"
        >
          💬
        </button>
      )}
    </div>
  )
}
