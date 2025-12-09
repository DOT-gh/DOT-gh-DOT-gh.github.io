"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Types
export type TaskStatus = "completed" | "in-progress" | "locked"
export type ViewType = "dashboard" | "learning" | "profile" | "settings"

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  code: string
  expectedOutput: string
}

export interface Message {
  id: number
  role: "user" | "assistant" | "system"
  content: string
}

export interface Course {
  id: string
  title: string
  description: string
  progress: number
  totalTasks: number
  completedTasks: number
  icon: string
}

// Initial data
const initialTasks: Task[] = [
  {
    id: 1,
    title: "Вступ до Python",
    description: "Основи синтаксису Python: змінні, типи даних, операції",
    status: "completed",
    code: `# Вітаємо у Python!\nname = "Студент"\nage = 19\nprint(f"Привіт, {name}! Тобі {age} років.")`,
    expectedOutput: "Привіт, Студент! Тобі 19 років.",
  },
  {
    id: 2,
    title: "Умовні оператори",
    description: "if/elif/else конструкції для розгалуження програми",
    status: "completed",
    code: `# Перевірка віку\nage = 18\nif age >= 18:\n    print("Доступ дозволено")\nelse:\n    print("Доступ заборонено")`,
    expectedOutput: "Доступ дозволено",
  },
  {
    id: 3,
    title: "Цикли while/for",
    description: "Ітерація та повторення дій у циклах",
    status: "in-progress",
    code: `# Задача: Знайти суму чисел від 1 до 10\nsum = 0\nfor i in range(1, 11)  # ERROR: Missing colon\n    sum += i\n    print(f"Поточна сума: {sum}")\nprint("Результат:", sum)`,
    expectedOutput: "Результат: 55",
  },
  {
    id: 4,
    title: "Списки та словники",
    description: "Робота з колекціями даних",
    status: "locked",
    code: `# Створення списку\nfruits = ["яблуко", "банан", "апельсин"]\nfor fruit in fruits:\n    print(fruit)`,
    expectedOutput: "яблуко\nбанан\nапельсин",
  },
  {
    id: 5,
    title: "Функції",
    description: "Створення та використання функцій",
    status: "locked",
    code: `# Функція привітання\ndef greet(name):\n    return f"Привіт, {name}!"\n\nprint(greet("Світ"))`,
    expectedOutput: "Привіт, Світ!",
  },
  {
    id: 6,
    title: "Робота з файлами",
    description: "Читання та запис файлів",
    status: "locked",
    code: `# Читання файлу\nwith open("data.txt", "r") as f:\n    content = f.read()\n    print(content)`,
    expectedOutput: "Вміст файлу...",
  },
]

const initialCourses: Course[] = [
  {
    id: "python-basics",
    title: "Python: Основи",
    description: "Базовий курс програмування на Python",
    progress: 33,
    totalTasks: 6,
    completedTasks: 2,
    icon: "python",
  },
  {
    id: "web-html",
    title: "HTML/CSS",
    description: "Веб-розробка для початківців",
    progress: 0,
    totalTasks: 8,
    completedTasks: 0,
    icon: "web",
  },
  {
    id: "algorithms",
    title: "Алгоритми",
    description: "Базові алгоритми та структури даних",
    progress: 0,
    totalTasks: 10,
    completedTasks: 0,
    icon: "algorithm",
  },
]

// Context
interface AppState {
  currentView: ViewType
  setCurrentView: (view: ViewType) => void
  selectedCourse: Course | null
  setSelectedCourse: (course: Course | null) => void
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  currentTask: Task | null
  setCurrentTask: (task: Task | null) => void
  code: string
  setCode: (code: string) => void
  messages: Message[]
  addMessage: (msg: Omit<Message, "id">) => void
  clearMessages: () => void
  courses: Course[]
  isOffline: boolean
  setIsOffline: (offline: boolean) => void
  batteryLevel: number
  setBatteryLevel: (level: number) => void
  consoleOutput: string[]
  setConsoleOutput: (output: string[]) => void
  showSettings: boolean
  setShowSettings: (show: boolean) => void
  showProfile: boolean
  setShowProfile: (show: boolean) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [currentTask, setCurrentTask] = useState<Task | null>(initialTasks[2])
  const [code, setCode] = useState(initialTasks[2].code)
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "user", content: "Чому код не працює? Видає SyntaxError." },
    { id: 2, role: "system", content: "Аналізую локальний кеш..." },
    {
      id: 3,
      role: "assistant",
      content:
        "Дивись, у рядку 3 ти використовуєш цикл for. У Python оголошення циклу обов'язково має закінчуватися двокрапкою (:). Перевір синтаксис.",
    },
    {
      id: 4,
      role: "assistant",
      content: "Підказка: Порівняй свій рядок з правильним синтаксисом: for змінна in послідовність:",
    },
  ])
  const [courses] = useState<Course[]>(initialCourses)
  const [isOffline, setIsOffline] = useState(true)
  const [batteryLevel, setBatteryLevel] = useState(15)
  const [consoleOutput, setConsoleOutput] = useState<string[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const addMessage = (msg: Omit<Message, "id">) => {
    setMessages((prev) => [...prev, { ...msg, id: Date.now() }])
  }

  const clearMessages = () => {
    setMessages([])
  }

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCourse,
        setSelectedCourse,
        tasks,
        setTasks,
        currentTask,
        setCurrentTask,
        code,
        setCode,
        messages,
        addMessage,
        clearMessages,
        courses,
        isOffline,
        setIsOffline,
        batteryLevel,
        setBatteryLevel,
        consoleOutput,
        setConsoleOutput,
        showSettings,
        setShowSettings,
        showProfile,
        setShowProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppContext)
  if (!context) throw new Error("useAppState must be used within AppProvider")
  return context
}
