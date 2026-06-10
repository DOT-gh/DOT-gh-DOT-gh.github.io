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

export interface GameStats {
  totalGamesPlayed: number
  mazeWins: number
  mazeLevelsCompleted: number[]
  mazeBestMoves: Record<number, number>
  binaryBestScore: number
  binaryPlays: number
  memoryWins: number
  memoryBestMoves: number | null
}

export type GameResult =
  | { game: "maze"; level: number; moves: number }
  | { game: "binary"; score: number }
  | { game: "memory"; moves: number }

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

  gameStats: GameStats
  recordGameResult: (result: GameResult) => void

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
        content: `# Хе��-таблиця
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
  {
    id: "js",
    title: "JavaScript: Інтерактив",
    description: "Мова, яка оживляє веб-сторінки",
    icon: "js",
    progress: 0,
    completedTasks: 0,
    totalTasks: 8,
    tasks: [
      {
        id: "js-1",
        title: "console.log та змінні",
        description: "Перші кроки в JavaScript",
        completed: false,
        content: `// Перша програма на JavaScript
// Виведіть у консоль "Привіт, JavaScript!"

// Підказка: console.log("...")

`,
        hint: 'console.log("Привіт, JavaScript!")',
        solution: 'console.log("Привіт, JavaScript!")',
      },
      {
        id: "js-2",
        title: "let, const та типи",
        description: "Оголошення змінних",
        completed: false,
        content: `// Змінні в JavaScript
// Створіть const name з вашим ім'ям
// Створіть let score зі значенням 0
// Збільште score на 10 та виведіть у консоль

`,
        hint: "const не можна змінювати, let — можна",
      },
      {
        id: "js-3",
        title: "Функції та стрілки",
        description: "Звичайні та стрілкові функції",
        completed: false,
        content: `// Функції
// Створіть функцію square(n), що повертає n * n
// Перепишіть її як стрілкову: const square = (n) => ...

console.log(square(5)) // 25

`,
      },
      {
        id: "js-4",
        title: "Масиви та методи",
        description: "map, filter, reduce",
        completed: false,
        content: `// Методи масивів
const numbers = [1, 2, 3, 4, 5, 6]

// 1. Створіть масив doubled (кожне число * 2) через map
// 2. Створіть масив evens (тільки парні) через filter
// 3. Порахуйте суму всіх чисел через reduce

`,
      },
      {
        id: "js-5",
        title: "Об'єкти",
        description: "Структури даних у JS",
        completed: false,
        content: `// Об'єкти
// Створіть об'єкт student з полями: name, grade, subjects (масив)
// Виведіть ім'я через крапку та через ["..."]
// Додайте нове поле email

`,
      },
      {
        id: "js-6",
        title: "DOM: пошук елементів",
        description: "querySelector та getElementById",
        completed: false,
        content: `// Робота з DOM
// HTML: <button id="btn">Натисни</button>
//       <p class="text">Текст</p>

// 1. Знайдіть кнопку через getElementById
// 2. Знайдіть параграф через querySelector
// 3. Змініть текст параграфа на "Змінено!"

`,
      },
      {
        id: "js-7",
        title: "Події",
        description: "addEventListener",
        completed: false,
        content: `// Події
// Додайте обробник кліку на кнопку:
// при натисканні виведіть "Клік!" у консоль
// та змініть колір фону сторінки

const btn = document.getElementById("btn")
// btn.addEventListener("click", () => { ... })

`,
      },
      {
        id: "js-8",
        title: "Міні-проєкт: лічильник",
        description: "Об'єднайте все вивчене",
        completed: false,
        content: `// Міні-проєкт: Лічильник кліків
// Створіть лічильник, який:
// 1. Показує число на сторінці
// 2. Має кнопки "+" та "-"
// 3. Не дозволяє піти нижче 0

let count = 0

