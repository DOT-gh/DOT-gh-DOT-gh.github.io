"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface Course {
  id: string
  title: string
  description: string
  progress: number
  image: string
  color: string
}

interface Task {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  points: number
  completed: boolean
  courseId: string
}

interface AppState {
  courses: Course[]
  tasks: Task[]
  selectedCourse: Course | null
  selectedTask: Task | null
  darkMode: boolean
  offlineMode: boolean
  aiEnabled: boolean
  userProfile: {
    name: string
    email: string
    avatar: string
    points: number
    level: number
  }
  setSelectedCourse: (course: Course | null) => void
  setSelectedTask: (task: Task | null) => void
  toggleDarkMode: () => void
  toggleOfflineMode: () => void
  toggleAI: () => void
  updateTaskCompletion: (taskId: string, completed: boolean) => void
  updateUserProfile: (profile: Partial<AppState['userProfile']>) => void
}

const defaultCourses: Course[] = [
  {
    id: '1',
    title: 'Основи JavaScript',
    description: 'Вивчіть основи JavaScript для веб-розробки',
    progress: 65,
    image: '/placeholder.svg',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: '2',
    title: 'React для початківців',
    description: 'Освоїть React та створюйте сучасні веб-додатки',
    progress: 40,
    image: '/placeholder.svg',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: '3',
    title: 'TypeScript Essential',
    description: 'Типізація для JavaScript розробників',
    progress: 20,
    image: '/placeholder.svg',
    color: 'from-indigo-400 to-purple-500'
  }
]

const defaultTasks: Task[] = [
  {
    id: '1',
    courseId: '1',
    title: 'Змінні та типи даних',
    description: 'Оголосіть змінні різних типів',
    difficulty: 'easy',
    points: 10,
    completed: true
  },
  {
    id: '2',
    courseId: '1',
    title: 'Функції та область видимості',
    description: 'Створіть функцію з параметрами',
    difficulty: 'medium',
    points: 20,
    completed: false
  },
  {
    id: '3',
    courseId: '1',
    title: 'Робота з масивами',
    description: 'Реалізуйте методи filter та map',
    difficulty: 'hard',
    points: 30,
    completed: false
  }
]

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [courses] = useState<Course[]>(defaultCourses)
  const [tasks, setTasks] = useState<Task[]>(defaultTasks)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [darkMode, setDarkMode] = useState(true)
  const [offlineMode, setOfflineMode] = useState(false)
  const [aiEnabled, setAiEnabled] = useState(true)
  const [userProfile, setUserProfile] = useState({
    name: 'Студент',
    email: 'student@example.com',
    avatar: '/avatar.svg',
    points: 150,
    level: 3
  })

  const toggleDarkMode = () => setDarkMode(!darkMode)
  const toggleOfflineMode = () => setOfflineMode(!offlineMode)
  const toggleAI = () => setAiEnabled(!aiEnabled)

  const updateTaskCompletion = (taskId: string, completed: boolean) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed } : task
    ))
  }

  const updateUserProfile = (profile: Partial<AppState['userProfile']>) => {
    setUserProfile({ ...userProfile, ...profile })
  }

  return (
    <AppContext.Provider value={{
      courses,
      tasks,
      selectedCourse,
      selectedTask,
      darkMode,
      offlineMode,
      aiEnabled,
      userProfile,
      setSelectedCourse,
      setSelectedTask,
      toggleDarkMode,
      toggleOfflineMode,
      toggleAI,
      updateTaskCompletion,
      updateUserProfile
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
