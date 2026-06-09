"use client"

import { useEffect } from "react"
import { useRef } from "react"
import { useState } from "react"
import type React from "react"
import ReactMarkdown from "react-markdown"

import { Bot, User, Send, Sparkles, Trash2, MessageSquare, X, Lightbulb, Brain, Zap, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

type HintLevel = 1 | 2 | 3
type PersonalityType = "friendly" | "strict" | "humorous" | "professional"

interface AISettings {
  personality: PersonalityType
  hintLevel: HintLevel
  autoHints: boolean
  contextAware: boolean
  progressiveHints: boolean
}

interface AITutorEnhancedProps {
  currentExercise: any
  code: string
  messages: any[]
  addMessage: (msg: any) => void
  clearMessages: () => void
}

const personalityResponses: Record<PersonalityType, Record<string, string[]>> = {
  friendly: {
    greeting: ["Привіт! Я твій дружній помічник. Разом ми це розберемо!", "Вітаю! Готовий допомогти тобі навчатися."],
    encouragement: ["Чудово! Ти на правильному шляху!", "Молодець, продовжуй в тому ж дусі!"],
    error: [
      "Не хвилюйся, помилки - це частина навчання. Давай разом знайдемо рішення.",
      "Майже правильно! Спробуємо підійти з іншого боку.",
    ],
  },
  strict: {
    greeting: ["Розпочнімо. Концентруйся на завданні.", "Готовий працювати? Тоді почнімо."],
    encouragement: ["Прийнятно. Продовжуй.", "Правильний напрямок. Далі."],
    error: ["Уважність! Перевір синтаксис.", "Помилка. Повернись до теорії і спробуй ще раз."],
  },
  humorous: {
    greeting: ["Йо-хо-хо! Готовий до пригод у світі коду?", "Привіт, майбутній геній програмування!"],
    encouragement: ["Boom! Це було круто! 💥", "Ого, ти справжній код-ніндзя!"],
    error: [
      "Упс! Код трохи забунтував. Приборкаємо його?",
      "Хм, Python не розуміє твоєї мови. Спробуй його діалект 😄",
    ],
  },
  professional: {
    greeting: ["Доброго дня. Приступімо до роботи над завданням.", "Вітаю. Готовий надати технічну підтримку."],
    encouragement: ["Ефективне рішення. Продовжуйте в цьому напрямку.", "Коректна реалізація. Рухаємося далі."],
    error: [
      "Виявлено синтаксичну помилку. Рекомендую перевірити відповідність специфікації Python.",
      "Код не відповідає очікуваній структурі. Проаналізуйте патерн.",
    ],
  },
}

const hintLevelResponses: Record<HintLevel, Record<string, string[]>> = {
  1: {
    // Легка підказка - вказує напрямок
    for: [
      "Подумай про структуру циклу for. Чого не вистачає в кінці?",
      "Кожен блок коду в Python потребує спеціального символу наприкінці...",
    ],
    syntax: [
      "Перевір синтаксис. Можливо, щось пропущено?",
      "Python дуже чутливий до структури. Уважно перечитай цей рядок.",
    ],
  },
  2: {
    // Середня підказка - показує приклад
    for: [
      "Приклад правильного циклу: for i in range(10):\n    print(i)",
      "Цикл for має такий синтаксис: for змінна in послідовність:\n    # код",
    ],
    syntax: [
      "Зверни увагу на двокрапку ':' наприкінці рядка з циклом або умовою.",
      "Правильна структура: if умова:\n    код",
    ],
  },
  3: {
    // Сильна підказка - майже готовий код
    for: [
      "Майже правильно! Додай двокрапку в кінці: for i in range(10):",
      "Твій код має виглядати так:\nfor i in range(1, 11):\n    print(i)",
    ],
    syntax: [
      "Виправлена версія:\nfor i in range(10):\n    print(i)",
      "Ось що потрібно змінити: додай ':' після range(10)",
    ],
  },
}

export default function AITutorEnhanced({
  currentExercise,
  code,
  messages,
  addMessage,
  clearMessages,
}: AITutorEnhancedProps) {
  const { toast } = useToast()
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [aiSettings, setAISettings] = useState<AISettings>({
    personality: "friendly",
    hintLevel: 1,
    autoHints: true,
    contextAware: true,
    progressiveHints: true,
  })
  const [currentHintLevel, setCurrentHintLevel] = useState<HintLevel>(1)
  const [questionCount, setQuestionCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [copiedBlocks, setCopiedBlocks] = useState<Set<string>>(new Set())

  const safeMessages = messages || []
  const safeAddMessage = addMessage || (() => {})
  const safeClearMessages = clearMessages || (() => {})

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [safeMessages])

  // Автоматичні підказки при помилках
  useEffect(() => {
    if (aiSettings.autoHints && aiSettings.contextAware && code) {
      // Перевірка типових помилок
      const hasForLoopError = /for .+ in .+[^:]\s*$/m.test(code)
      const hasIfError = /if .+[^:]\s*$/m.test(code)

      if (hasForLoopError || hasIfError) {
        const lastMessage = safeMessages[safeMessages.length - 1]
        const timeSinceLastMessage = lastMessage ? Date.now() - Number.parseInt(lastMessage.id) : 999999

        // Показати автопідказку якщо минуло 30 секунд
        if (timeSinceLastMessage > 30000) {
          setTimeout(() => {
            safeAddMessage({
              role: "system",
              content: "💡 Здається, у тебе проблема з синтаксисом. Хочеш підказку?",
            })
          }, 5000)
        }
      }
    }
  }, [code, aiSettings, safeMessages, safeAddMessage])

  const getPersonalityResponse = (type: string): string => {
    const responses = personalityResponses[aiSettings.personality][type] || personalityResponses.friendly[type]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const getHintLevelResponse = (keyword: string): string => {
    const level = aiSettings.progressiveHints ? currentHintLevel : aiSettings.hintLevel
    const responses = hintLevelResponses[level][keyword] || hintLevelResponses[1].syntax
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const analyzeCode = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Контекстний аналіз коду
    if (aiSettings.contextAware && code) {
      if (lowerMessage.includes("помилка") || lowerMessage.includes("не працює")) {
        if (/for .+ in .+[^:]\s*$/m.test(code)) {
          return getHintLevelResponse("for")
        }
        if (/if .+[^:]\s*$/m.test(code)) {
          return getHintLevelResponse("syntax")
        }
      }
    }

    // Загальні відповіді
    if (lowerMessage.includes("підказка") || lowerMessage.includes("hint")) {
      if (aiSettings.progressiveHints) {
        setCurrentHintLevel((prev) => Math.min(3, prev + 1) as HintLevel)
      }
      return getHintLevelResponse("syntax")
    }

    if (lowerMessage.includes("for") || lowerMessage.includes("цикл")) {
      return getHintLevelResponse("for")
    }

    // Заохочення
    if (lowerMessage.includes("працює") || lowerMessage.includes("вийшло")) {
      return getPersonalityResponse("encouragement")
    }

    // Помилка
    if (lowerMessage.includes("error") || lowerMessage.includes("помилка")) {
      return getPersonalityResponse("error")
    }

    // Привітання
    if (lowerMessage.includes("привіт") || lowerMessage.includes("hello")) {
      return getPersonalityResponse("greeting")
    }

    // Default
    return "Цікаве питання! Спробуй сформулювати його більш конкретно, щоб я міг допомогти краще."
  }

  const handleSend = () => {
    if (!input.trim() || !addMessage) return

    safeAddMessage({ role: "user", content: input.trim() })
    const userInput = input
    setInput("")
    setQuestionCount((prev) => prev + 1)

    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const response = analyzeCode(userInput)
      safeAddMessage({ role: "assistant", content: response })
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCopyCode = (code: string, blockId: string) => {
    navigator.clipboard.writeText(code)
    setCopiedBlocks((prev) => new Set(prev).add(blockId))
    toast({
      variant: "success",
      title: "Код скопійовано",
    })

    setTimeout(() => {
      setCopiedBlocks((prev) => {
        const next = new Set(prev)
        next.delete(blockId)
        return next
      })
    }, 2000)
  }

  const quickActions = [
    { label: "Підказка рівень 1", icon: Lightbulb, action: () => setInput("Дай легку підказку") },
    { label: "Підказка рівень 2", icon: Brain, action: () => setInput("Покажи приклад схожої задачі") },
    { label: "Підказка рівень 3", icon: Zap, action: () => setInput("Дай сильну підказку з кодом") },
  ]

  const MobileToggle = () => (
    <Button
      variant="default"
      size="sm"
      className="fixed bottom-20 right-4 z-50 xl:hidden gap-2 shadow-lg rounded-full h-12 w-12 p-0"
      onClick={() => setMobileOpen(true)}
    >
      <MessageSquare className="h-5 w-5" />
    </Button>
  )

  const ChatContent = () => (
    <aside
      className={cn(
        "flex flex-col bg-sidebar",
        "hidden xl:flex xl:w-80",
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
            <p className="text-xs text-muted-foreground">
              {aiSettings.personality === "friendly" && "Дружній"}
              {aiSettings.personality === "strict" && "Строгий"}
              {aiSettings.personality === "humorous" && "Жартівливий"}
              {aiSettings.personality === "professional" && "Професійний"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={safeClearMessages}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 xl:hidden" onClick={() => setMobileOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-sidebar-border px-4 py-2 flex gap-2">
        <Badge variant="secondary" className="text-xs">
          Питань: {questionCount}
        </Badge>
        {aiSettings.progressiveHints && (
          <Badge variant="secondary" className="text-xs">
            Рівень: {currentHintLevel}
          </Badge>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {safeMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 mb-3">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-foreground font-medium">{getPersonalityResponse("greeting")}</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
              Я допоможу розібратися з кодом, але не дам готових відповідей
            </p>
          </div>
        ) : (
          safeMessages.map((msg, idx) => (
            <div key={msg.id} className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}>
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                  msg.role === "user" && "bg-accent",
                  msg.role === "assistant" && "bg-primary/20",
                  msg.role === "system" && "bg-amber-500/20",
                )}
              >
                {msg.role === "user" && <User className="h-4 w-4 text-accent-foreground" />}
                {msg.role === "assistant" && <Bot className="h-4 w-4 text-primary" />}
                {msg.role === "system" && <Sparkles className="h-4 w-4 text-amber-500" />}
              </div>

              <div
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                  msg.role === "user" && "bg-accent text-accent-foreground",
                  msg.role === "assistant" &&
                    "bg-card text-card-foreground border border-border prose prose-sm dark:prose-invert max-w-none",
                  msg.role === "system" && "bg-amber-500/10 text-amber-300 border border-amber-500/30",
                )}
              >
                {msg.role === "assistant" ? (
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || "")
                        const codeString = String(children).replace(/\n$/, "")
                        const blockId = `${idx}-${codeString.slice(0, 20)}`

                        return !inline && match ? (
                          <div className="relative group my-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              onClick={() => handleCopyCode(codeString, blockId)}
                            >
                              {copiedBlocks.has(blockId) ? (
                                <Check className="h-3 w-3 text-emerald-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                            <pre className="bg-zinc-950 rounded-lg p-4 overflow-x-auto border border-zinc-800">
                              <code className="text-sm text-zinc-100 font-mono">{codeString}</code>
                            </pre>
                          </div>
                        ) : (
                          <code
                            className={cn(
                              "bg-zinc-800/50 text-zinc-100 px-1.5 py-0.5 rounded text-xs font-mono",
                              className,
                            )}
                            {...props}
                          >
                            {children}
                          </code>
                        )
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
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
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.1s]" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                </div>
                <span className="text-xs text-muted-foreground">ШІ аналізує...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions */}
      <div className="border-t border-sidebar-border px-3 py-2">
        <div className="space-y-1.5">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.action}
              className="w-full flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {(action.icon.className = "h-3.5 w-3.5")}
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