`,
      },
    ],
  },
  {
    id: "scratch",
    title: "Логіка та Scratch",
    description: "Візуальне програмування та логічне мислення",
    icon: "scratch",
    progress: 0,
    completedTasks: 0,
    totalTasks: 6,
    tasks: [
      {
        id: "sc-1",
        title: "Алгоритм у блоках",
        description: "Складіть послідовність дій",
        completed: false,
        content: `# Блочне мислення
# Запишіть блоками (коментарями) алгоритм:
# "Кіт іде до м'ячика та каже Привіт"

# [Коли натиснуто прапорець]
# [Іти ... кроків]
# [Сказати "..."]

`,
      },
      {
        id: "sc-2",
        title: "Цикли у Scratch",
        description: "Повторення дій",
        completed: false,
        content: `# Цикли
# Намалюйте квадрат блоками:
# [Повторити 4 рази]
#   [Іти 100 кроків]
#   [Повернути на 90 градусів]

# А тепер запишіть, як намалювати трикутник
# та шестикутник (який кут повороту?)

`,
      },
      {
        id: "sc-3",
        title: "Умови: якщо-інакше",
        description: "Розгалуження у програмі",
        completed: false,
        content: `# Умови
# Гра: кіт ловить м'ячик
# Запишіть логіку блоками:

# [Якщо торкається м'ячика]
#   [Змінити рахунок на +1]
# [Інакше]
#   [...]

`,
      },
      {
        id: "sc-4",
        title: "Змінні та рахунок",
        description: "Зберігання даних у грі",
        completed: false,
        content: `# Змінні
# Створіть гру з рахунком:
# 1. Змінна "рахунок" = 0
# 2. При кліку на спрайт: рахунок +1
# 3. Якщо рахунок = 10: сказати "Перемога!"

`,
      },
      {
        id: "sc-5",
        title: "Координати сцени",
        description: "Система X та Y",
        completed: false,
        content: `# Координати
# Сцена Scratch: X від -240 до 240, Y від -180 до 180
# Це��тр сцени: (0, 0)

# Куди потрапить спрайт із командою:
# [Перейти в x: -240 y: 180]  -> який це кут?
# [Перейти в x: 240 y: -180]  -> який це кут?

`,
      },
      {
        id: "sc-6",
        title: "Проєкт: своя гра",
        description: "Спроєктуйте власну гру",
        completed: false,
        content: `# Власна гра
# Опишіть план своєї гри:
# 1. Який герой? (спрайт)
# 2. Яка мета гри?
# 3. Які блоки знадобляться?
# 4. Як рахуються бали?
# 5. Коли гра закінчується?

`,
      },
    ],
  },
  {
    id: "cyber",
    title: "Кібербезпека",
    description: "Захист себе та даних в інтернеті",
    icon: "cyber",
    progress: 0,
    completedTasks: 0,
    totalTasks: 7,
    tasks: [
      {
        id: "cb-1",
        title: "Надійний пароль",
        description: "Правила створення паролів",
        completed: false,
        content: `# Надійні паролі
# Оцініть паролі від 1 до 5 та поясніть чому:

# 1. "123456"           -> ?
# 2. "qwerty"           -> ?
# 3. "Kit_Murchyk2010"  -> ?
# 4. "T7#kP!9zQm$2vX"   -> ?

# Складіть свій надійний пароль (НЕ справжній!)
# за правилом: 12+ символів, букви, цифри, знаки

`,
      },
      {
        id: "cb-2",
        title: "Фішинг: знайди обман",
        description: "Розпізнавання шахрайських листів",
        completed: false,
        content: `# Фішинг
# Який з листів шахрайський? Знайдіть 3 ознаки:

# Лист 1: "Вiтаємо! Ви виграли iPhone!
#   Перейдiть за посиланням bit.ly/win123
#   та введiть данi картки для доставки"

# Лист 2: "Ваше замовлення №4521 прийнято.
#   Деталі в особистому кабінеті rozetka.com.ua"

