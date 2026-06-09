"use client"

import type React from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { OfflineProvider } from "@/components/offline-provider"

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  content: string
  hint?: string
  solution?: string
}

export interface Course {
  id: string
  title: string
  description: string
  icon: string
  progress: number
  completedTasks: number
  totalTasks: number
  tasks: Task[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
  rarity: "common" | "rare" | "epic" | "legendary"
}

export interface DailyChallenge {
  id: string
  title: string
  description: string
  progress: number
  target: number
  reward: number
  completed: boolean
}

export interface StudentActivity {
  id: string
  studentName: string
  action: string
  timestamp: Date
  details: string
}

interface AppState {
  // UI State
  currentView: "dashboard" | "learning"
  selectedCourse: Course | null
  selectedTask: Task | null
  showSettings: boolean
  showProfile: boolean

  currentTask: { id: number; title: string; code: string; expectedOutput?: string } | null
  code: string
  consoleOutput: string[]

  // AI Chat State
  messages: Message[]

  // App Data
  courses: Course[]
  isOffline: boolean
  isNetworkOnline: boolean
  forceOffline: boolean
  pendingSyncCount: number
  isSyncing: boolean
  connectionStatus: string
  batteryLevel: number
  fontSize: number
  storageUsed: number
  snowAmount: number

  // User Role
  userRole: "student" | "teacher"
  setUserRole: (role: "student" | "teacher") => void

  xp: number
  level: number
  streak: number
  lastActivityDate: Date | null
  totalStudyTime: number
  achievements: Achievement[]
  dailyChallenges: DailyChallenge[]

  completedTour: boolean
  unlockedThemes: string[]
  currentTheme: string

  studentActivities: StudentActivity[]
  screenMode: boolean

  // Actions
  setCurrentView: (view: "dashboard" | "learning") => void
  setSelectedCourse: (course: Course | null) => void
  setSelectedTask: (task: Task | null) => void
  setShowSettings: (show: boolean) => void
  setShowProfile: (show: boolean) => void
  setIsOffline: (offline: boolean) => void
  setForceOffline: (offline: boolean) => void
  setNetworkStatus: (status: {
    isNetworkOnline?: boolean
    isOffline?: boolean
    pendingSyncCount?: number
    isSyncing?: boolean
    connectionStatus?: string
  }) => void
  setConnectionStatus: (status: string) => void
  setBatteryLevel: (level: number) => void
  setFontSize: (size: number) => void
  setStorageUsed: (used: number) => void
  setSnowAmount: (amount: number) => void
  setCode: (code: string) => void
  setConsoleOutput: (output: string[] | ((prev: string[]) => string[])) => void
  setCurrentTask: (task: { id: number; title: string; code: string; expectedOutput?: string } | null) => void
  addMessage: (message: Omit<Message, "id">) => void
  clearMessages: () => void
  completeTask: (courseId: string, taskId: string) => void
  addXP: (amount: number) => void
  checkAndUpdateStreak: () => void
  unlockAchievement: (id: string) => void
  updateDailyChallenge: (id: string, progress: number) => void
  addStudentActivity: (activity: Omit<StudentActivity, "id" | "timestamp">) => void
  setScreenMode: (mode: boolean) => void

