"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Bot, User as UserIcon } from "lucide-react"
import { useApp } from "@/lib/store"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function AiTutorChat() {
  const { aiEnabled } = useApp()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Привіт! Я твій AI асистент. Можу допомогти з поясненням коду, підказати рішення або відповісти на питання. Що тебе цікавить?'
    }
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    }

    setMessages([...messages, userMessage])
    setInput('')

    // Симуляція відповіді AI (локальна, без API)
    setTimeout(() => {
      const responses = [
        'Це чудове питання! Давай розберемо це крок за кроком...',
        'Гарне спостереження! Ось що я можу порадити...',
        'Розумію твоє питання. Спробуй подумати в такому напрямку...',
        'Чудова ідея! Ось як можна це реалізувати...',
        'Давай розглянемо приклад, щоб краще зрозуміти...'
      ]
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)]
      }
      
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  if (!aiEnabled) {
    return (
      <div className="w-96 border-l bg-card flex items-center justify-center p-4 hidden xl:flex">
        <div className="text-center text-muted-foreground">
          <Bot className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>AI асистент вимкнено</p>
          <p className="text-xs mt-2">Увімкніть в налаштуваннях</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-96 border-l bg-card flex flex-col hidden xl:flex">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <h3 className="font-semibold">AI Тьютор</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Локальний асистент
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              
              <div
                className={`rounded-lg p-3 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <UserIcon className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Поставте питання..."
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