# Ознака 1: ...
# Ознака 2: ...
# Ознака 3: ...

`,
      },
      {
        id: "cb-3",
        title: "Двофакторна автентифікація",
        description: "Подвійний захист акаунтів",
        completed: false,
        content: `# 2FA - двофакторна автентифікація
# Що це: пароль + другий фактор (SMS, додаток, ключ)

# Запишіть:
# 1. Які 3 типи другого фактора існують?
# 2. Чому SMS вважається менш безпечним?
# 3. На яких своїх акаунтах варто увімкнути 2FA?

`,
      },
      {
        id: "cb-4",
        title: "Цифровий слід",
        description: "Що про вас знає інтернет",
        completed: false,
        content: `# Цифровий слід
# Все, що ви робите онлайн, залишає слід

# Завдання:
# 1. Перелічіть 5 типів даних, які збирають сайти
# 2. Що таке cookies та навіщо вони?
# 3. Які дані НЕ можна публікувати у соцмережах?

`,
      },
      {
        id: "cb-5",
        title: "Шифрування: шифр Цезаря",
        description: "Основи криптографії",
        completed: false,
        content: `# Шифр Цезаря
# Кожна літера зсувається на N позицій в алфавіті
# Приклад (зсув 3): А->Г, Б->Д, В->Е

# 1. Зашифруйте слово "КОД" зі зсувом 3
# 2. Розшифруйте англ. "WKH" (зсув 3)
# 3. Чому такий шифр легко зламати?

`,
      },
      {
        id: "cb-6",
        title: "Безпека Wi-Fi",
        description: "Публічні мережі та VPN",
        completed: false,
        content: `# Безпека мереж
# Ви у кафе з безкоштовним Wi-Fi "Free_WiFi_Cafe"

# Запишіть:
# 1. Які 3 небезпеки публічного Wi-Fi?
# 2. Що можна робити, а що ні в такій мережі?
# 3. Як VPN захищає ваші дані?

`,
      },
      {
        id: "cb-7",
        title: "Тест: кіберзахисник",
        description: "Перевірка знань",
        completed: false,
        content: `# Фінальний тест
# Дайте відповіді:

# 1. Друг просить ваш пароль "на хвилинку". Дії?
# 2. Прийшло SMS: "Ваша картка заблокована,
#    подзвоніть 0-800-XXX". Дії?
# 3. Браузер каже "Сертифікат сайту недійсний". Дії?
# 4. Знайшли флешку біля школи. Дії?

`,
      },
    ],
  },
  {
    id: "data",
    title: "Комп'ютер та дані",
    description: "Як влаштовані комп'ютери та інформація",
    icon: "data",
    progress: 0,
    completedTasks: 0,
    totalTasks: 7,
    tasks: [
      {
        id: "dt-1",
        title: "Біти та байти",
        description: "Одиниці вимірювання інформації",
        completed: false,
        content: `# Біти та байти
# 1 байт = 8 біт
# 1 КБ = 1024 байти, 1 МБ = 1024 КБ, 1 ГБ = 1024 МБ

# Обчисліть:
# 1. Скільки біт у 4 байтах?
# 2. Скільки КБ у 2 МБ?
# 3. Фото = 5 МБ. Скільки фото вміститься на 32 ГБ?

`,
      },
      {
        id: "dt-2",
        title: "Двійкова система",
        description: "Мова комп'ютерів: 0 та 1",
        completed: false,
        content: `# Двійкова система
# 1011 = 1*8 + 0*4 + 1*2 + 1*1 = 11

# Переведіть у десяткову:
# 101  = ?
# 1100 = ?
# 1111 = ?

# Переведіть у двійкову:
# 5  = ?
# 10 = ?

`,
      },
      {
        id: "dt-3",
        title: "Як зберігається текст",
        description: "ASCII та Unicode",
        completed: false,
        content: `# Кодування тексту