  markTourComplete: () => void
  unlockTheme: (themeId: string) => void
  setCurrentTheme: (themeId: string) => void
}

const initialCourses: Course[] = [
  {
    id: "python",
    title: "Python: Основи",
    description: "Базовий курс програмування на Python",
    icon: "python",
    progress: 0,
    completedTasks: 0,
    totalTasks: 6,
    tasks: [
      {
        id: "py-1",
        title: "Привіт, Python!",
        description: "Напишіть першу програму",
        completed: false,
        content: `# Ваше перше завдання
# Напишіть програму, яка виводить "Привіт, світ!"

# Підказка: використовуйте функцію print()

`,
        hint: 'Використайте print("Привіт, світ!")',
        solution: 'print("Привіт, світ!")',
      },
      {
        id: "py-2",
        title: "Змінні та типи даних",
        description: "Вивчіть базові типи даних",
        completed: false,
        content: `# Змінні в Python
# Створіть змінні різних типів

# Створіть змінну name з вашим ім'ям
# Створіть змінну age з вашим віком
# Створіть змінну is_student зі значенням True

`,
        hint: "name = 'Ваше ім'я', age = 20, is_student = True",
      },
      {
        id: "py-3",
        title: "Умовні оператори",
        description: "Навчіться використовувати if/else",
        completed: false,
        content: `# Умовні оператори
# Напишіть програму, яка перевіряє чи число додатне

number = 5

# Якщо number > 0, виведіть "Додатне"
# Інакше виведіть "Від'ємне або нуль"

`,
      },
      {
        id: "py-4",
        title: "Цикли",
        description: "Цикли for та while",
        completed: false,
        content: `# Цикли в Python
# Виведіть числа від 1 до 5 використовуючи цикл for

# Підказка: for i in range(1, 6):

`,
      },
      {
        id: "py-5",
        title: "Функції",
        description: "Створення власних функцій",
        completed: false,
        content: `# Функції в Python
# Створіть функцію greet(name), яка повертає привітання

# Приклад: greet("Олег") має повернути "Привіт, Олег!"

`,
      },
      {
        id: "py-6",
        title: "Списки",
        description: "Робота зі списками",
        completed: false,
        content: `# Списки в Python
# Створіть список fruits з трьома фруктами
# Додайте ще один фрукт
# Виведіть довжину списку

`,
      },
    ],
  },
  {
    id: "web",
    title: "HTML/CSS",
    description: "Веб-розробка для початківців",
    icon: "web",
    progress: 0,
    completedTasks: 0,
    totalTasks: 8,
    tasks: [
      {
        id: "web-1",
        title: "Структура HTML",
        description: "Базова структура веб-сторінки",
        completed: false,
        content: `<!-- Базова структура HTML -->
<!-- Створіть просту HTML сторінку з заголовком та параграфом -->

<!DOCTYPE html>
<html>
<head>
  <title>Моя сторінка</title>
</head>
<body>
  <!-- Додайте заголовок h1 та параграф p -->
  
</body>
</html>`,
      },
      {
        id: "web-2",
        title: "CSS селектори",
        description: "Стилізація елементів",
        completed: false,
        content: `/* CSS селектори */
/* Задайте стилі для заголовка та параграфа */

h1 {
  /* Додайте колір та розмір шрифту */
}

p {
  /* Додайте відступи та колір тексту */
}`,
      },
      {
        id: "web-3",
        title: "Flexbox",
        description: "Гнучка розмітка",
        completed: false,
        content: `/* Flexbox */
/* Створіть контейнер з трьома елементами в ряд */

.container {
  /* Додайте display: flex та інші властивості */
}`,
      },
      {
        id: "web-4",
        title: "Форми",
        description: "HTML форми та елементи введення",
        completed: false,
        content: `<!-- HTML Форми -->
<!-- Створіть форму з полями для імені та email -->

<form>
  <!-- Додайте label та input для name -->
  <!-- Додайте label та input для email -->
  <!-- Додайте кнопку submit -->
</form>`,
      },
      {
        id: "web-5",
        title: "Адаптивний дизайн",
        description: "Media queries",
        completed: false,
        content: `/* Media Queries */
/* Зробіть адаптивний дизайн для мобільних */

.container {
  width: 1200px;
}

@media (max-width: 768px) {
  /* Змініть ширину для мобільних */
}`,
      },
      {
        id: "web-6",
        title: "CSS Grid",
        description: "Сіткова розмітка",
        completed: false,
        content: `/* CSS Grid */
/* Створіть сітку 3x3 */

.grid {
  /* Додайте display: grid */
  /* Використайте grid-template-columns */
}`,
      },
      {
        id: "web-7",
        title: "Анімації",
        description: "CSS переходи та анімації",
        completed: false,
        content: `/* CSS Анімації */
/* Створіть плавний перехід для кнопки */

.button {
  background: blue;
  /* Додайте transition */
}

.button:hover {
  /* Змініть колір при наведенні */
}`,
      },
      {
        id: "web-8",
        title: "Семантичний HTML",
        description: "Правильна структура документа",
        completed: false,
        content: `<!-- Семантичний HTML -->
<!-- Використайте семантичні теги -->

<!-- Замість div використайте header, nav, main, section, article, footer -->

<div class="header">Шапка</div>
<div class="content">Контент</div>
<div class="footer">Підвал</div>`,
      },
    ],
  },
  {
    id: "algorithm",
    title: "Алгоритми",
    description: "Базові алгоритми та структури даних",
    icon: "algorithm",
    progress: 0,
    completedTasks: 0,
    totalTasks: 10,
    tasks: [
      {
        id: "alg-1",
        title: "Що таке алгоритм?",
        description: "Вступ до алгоритмів",
        completed: false,
        content: `# Алгоритми
# Алгоритм - це послідовність кроків для вирішення задачі

# Напишіть алгоритм (коментарями) для:
# Приготування чаю

# Крок 1: ...
# Крок 2: ...
`,
      },
      {
        id: "alg-2",
        title: "Лінійний пошук",
        description: "Пошук елемента в масиві",
        completed: false,
        content: `# Лінійний пошук
# Знайдіть індекс елемента в списку

def linear_search(arr, target):
    # Пройдіться по кожному елементу
    # Якщо знайшли - поверніть індекс
    # Якщо не знайшли - поверніть -1
    pass

# Тест
numbers = [4, 2, 7, 1, 9, 3]
print(linear_search(numbers, 7))  # Має вивести 2
`,
      },
      {
        id: "alg-3",
        title: "Бінарний пошук",
        description: "Ефективний пошук у відсортованому масиві",
        completed: false,
        content: `# Бінарний пошук
# Працює тільки з відсортованими масивами

def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    # Реалізуйте бінарний пошук
    pass

# Тест
sorted_numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
print(binary_search(sorted_numbers, 5))  # Має вивести 4
`,
      },
      {
        id: "alg-4",
        title: "Сортування бульбашкою",
        description: "Простий алгоритм сортування",
        completed: false,
        content: `# Сортування бульбашкою
# Порівнюємо сусідні елементи та міняємо місцями

def bubble_sort(arr):
    # Реалізуйте сортування
    pass

# Тест
numbers = [64, 34, 25, 12, 22, 11, 90]
bubble_sort(numbers)
print(numbers)  # [11, 12, 22, 25, 34, 64, 90]
`,
      },
      {
        id: "alg-5",
        title: "Рекурсія",
        description: "Функції, що викликають самі себе",
        completed: false,
        content: `# Рекурсія
# Обчисліть факторіал числа рекурсивно

def factorial(n):
    # Базовий випадок: factorial(0) = 1
    # Рекурсивний випадок: n * factorial(n-1)
    pass

print(factorial(5))  # 120
`,
      },
      {
        id: "alg-6",
        title: "Стек",
        description: "Структура даних LIFO",
        completed: false,
        content: `# Стек (Stack)
# Last In, First Out

class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        # Додати елемент
        pass
    
    def pop(self):
        # Видалити та повернути верхній елемент
        pass
    
    def is_empty(self):
        # Перевірити чи стек порожній
        pass
`,
      },
      {
        id: "alg-7",
        title: "Черга",
        description: "Структура даних FIFO",
        completed: false,
        content: `# Черга (Queue)
# First In, First Out

class Queue:
    def __init__(self):
        self.items = []
    
    def enqueue(self, item):
        # Додати елемент в кінець
        pass
    
    def dequeue(self):
        # Видалити та повернути перший елемент
        pass
`,
      },
      {
        id: "alg-8",
        title: "Зв'язаний список",
        description: "Динамічна структура даних",
        completed: false,
        content: `# Зв'язаний список

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def append(self, data):
        # Додати елемент в кінець
        pass
    
    def display(self):
        # Вивести всі елементи
        pass
`,
      },
      {
        id: "alg-9",
        title: "Хеш-таблиця",
        description: "Швидкий пошук за ключем",
        completed: false,
        content: `# Хеш-таблиця
# Використовуємо словник Python як приклад

# Створіть словник студентів
# Ключ: ім'я, Значення: оцінка

students = {}

# Додайте 3 студентів
# Знайдіть оцінку конкретного студента
# Видаліть одного студента
`,
      },
      {
        id: "alg-10",
        title: "Big O нотація",
        description: "Оцінка складності алгоритмів",
        completed: false,
        content: `# Big O нотація
# Визначте складність наступних алгоритмів:

# 1. Пошук елемента в масиві по індексу
# O(?) 

# 2. Лінійний пошук
# O(?)

# 3. Бінарний пошук
# O(?)

# 4. Сортування бульбашкою
# O(?)

# 5. Два вкладених цикли по n елементів
# O(?)
`,
      },
    ],
  },
]

const initialAchievements: Achievement[] = [
  {
    id: "first-step",
    title: "Перший крок",
    description: "Виконай перше завдання",
    icon: "🎯",
    unlocked: false,
    rarity: "common",
  },
  {
    id: "week-streak",
    title: "Тиждень наполегливості",
    description: "Навчайся 7 днів поспіль",
    icon: "🔥",
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "code-master",
    title: "Майстер коду",
    description: "Виконай 50 завдань",
    icon: "👑",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "night-owl",
    title: "Нічна сова",
    description: "Виконай завдання між 22:00 та 2:00",
    icon: "🦉",
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "speed-demon",
    title: "Демон швидкості",
    description: "Виконай завдання менш ніж за 2 хвилини",
    icon: "⚡",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "early-bird",
    title: "Рання пташка",
    description: "Виконай завдання до 7:00 ранку",
    icon: "🐦",
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "perfectionist",
    title: "Перфекціоніст",
    description: "Виконай 10 завдань без помилок",
    icon: "💎",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "marathon-runner",
    title: "Марафонець",
    description: "Навчайся 4 години підряд",
    icon: "🏃",
    unlocked: false,
    rarity: "legendary",
  },
  {
    id: "python-ninja",
    title: "Python Ніндзя",
    description: "Завершив всі Python завдання",
    icon: "🐍",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "web-wizard",
    title: "Веб Чарівник",
    description: "Завершив всі HTML/CSS завдання",
    icon: "🧙",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "algorithm-ace",
    title: "Ас Алгоритмів",
    description: "Завершив всі алгоритмічні завдання",
    icon: "🎓",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "helper",
    title: "Помічник",
    description: "Використав ШІ-тьютора 50 разів",
    icon: "🤝",
    unlocked: false,
    rarity: "common",
  },
  {
    id: "independent",
    title: "Самостійний",
    description: "Виконай 10 завдань без ШІ",
    icon: "💪",
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "comeback-kid",
    title: "Повернення",
    description: "Поверниcь після перерви у 7+ днів",
    icon: "🔄",
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "century",
    title: "Сотня",
    description: "Виконай 100 завдань",
    icon: "💯",
    unlocked: false,
    rarity: "legendary",
  },
  {
    id: "level-10",
    title: "Рівень 10",
    description: "Досягни 10 рівня",
    icon: "🔟",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "error-hunter",
    title: "Мисливець на помилки",
    description: "Виправ 100 помилок у коді",
    icon: "🐛",
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "fast-learner",
    title: "Швидко навчаюсь",
    description: "Виконай курс за 1 день",
    icon: "🚀",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "bookworm",
    title: "Книжковий черв'як",
    description: "Прочитай всі підказки у курсі",
    icon: "📚",
    unlocked: false,
    rarity: "common",
  },
  {
    id: "experimenter",
    title: "Експериментатор",
    description: "Запусти код 100 разів",
    icon: "🔬",
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "clean-coder",
    title: "Чистий код",
    description: "Використай форматування 20 разів",
    icon: "✨",
    unlocked: false,
    rarity: "rare",
  },
]

const initialDailyChallenges: DailyChallenge[] = [
  {
    id: "daily-3-tasks",
    title: "Тренування дня",
    description: "Виконай 3 завдання сьогодні",
    progress: 0,
    target: 3,
    reward: 100,
    completed: false,
  },
  {
    id: "daily-30-min",
    title: "Півгодини навчання",
    description: "Витрать 30 хвилин на навчання",
    progress: 0,
    target: 30,
    reward: 50,
    completed: false,
  },
]

export const useAppState = create<AppState>()(
  persist(
    (set, get) => ({
      currentView: "dashboard",
      selectedCourse: null,
      selectedTask: null,
      showSettings: false,
      showProfile: false,
      courses: initialCourses,
      isOffline: true,
      isNetworkOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
      forceOffline: false,
      pendingSyncCount: 0,
      isSyncing: false,
      connectionStatus: typeof navigator !== "undefined" && navigator.onLine ? "ONLINE" : "OFFLINE",
      batteryLevel: 100,
      fontSize: 14,
      storageUsed: 12.4,
      snowAmount: 50,
      currentTask: null,
      code: "",
      consoleOutput: [],
      messages: [],
      userRole: "student",
      xp: 0,
      level: 1,
      streak: 0,
      lastActivityDate: null,
      totalStudyTime: 0,
      achievements: initialAchievements,
      dailyChallenges: initialDailyChallenges,

      completedTour: false,
      unlockedThemes: ["default"],
      currentTheme: "default",

      studentActivities: [],
      screenMode: false,

      setCurrentView: (view) => set({ currentView: view }),
      setSelectedCourse: (course) => set({ selectedCourse: course }),
      setSelectedTask: (task) => set({ selectedTask: task }),
      setShowSettings: (show) => set({ showSettings: show }),
      setShowProfile: (show) => set({ showProfile: show }),
      setIsOffline: (offline) => set({ isOffline: offline, forceOffline: offline }),
      setForceOffline: (offline) =>
        set((state) => ({
          forceOffline: offline,
          isOffline: offline || !state.isNetworkOnline,
          connectionStatus: offline
            ? "FORCE OFFLINE"
            : state.isNetworkOnline
              ? state.pendingSyncCount > 0
                ? `ONLINE · ${state.pendingSyncCount} pending`
                : "ONLINE"
              : "OFFLINE",
        })),
      setNetworkStatus: (status) =>
        set((state) => {
          const isNetworkOnline = status.isNetworkOnline ?? state.isNetworkOnline
          const pendingSyncCount = status.pendingSyncCount ?? state.pendingSyncCount
          const isSyncing = status.isSyncing ?? state.isSyncing
          const isOffline = status.isOffline ?? (state.forceOffline || !isNetworkOnline)
          return {
            isNetworkOnline,
            pendingSyncCount,
            isSyncing,
            isOffline,
            connectionStatus:
              status.connectionStatus ??
              (isOffline
                ? state.forceOffline && isNetworkOnline
                  ? "FORCE OFFLINE"
                  : "OFFLINE"
                : isSyncing
                  ? "SYNCING..."
                  : pendingSyncCount > 0
                    ? `ONLINE · ${pendingSyncCount} pending`
                    : "ONLINE"),
          }
        }),
      setConnectionStatus: (status) => set({ connectionStatus: status }),
      setBatteryLevel: (level) => set({ batteryLevel: level }),
      setFontSize: (size) => set({ fontSize: size }),
      setStorageUsed: (used) => set({ storageUsed: used }),
      setSnowAmount: (amount) => set({ snowAmount: amount }),
      setCode: (code) => set({ code }),
      setConsoleOutput: (output) =>
        set((state) => ({
          consoleOutput: typeof output === "function" ? output(state.consoleOutput) : output,
        })),
      setCurrentTask: (task) => set({ currentTask: task, code: task?.code || "" }),
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, { ...message, id: `msg-${Date.now()}-${Math.random()}` }],
        })),
      clearMessages: () => set({ messages: [] }),
      completeTask: (courseId, taskId) =>
        set((state) => {
          const courses = state.courses.map((course) => {
            if (course.id !== courseId) return course
            const updatedTasks = course.tasks.map((task) => (task.id === taskId ? { ...task, completed: true } : task))
            const completedCount = updatedTasks.filter((t) => t.completed).length
            return {
              ...course,
              tasks: updatedTasks,
              completedTasks: completedCount,
              progress: Math.round((completedCount / course.totalTasks) * 100),
            }
          })

          // Додати XP
          const newXP = state.xp + 100
          const newLevel = Math.floor(newXP / 1000) + 1

          // Перевірка досягнень
          const totalCompleted = courses.reduce((acc, c) => acc + c.completedTasks, 0)
          const achievements = state.achievements.map((a) => {
            if (a.id === "first-step" && totalCompleted === 1 && !a.unlocked) {
              return { ...a, unlocked: true, unlockedAt: new Date() }
            }
            if (a.id === "code-master" && totalCompleted >= 50 && !a.unlocked) {
              return { ...a, unlocked: true, unlockedAt: new Date() }
            }
            return a
          })

          // Оновити челенджі
          const dailyChallenges = state.dailyChallenges.map((c) => {
            if (c.id === "daily-3-tasks") {
              const progress = c.progress + 1
              return { ...c, progress, completed: progress >= c.target }
            }
            return c
          })

          return {
            courses,
            xp: newXP,
            level: newLevel,
            achievements,
            dailyChallenges,
          }
        }),
      setUserRole: (role) => set({ userRole: role }),
      addXP: (amount) =>
        set((state) => {
          const newXP = state.xp + amount
          const newLevel = Math.floor(newXP / 1000) + 1
          return { xp: newXP, level: newLevel }
        }),
      checkAndUpdateStreak: () =>
        set((state) => {
          const today = new Date().toDateString()
          const lastDate = state.lastActivityDate ? new Date(state.lastActivityDate).toDateString() : null

          if (lastDate === today) return state

          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toDateString()

          if (lastDate === yesterdayStr) {
            return { streak: state.streak + 1, lastActivityDate: new Date() }
          } else {
            return { streak: 1, lastActivityDate: new Date() }
          }
        }),
      unlockAchievement: (id) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id ? { ...a, unlocked: true, unlockedAt: new Date() } : a,
          ),
        })),
      updateDailyChallenge: (id, progress) =>
        set((state) => ({
          dailyChallenges: state.dailyChallenges.map((c) =>
            c.id === id ? { ...c, progress, completed: progress >= c.target } : c,
          ),
        })),
      addStudentActivity: (activity) =>
        set((state) => ({
          studentActivities: [
            {
              ...activity,
              id: `activity-${Date.now()}`,
              timestamp: new Date(),
            },
            ...state.studentActivities,
          ].slice(0, 100),
        })),
      setScreenMode: (mode) => set({ screenMode: mode }),

      markTourComplete: () => set({ completedTour: true }),
      unlockTheme: (themeId) =>
        set((state) => ({
          unlockedThemes: state.unlockedThemes.includes(themeId)
            ? state.unlockedThemes
            : [...state.unlockedThemes, themeId],
        })),
      setCurrentTheme: (themeId) => set({ currentTheme: themeId }),
    }),
    {
      name: "edu-survival-kit-storage",
      partialize: (state) => {
        const {
          isNetworkOnline: _n,
          pendingSyncCount: _p,
          isSyncing: _s,
          ...persisted
        } = state
        return persisted
      },
    },
  ),
)

export function AppProvider({ children }: { children: React.ReactNode }) {
  return <OfflineProvider>{children}</OfflineProvider>
}

// Export as useStore for convenience
export const useStore = useAppState
