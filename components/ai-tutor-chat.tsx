"use client"

import type React from "react"

import { Bot, User, Send, Sparkles, Trash2, ChevronRight, MessageSquare, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useAppState } from "@/lib/store"
import { useState, useRef, useEffect } from "react"

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

function getAIResponse(message: string, previousMessages: any[]): string {
  const lowerMessage = message.toLowerCase()
  const msgHash = hashString(message + previousMessages.length.toString())

  // Помилки та debugging
  if (
    lowerMessage.includes("помилка") ||
    lowerMessage.includes("error") ||
    lowerMessage.includes("не працює") ||
    lowerMessage.includes("не работает")
  ) {
    const responses = [
      "Бачу проблему! Спершу перевір: чи є двокрапка після if/for/while? Чи правильні відступи? Покажи код - допоможу знайти помилку.",
      "Помилка - це підказка від Python! Прочитай останній рядок повідомлення - там написано тип помилки. SyntaxError? NameError? TypeError?",
      "Давай розберемося крок за кроком: 1) Що саме пише в помилці? 2) На якому рядку? 3) Що ти хотів зробити цим кодом?",
      "Типова причина помилок: забута двокрапка, неправильний відступ, або друкарська помилка в назві змінної. Перевір ці три речі!",
      "Спробуй закоментувати частину коду і запустити знову - так знайдеш проблемний рядок. Де саме ламається?",
    ]
    return responses[msgHash % responses.length]
  }

  // Цикли for
  if (lowerMessage.includes("for") || lowerMessage.includes("цикл")) {
    const responses = [
      "Цикл for: `for i in range(5):` - виконає код 5 разів (i буде 0,1,2,3,4). Не забудь двокрапку і відступ!",
      "Підказка для циклів: range(start, stop, step). Наприклад range(0, 10, 2) дасть 0,2,4,6,8. Спробуй!",
      "Всередині циклу обов'язковий відступ (Tab або 4 пробіли). Без відступу Python не зрозуміє що належить до циклу.",
      "Хочеш перебрати список? `for item in my_list:` - і item буде кожним елементом по черзі. Спробуй вивести через print(item).",
      "Цикл застряг? Перевір чи змінюється умова. В range() кінцеве значення НЕ включається: range(5) це 0-4, не 0-5!",
    ]
    return responses[msgHash % responses.length]
  }

  // While цикли
  if (lowerMessage.includes("while")) {
    const responses = [
      "while працює ПОКИ умова True. Важливо: щось всередині циклу має змінити умову, інакше - нескінченний цикл!",
      "Приклад: `count = 0` потім `while count < 5:` і всередині `count += 1`. Без останнього - зависне!",
      "Для виходу з циклу використай `break`. Для пропуску ітерації - `continue`. Корисні інструменти!",
    ]
    return responses[msgHash % responses.length]
  }

  // Функції
  if (lowerMessage.includes("функ") || lowerMessage.includes("def") || lowerMessage.includes("return")) {
    const responses = [
      "Функція: `def назва(параметр):` - двокрапка обов'язкова! Всередині - відступ. Виклик: `назва(значення)`.",
      "return повертає значення з функції. Без return функція поверне None. Приклад: `return результат`",
      "Параметри - це вхідні дані функції. `def greet(name):` - name це параметр, при виклику передаєш реальне ім'я.",
      "Функція спочатку оголошується (def...), а потім викликається. Не можна викликати до оголошення!",
      "Локальні змінні існують тільки всередині функції. Якщо потрібен результат назовні - використай return.",
    ]
    return responses[msgHash % responses.length]
  }

  // Списки
  if (
    lowerMessage.includes("список") ||
    lowerMessage.includes("list") ||
    lowerMessage.includes("масив") ||
    lowerMessage.includes("[")
  ) {
    const responses = [
      "Список: `nums = [1, 2, 3]`. Доступ: `nums[0]` (перший елемент). Індекси з 0!",
      "Додати елемент: `список.append(елемент)`. Видалити: `список.remove(елемент)` або `del список[індекс]`.",
      "Негативні індекси: `список[-1]` - останній елемент, `список[-2]` - передостанній. Зручно!",
      "Зрізи: `список[1:3]` - елементи з індексом 1 і 2. `список[:3]` - перші 3. `список[2:]` - з третього до кінця.",
      "len(список) - довжина. Перебір: `for item in список:` - пройде по кожному елементу.",
    ]
    return responses[msgHash % responses.length]
  }

  // Print та вивід
  if (
    lowerMessage.includes("print") ||
    lowerMessage.includes("вивід") ||
    lowerMessage.includes("вивести") ||
    lowerMessage.includes("виведи")
  ) {
    const responses = [
      "print() виводить в консоль. Текст в лапках: `print('Привіт!')`. Змінну без лапок: `print(x)`.",
      "f-рядки - найзручніший спосіб: `print(f'Ім\\'я: {name}, вік: {age}')` - підставить значення змінних.",
      "Декілька значень: `print('Результат:', x, 'балів')` - пробіли додадуться автоматично.",
      "Щоб вивести без переходу на новий рядок: `print('текст', end='')` - end визначає що буде в кінці.",
    ]
    return responses[msgHash % responses.length]
  }

  // Умови if
  if (
    lowerMessage.includes("if") ||
    lowerMessage.includes("умов") ||
    lowerMessage.includes("else") ||
    lowerMessage.includes("elif")
  ) {
    const responses = [
      "Умова: `if x > 5:` - двокрапка обов'язкова! Код всередині - з відступом.",
      "Повна конструкція: if умова: ... elif інша_умова: ... else: ... Порядок важливий!",
      "Порівняння: == (рівно), != (не рівно), >, <, >=, <=. Подвійне == для порівняння, одинарне = для присвоєння!",
      "Логічні оператори: and (і), or (або), not (не). Приклад: `if x > 0 and x < 10:`",
    ]
    return responses[msgHash % responses.length]
  }

  // Підказки
  if (
    lowerMessage.includes("підказ") ||
    lowerMessage.includes("hint") ||
    lowerMessage.includes("допомож") ||
    lowerMessage.includes("помоги")
  ) {
    const responses = [
      "Порада: спочатку напиши алгоритм словами (псевдокод), потім переводь в Python рядок за рядком.",
      "Розбий задачу на маленькі кроки. Вирішуй кожен окремо, потім збирай разом.",
      "Використовуй print() для дебагу - виводь проміжні значення щоб бачити що відбувається в коді.",
      "Порівняй з прикладами з теорії. Що схоже? Що відрізняється? Часто рішення вже є в матеріалах.",
      "Застряг? Спробуй пояснити задачу вголос - часто рішення приходить коли формулюєш проблему.",
    ]
    return responses[msgHash % responses.length]
  }

  // Змінні
  if (lowerMessage.includes("змінн") || lowerMessage.includes("переменн") || lowerMessage.includes("variable")) {
    const responses = [
      "Змінна створюється присвоєнням: `x = 5`, `name = 'Іван'`. Тип визначається автоматично.",
      "Назви змінних: літери, цифри, підкреслення. Не можна починати з цифри. Приклад: `user_age = 15`",
      "Типи: int (число), float (дробове), str (текст), bool (True/False), list (список).",
      "Перевірити тип: `type(змінна)`. Конвертувати: `int('5')`, `str(123)`, `float('3.14')`.",
    ]
    return responses[msgHash % responses.length]
  }

  // HTML/CSS питання
  if (
    lowerMessage.includes("html") ||
    lowerMessage.includes("css") ||
    lowerMessage.includes("flex") ||
    lowerMessage.includes("тег")
  ) {
    const responses = [
      "HTML структура: теги відкриваються `<tag>` і закриваються `</tag>`. Не забувай закривати!",
      "Flexbox: `display: flex` на контейнері. Далі justify-content (горизонталь) і align-items (вертикаль).",
      "CSS селектори: `.class` для класу, `#id` для id, `tag` для тегу. Специфічність важлива!",
      "Блокові елементи (div, p, h1) займають всю ширину. Інлайнові (span, a) - тільки свій контент.",
    ]
    return responses[msgHash % responses.length]
  }

  // Приклад/покажи
  if (lowerMessage.includes("приклад") || lowerMessage.includes("покаж") || lowerMessage.includes("пример")) {
    const responses = [
      "Ось базовий приклад - спробуй адаптувати під своє завдання. Що саме незрозуміло в синтаксисі?",
      "Приклади є в теоретичному матеріалі зліва. Подивись розділ по цій темі - там покроково пояснено.",
      "Давай я поясню логіку, а ти напишеш код сам - так краще запам'ятається. Що саме потрібно зробити?",
      "Замість готового прикладу, давай розберемо алгоритм: які кроки потрібні для вирішення?",
    ]
    return responses[msgHash % responses.length]
  }

  // Загальні відповіді для невизначених питань
  const generalResponses = [
    "Цікаве питання! Уточни: який код пробував написати і що саме не вийшло?",
    "Давай розберемось! Опиши детальніше задачу - що має робити твій код?",
    "Щоб дати точну підказку, мені потрібно більше контексту. Яке завдання виконуєш?",
    "Розумію, що застряг. Давай по кроках: що вже зробив і де зупинився?",
    "Гарне питання! Скажи, яку конкретну частину завдання намагаєшся вирішити?",
    "Я тут щоб допомогти розібратися. Поділись кодом або опиши що не працює.",
  ]

  return generalResponses[msgHash % generalResponses.length]
}

export function AiTutorChat() {
  const { messages, addMessage, clearMessages, isOffline } = useAppState()
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const safeMessages = messages || []

  const safeAddMessage = addMessage || (() => {})
  const safeClearMessages = clearMessages || (() => {})

  const scrollToBottom = () => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    // Scroll immediately and after a short delay to ensure content is rendered
    scrollToBottom()
    const timer = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timer)
  }, [safeMessages, isTyping])

  const handleSend = () => {
    if (!input.trim() || !addMessage) return

    // Add user message
    safeAddMessage({ role: "user", content: input.trim() })
    const userInput = input
    setInput("")

    // Simulate AI thinking
    setIsTyping(true)

    // Simulate AI response after delay
    setTimeout(() => {
      setIsTyping(false)
      const response = getAIResponse(userInput, safeMessages)
      safeAddMessage({ role: "assistant", content: response })
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
    { label: "HTML/CSS", query: "Що таке Flexbox?" },
    { label: "Змінні", query: "Що таке змінна в Python?" },
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
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={safeClearMessages}>
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
      <div ref={messagesContainerRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {safeMessages.length === 0 ? (
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
          safeMessages.map((msg) => (
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