# Кожен символ - це число: A=65, B=66, a=97

# 1. Закодуйте слово "CAT" числами ASCII
# 2. Розкодуйте: 72 73 (підказка: H=72)
# 3. Чому для української потрібен Unicode,
#    а не ASCII?

`,
      },
      {
        id: "dt-4",
        title: "Растрові зображення",
        description: "Пікселі та кольори",
        completed: false,
        content: `# Зображення з пікселів
# Кожен піксель: RGB (червоний, зелений, синій)
# RGB(255, 0, 0) = червоний

# 1. Який колір RGB(0, 255, 0)?
# 2. Який колір RGB(255, 255, 255)?
# 3. Фото 1000x1000 пікселів, 3 байти на піксель.
#    Скільки МБ займає без стиснення?

`,
      },
      {
        id: "dt-5",
        title: "Процесор та пам'ять",
        description: "Головні частини комп'ютера",
        completed: false,
        content: `# Залізо комп'ютера
# Зіставте компонент та функцію:

# CPU, RAM, SSD, GPU, материнська плата

# 1. "Мозок", виконує обчислення -> ?
# 2. Швидка тимчасова пам'ять -> ?
# 3. Постійне сховище файлів -> ?
# 4. Обробка графіки та ігор -> ?
# 5. З'єднує все разом -> ?

`,
      },
      {
        id: "dt-6",
        title: "Файли та розширення",
        description: "Типи файлів",
        completed: false,
        content: `# Типи файлів
# Зіставте розширення та тип:

# .jpg .mp3 .docx .py .zip .mp4 .html

# Зображення: ?
# Музика: ?
# Документ: ?
# Код Python: ?
# Архів: ?
# Відео: ?
# Веб-сторінка: ?

`,
      },
      {
        id: "dt-7",
        title: "Інтернет: як це працює",
        description: "IP, DNS та сервери",
        completed: false,
        content: `# Як працює інтернет
# Ви вводите google.com - що відбувається?

# Розставте кроки по порядку:
# [ ] Сервер надсилає HTML-сторінку
# [ ] Браузер запитує DNS: яка IP-адреса?
# [ ] Браузер відображає сторінку
# [ ] DNS відповідає: 142.250.x.x
# [ ] Браузер надсилає запит на IP-адресу

`,
      },
    ],
  },
  {
    id: "sql",
    title: "Бази даних: SQL",
    description: "Зберігання та пошук даних",
    icon: "sql",
    progress: 0,
    completedTasks: 0,
    totalTasks: 6,
    tasks: [
      {
        id: "sq-1",
        title: "Що таке база даних",
        description: "Таблиці, рядки, стовпці",
        completed: false,
        content: `-- База даних = організовані таблиці
-- Таблиця students:
-- | id | name   | grade | city  |
-- | 1  | Олег   | 8     | Київ  |
-- | 2  | Марія  | 9     | Львів |

-- Спроєктуйте таблицю "books" для бібліотеки:
-- які стовпці потрібні? (мінімум 5)

`,
      },
      {
        id: "sq-2",
        title: "SELECT: вибірка даних",
        description: "Перший запит",
        completed: false,
        content: `-- SELECT повертає дані з таблиці

-- Виберіть усіх студентів:
SELECT * FROM students;

-- Напишіть запити:
-- 1. Тільки імена студентів
-- 2. Імена та міста

`,
        hint: "SELECT name FROM students;",
      },
      {
        id: "sq-3",
        title: "WHERE: фільтрація",
        description: "Пошук за умовою",
        completed: false,
        content: `-- WHERE фільтрує рядки

SELECT * FROM students WHERE grade = 8;

-- Напишіть запити:
-- 1. Студенти з Києва
-- 2. Студенти 9 класу зі Львова (AND)
-- 3. Студенти 8 АБО 9 класу (OR)

