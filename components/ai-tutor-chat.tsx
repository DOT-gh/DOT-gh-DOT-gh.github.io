"use client"

import type React from "react"

import { Bot, User, Send, Sparkles, Trash2, ChevronRight, MessageSquare, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useAppState } from "@/lib/store"
import { useState, useRef, useEffect } from "react"

// Pre-defined AI responses based on keywords
const aiResponses: Record<string, string[]> = {
  default: [
    "Цікаве питання! Давай розберемося разом. Що конкретно тебе збиває з пантелику?",
    "Спробуй проаналізувати код крок за кроком. Яка частина здається найскладнішою?",
    "Підказка: перечитай умову задачі та порівняй з тим, що робить твій код.",
  ],
  error: [
    "Помилка синтаксису зазвичай означає, що Python не може зрозуміти структуру коду. Перевір чи всі дужки закриті, чи є потрібні двокрапки.",
    "SyntaxError часто виникає через пропущені символи. Уважно перевір рядок, на який вказує помилка.",
  ],
  for: [
    "Цикл for у Python має специфічний синтаксис. Чи пам'ятаєш, як правильно його оголошувати?",
    "Підказка: for variable in sequence: — зверни увагу на останній символ!",
    "Кожен блок коду в Python (цикл, умова, функція) має закінчуватися двокрапкою (:).",
  ],
  while: [
    "Цикл while виконується поки умова істинна. Чи впевнений, що умова колись стане хибною?",
    "Підказка: while condition: — не забудь про двокрапку!",
  ],
  function: [
    "Функції допомагають структурувати код. def назва_функції(параметри): — базовий синтаксис.",
    "Пам'ятай про відступи всередині функції — вони обов'язкові в Python!",
  ],
  list: [
    "Списки — потужний інструмент. Доступ до елементу: список[індекс], де індексація з 0.",
    "Корисні методи: append(), remove(), len(). Який саме тобі потрібен?",
  ],
  print: [
    "print() виводить дані в консоль. Для форматування використовуй f-рядки: f'{змінна}'",
    "Декілька значень можна вивести через кому: print(a, b, c)",
  ],
  help: [
    "Я тут щоб допомогти, але не давати готові відповіді. Опиши проблему детальніше.",
    "Спробуй сформулювати, що саме не працює — це допоможе мені дати точнішу підказку.",
  ],
  hint: [
    "Ось підказка: уважно перечитай повідомлення про помилку. Воно вказує на конкретний рядок!",
    "Підказка: порівняй свій код з прикладами з теорії. Бачиш різницю?",
  ],
}

function getAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  // Check for keywords
  for (const [keyword, responses] of Object.entries(aiResponses)) {
    if (keyword !== "default" && lowerMessage.includes(keyword)) {
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }

  // Default response
  return aiResponses.default[Math.floor(Math.random() * aiResponses.default.length)]
}

export function AiTutorChat() {
  const { messages, addMessage, clearMessages, isOffline } = useAppState()
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    addMessage({ role: "user", content: input.trim() })
    const userInput = input
    setInput("")

    // Simulate AI thinking
    setIsTyping(true)
    addMessage({ role: "system", content: "Аналізую запит..." })

    // Simulate AI response after delay
    setTimeout(() => {
      setIsTyping(false)
      const response = getAIResponse(userInput)
      addMessage({ role: "assistant", content: response })
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Quick actions
  const quickActions = [
    { label: "Де помилка?", query: "Де в моєму коді помилка?" },
    { label: "Підказка", query: "Дай підказку" },
    { label: "Синтаксис", query: "Поясни синтаксис for циклу" },
  ]

  const MobileToggle = () => (
    <Button
      variant="default"
      size="sm"
      className="fixed bottom-4 right-4 z-50 xl:hidden gap-2 shadow-lg"
      onClick={() => setMobileOpen(true)}
    >
      <MessageSquare className="h-4 w-4" />
      <span className="text-xs">ШІ</span>
    </Button>
  )

  const ChatContent = () => (
    <aside
      className={cn(
        "flex flex-col bg-sidebar",
        // Desktop: static sidebar
        "hidden xl:flex xl:w-80",
        // Mobile: overlay when open
        mobileOpen && "fixed inset-0 z-50 flex w-full sm:w-96 xl:relative xl:w-80",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-sidebar-foreground">ШІ-Асистент</h2>
            <p className="text-xs text-muted-foreground">{isOffline ? "Offline Mode" : "Online"}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clearMessages}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 xl:hidden" onClick={() => setMobileOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 hidden xl:flex" onClick={() => setCollapsed(true)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 mb-3">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-foreground font-medium">Привіт! Я твій ШІ-тьютор</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
              Я допоможу розібратися з кодом, але не дам готових відповідей
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}>
              {/* Avatar */}
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                  msg.role === "user" && "bg-accent",
                  msg.role === "assistant" && "bg-primary/20",
                  msg.role === "system" && "bg-secondary",
                )}
              >
                {msg.role === "user" && <User className="h-4 w-4 text-accent-foreground" />}
                {msg.role === "assistant" && <Bot className="h-4 w-4 text-primary" />}
                {msg.role === "system" && <Bot className="h-4 w-4 text-muted-foreground" />}
              </div>

              {/* Message bubble */}
              <div
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                  msg.role === "user" && "bg-accent text-accent-foreground",
                  msg.role === "assistant" && "bg-card text-card-foreground border border-border",
                  msg.role === "system" && "bg-secondary/50 text-muted-foreground font-mono text-xs",
                )}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/20">
              <Bot className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <div className="bg-card border border-border rounded-lg px-3 py-2">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.1s]" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions */}
      <div className="border-t border-sidebar-border px-3 py-2">
        <div className="flex flex-wrap gap-1.5">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                setInput(action.query)
              }}
              className="rounded-full bg-secondary/70 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Запитай підказку..."
            className="flex-1 bg-input text-sm placeholder:text-muted-foreground"
            disabled={isTyping}
          />
          <Button
            size="icon"
            className="shrink-0 bg-primary hover:bg-primary/90"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-center font-mono text-[10px] text-muted-foreground">
          ШІ не дає готових відповідей — лише підказки
        </p>
      </div>
    </aside>
  )

  return (
    <>
      {!mobileOpen && <MobileToggle />}
      <ChatContent />
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/60 xl:hidden" onClick={() => setMobileOpen(false)} />}
    </>
  )
}
