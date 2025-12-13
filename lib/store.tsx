"use client"

import type React from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

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
  batteryLevel: number
  fontSize: number
  storageUsed: number
  snowAmount: number

  // User Role
  userRole: "student" | "teacher"
  setUserRole: (role: "student" | "teacher") => void

  // Actions
  setCurrentView: (view: "dashboard" | "learning") => void
  setSelectedCourse: (course: Course | null) => void
  setSelectedTask: (task: Task | null) => void
  setShowSettings: (show: boolean) => void
  setShowProfile: (show: boolean) => void
  setIsOffline: (offline: boolean) => void
  setBatteryLevel: (level: number) => void
  setFontSize: (size: number) => void
  setStorageUsed: (used: number) => void
  setSnowAmount: (amount: number) => void
  completeTask: (courseId: string, taskId: string) => void
  setCode: (code: string) => void
  setConsoleOutput: (output: string[] | ((prev: string[]) => string[])) => void
  setCurrentTask: (task: { id: number; title: string; code: string; expectedOutput?: string } | null) => void
  addMessage: (message: Omit<Message, "id">) => void
  clearMessages: () => void
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

export const useAppState = create<AppState>()(
  persist(
    (set) => ({
      currentView: "dashboard",
      selectedCourse: null,
      selectedTask: null,
      showSettings: false,
      showProfile: false,
      courses: initialCourses,
      isOffline: false,
      batteryLevel: 100,
      fontSize: 14,
      storageUsed: 12.4,
      snowAmount: 50,
      currentTask: null,
      code: "",
      consoleOutput: [],
      messages: [],
      userRole: "student",

      setCurrentView: (view) => set({ currentView: view }),
      setSelectedCourse: (course) => set({ selectedCourse: course }),
      setSelectedTask: (task) => set({ selectedTask: task }),
      setShowSettings: (show) => set({ showSettings: show }),
      setShowProfile: (show) => set({ showProfile: show }),
      setIsOffline: (offline) => set({ isOffline: offline }),
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
        set((state) => ({
          courses: state.courses.map((course) => {
            if (course.id !== courseId) return course
            const updatedTasks = course.tasks.map((task) => (task.id === taskId ? { ...task, completed: true } : task))
            const completedCount = updatedTasks.filter((t) => t.completed).length
            return {
              ...course,
              tasks: updatedTasks,
              completedTasks: completedCount,
              progress: Math.round((completedCount / course.totalTasks) * 100),
            }
          }),
        })),
      setUserRole: (role) => set({ userRole: role }),
    }),
    {
      name: "edu-survival-kit-storage",
    },
  ),
)

export function AppProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