`,
      },
      {
        id: "sq-4",
        title: "INSERT та UPDATE",
        description: "Додавання та зміна даних",
        completed: false,
        content: `-- INSERT додає рядок:
INSERT INTO students (name, grade, city)
VALUES ('Іван', 8, 'Одеса');

-- UPDATE змінює дані:
UPDATE students SET grade = 9 WHERE name = 'Олег';

-- Напишіть:
-- 1. Додайте себе у таблицю
-- 2. Змініть місто Марії на 'Харків'

`,
      },
      {
        id: "sq-5",
        title: "ORDER BY та COUNT",
        description: "Сортування та підрахунок",
        completed: false,
        content: `-- Сортування:
SELECT * FROM students ORDER BY name;

-- Підрахунок:
SELECT COUNT(*) FROM students;

-- Напишіть:
-- 1. Студенти за класом (від більшого)
-- 2. Скільки студентів з Києва?

`,
      },
      {
        id: "sq-6",
        title: "Проєкт: база школи",
        description: "Спроєктуйте власну БД",
        completed: false,
        content: `-- Фінальний проєкт
-- Спроєктуйте базу даних школи:

-- 1. Таблиця teachers: які стовпці?
-- 2. Таблиця subjects: які стовпці?
-- 3. Як зв'язати вчителя та предмет?
-- 4. Напишіть 2 корисні запити для завуча

`,
      },
    ],
  },
  {
    id: "ai",
    title: "Штучний інтелект",
    description: "Як працюють нейромережі та ШІ",
    icon: "ai",
    progress: 0,
    completedTasks: 0,
    totalTasks: 6,
    tasks: [
      {
        id: "ai-1",
        title: "Що таке ШІ",
        description: "Види штучного інтелекту",
        completed: false,
        content: `# Штучний інтелект навколо нас
# Де ви зустрічаєте ШІ щодня?

# Запишіть 5 прикладів ШІ у житті:
# 1. Рекомендації YouTube
# 2. ...
# 3. ...
# 4. ...
# 5. ...

# Чим ШІ відрізняється від звичайної програми?

`,
      },
      {
        id: "ai-2",
        title: "Машинне навчання",
        description: "Як комп'ютер вчиться",
        completed: false,
        content: `# Машинне навчання
# Програма вчиться на прикладах, а не за правилами

# Завдання: навчити ШІ розрізняти котів і собак
# 1. Що потрібно для навчання? (дані!)
# 2. Скільки приблизно фото потрібно?
# 3. Що буде, якщо показати тільки рудих котів?
#    (упередженість даних - bias)

`,
      },
      {
        id: "ai-3",
        title: "Нейрони та мережі",
        description: "Будова нейромережі",
        completed: false,
        content: `# Нейронна мережа
# Штучний нейрон: входи -> ваги -> сума -> вихід

# Простий нейрон вирішує: йти гуляти чи ні
# Входи: погода(0-10), настрій(0-10), час(0-10)
# Ваги:  0.5,          0.3,           0.2

# Обчисліть вихід для:
# погода=8, настрій=6, час=4
# (8*0.5 + 6*0.3 + 4*0.2 = ?)
# Якщо результат > 5 -> йти гуляти!

`,
      },
      {
        id: "ai-4",
        title: "Промпти для ШІ",
        description: "Мистецтво запитів",
        completed: false,
        content: `# Промпт-інженерія
# Якість відповіді ШІ залежить від запиту

# Поганий промпт: "розкажи про космос"
# Хороший: "Поясни 8-класнику, чому Марс червоний,
#           у 3 реченнях з прикладом"

# Покращіть промпти:
# 1. "напиши твір"
# 2. "допоможи з математикою"
# 3. "зроби презентацію"

`,
      },
      {
        id: "ai-5",
        title: "Етика ШІ",
        description: "Можна і не можна",
        completed: false,
        content: `# Етика використання ШІ
# Обговоріть кожну ситуацію: чесно чи ні?

# 1. ШІ написав за тебе весь твір, ти здав як свій
# 2. ШІ пояснив тему, ти написав твір сам
# 3. ШІ перевірив твої помилки у творі
# 4. Дипфейк-відео з обличчям однокласника
# 5. ШІ-переклад тексту для розуміння

# Сформулюйте 3 власні правила використання ШІ

`,
      },
      {
        id: "ai-6",
        title: "ШІ розпізнає образи",
        description: "Комп'ютерний зір",
        completed: false,
        content: `# Комп'ютерний зір
# Як ШІ "бачить" зображення: пікселі -> ознаки -> об'єкт

# Завдання: ШІ має розпізнати рукописну цифру "7"
# 1. Які ознаки має цифра 7? (лінії, кути)
# 2. Чому ШІ може сплутати 7 та 1?
# 3. Де використовують розпізнавання:
#    запишіть 4 приклади (медицина, авто...)

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
  {
    id: "maze-runner",
    title: "Підкорювач лабіринтів",
    description: "Пройди лабіринт кодера",
    icon: "🌀",
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "maze-master",
    title: "Майстер лабіринтів",
    description: "Пройди всі 3 рівні лабіринту",
    icon: "🏆",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "binary-brain",
    title: "Двійковий мозок",
    description: "Набери 10+ очок у Бінарному вибуху",
    icon: "🧠",
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "memory-master",
    title: "Залізна пам'ять",
    description: "Виграй гру на пам'ять",
    icon: "🃏",
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "game-lover",
    title: "Геймер-програміст",
    description: "Зіграй 10 ігор в Ігровій зоні",
    icon: "🎮",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "js-hero",
    title: "JS Герой",
    description: "Завершив курс JavaScript",
    icon: "⚡",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "cyber-guardian",
    title: "Кіберзахисник",
    description: "Завершив курс Кібербезпеки",
    icon: "🛡️",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "data-explorer",
    title: "Дослідник даних",
    description: "Завершив курс Комп'ютер та дані",
    icon: "💾",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "sql-wizard",
    title: "SQL Чарівник",
    description: "Завершив курс Бази даних",
    icon: "🗃️",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "ai-pioneer",
    title: "Піонер ШІ",
    description: "Завершив курс Штучного інтелекту",
    icon: "🤖",
    unlocked: false,
    rarity: "legendary",
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

      gameStats: {
        totalGamesPlayed: 0,
        mazeWins: 0,
        mazeLevelsCompleted: [],
        mazeBestMoves: {},
        binaryBestScore: 0,
        binaryPlays: 0,
        memoryWins: 0,
        memoryBestMoves: null,
      },

      recordGameResult: (result) =>
        set((state) => {
          const stats: GameStats = {
            ...state.gameStats,
            totalGamesPlayed: state.gameStats.totalGamesPlayed + 1,
          }
          let earnedXP = 0
          const toUnlock = new Set<string>()

          if (result.game === "maze") {
            stats.mazeWins += 1
            if (!stats.mazeLevelsCompleted.includes(result.level)) {
              stats.mazeLevelsCompleted = [...stats.mazeLevelsCompleted, result.level]
            }
            const prevBest = stats.mazeBestMoves[result.level]
            if (!prevBest || result.moves < prevBest) {
              stats.mazeBestMoves = { ...stats.mazeBestMoves, [result.level]: result.moves }
            }
            earnedXP = 50 + result.level * 25
            toUnlock.add("maze-runner")
            if (stats.mazeLevelsCompleted.length >= 3) toUnlock.add("maze-master")
          } else if (result.game === "binary") {
            stats.binaryPlays += 1
            if (result.score > stats.binaryBestScore) stats.binaryBestScore = result.score
            earnedXP = result.score * 10
            if (result.score >= 10) toUnlock.add("binary-brain")
          } else if (result.game === "memory") {
            stats.memoryWins += 1
            if (stats.memoryBestMoves === null || result.moves < stats.memoryBestMoves) {
              stats.memoryBestMoves = result.moves
            }
            earnedXP = Math.max(120 - result.moves * 2, 40)
            toUnlock.add("memory-master")
          }

          if (stats.totalGamesPlayed >= 10) toUnlock.add("game-lover")

          const newXP = state.xp + earnedXP
          const newLevel = Math.floor(newXP / 1000) + 1
          const achievements = state.achievements.map((a) =>
            toUnlock.has(a.id) && !a.unlocked ? { ...a, unlocked: true, unlockedAt: new Date() } : a,
          )

          return { gameStats: stats, xp: newXP, level: newLevel, achievements }
        }),

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
          const courseAchievementMap: Record<string, string> = {
            python: "python-ninja",
            web: "web-wizard",
            algorithm: "algorithm-ace",
            js: "js-hero",
            cyber: "cyber-guardian",
            data: "data-explorer",
            sql: "sql-wizard",
            ai: "ai-pioneer",
          }
          const finishedCourse = courses.find((c) => c.id === courseId)
          const courseDone = finishedCourse && finishedCourse.completedTasks >= finishedCourse.totalTasks
          const achievements = state.achievements.map((a) => {
            if (a.id === "first-step" && totalCompleted === 1 && !a.unlocked) {
              return { ...a, unlocked: true, unlockedAt: new Date() }
            }
            if (a.id === "code-master" && totalCompleted >= 50 && !a.unlocked) {
              return { ...a, unlocked: true, unlockedAt: new Date() }
            }
            if (a.id === "century" && totalCompleted >= 100 && !a.unlocked) {
              return { ...a, unlocked: true, unlockedAt: new Date() }
            }
            if (courseDone && a.id === courseAchievementMap[courseId] && !a.unlocked) {
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

          const updatedSelectedCourse =
            state.selectedCourse && state.selectedCourse.id === courseId
              ? (courses.find((c) => c.id === courseId) ?? state.selectedCourse)
              : state.selectedCourse
          const updatedSelectedTask =
            state.selectedTask && state.selectedTask.id === taskId
              ? { ...state.selectedTask, completed: true }
              : state.selectedTask

          return {
            courses,
            xp: newXP,
            level: newLevel,
            achievements,
            dailyChallenges,
            selectedCourse: updatedSelectedCourse,
            selectedTask: updatedSelectedTask,
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
      version: 2,
      migrate: (persistedState, version) => {
        const persisted = persistedState as Partial<AppState> | undefined
        if (!persisted) return persistedState as AppState
        if (version < 2) {
          // Об'єднати старий прогрес зі списком нових курсів
          const oldCourses = persisted.courses ?? []
          persisted.courses = initialCourses.map((course) => {
            const old = oldCourses.find((o) => o.id === course.id)
            if (!old) return course
            const tasks = course.tasks.map((task) => {
              const oldTask = old.tasks?.find((t) => t.id === task.id)
              return oldTask?.completed ? { ...task, completed: true } : task
            })
            const completedTasks = tasks.filter((t) => t.completed).length
            return {
              ...course,
              tasks,
              completedTasks,
              progress: Math.round((completedTasks / course.totalTasks) * 100),
            }
          })
          // Об'єднати старі розблоковані досягнення з новим списком
          const oldAchievements = persisted.achievements ?? []
          persisted.achievements = initialAchievements.map((a) => {
            const old = oldAchievements.find((o) => o.id === a.id)
            return old?.unlocked ? { ...a, unlocked: true, unlockedAt: old.unlockedAt } : a
          })
          // Структура вибраного курсу могла змінитись — скинути
          persisted.selectedCourse = null
          persisted.selectedTask = null
          persisted.currentView = "dashboard"
        }
        return persisted as AppState
      },
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
// Alias used by the games components
export const useAppStore = useAppState
