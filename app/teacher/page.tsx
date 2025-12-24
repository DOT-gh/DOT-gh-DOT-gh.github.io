"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  BookOpen,
  Users,
  Eye,
  BarChart3,
  Bot,
  ChevronLeft,
  Bell,
  EyeOff,
  Activity,
  WifiOff,
  Timer,
  Smartphone,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowLeft,
  TrendingUp,
  Server,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const classesData = [
  {
    id: "7a",
    name: "7-А (НУШ)",
    topic: "Алгоритми та виконавці",
    totalStudents: 30,
    activeStudents: 28,
    avgScore: 9.2,
    avgProgress: 94,
    students: [
      {
        id: "7a-01",
        name: "Бондаренко А.",
        progress: 100,
        lastActivity: "21.11, 14:45",
        currentTask: "Виконавець Робот - рівень 5",
        totalTime: "3г 12хв",
        tasksCompleted: 12,
        totalTasks: 12,
        aiRequestsCount: 8,
        offlineSessions: 4,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 45, device: "Android", city: "м. Шостка" },
          { date: "18.11", duration: 38, device: "Android", city: "м. Шостка" },
          { date: "19.11", duration: 52, device: "Android", city: "м. Шостка" },
          { date: "21.11", duration: 47, device: "Android", city: "м. Шостка" },
        ],
        avgTimePerTask: 16,
        hintsUsed: 3,
        errorRate: 12,
      },
      {
        id: "7a-02",
        name: "Василенко О.",
        progress: 92,
        lastActivity: "21.11, 13:20",
        currentTask: "Цикли у виконавці",
        totalTime: "2г 48хв",
        tasksCompleted: 11,
        totalTasks: 12,
        aiRequestsCount: 12,
        offlineSessions: 3,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 42, device: "iOS", city: "м. Шостка" },
          { date: "19.11", duration: 55, device: "iOS", city: "м. Шостка" },
          { date: "21.11", duration: 71, device: "iOS", city: "смт Вороніж" },
        ],
        avgTimePerTask: 15,
        hintsUsed: 5,
        errorRate: 18,
      },
      {
        id: "7a-03",
        name: "Гриценко М.",
        progress: 100,
        lastActivity: "21.11, 15:10",
        currentTask: "Завершено всі завдання",
        totalTime: "2г 55хв",
        tasksCompleted: 12,
        totalTasks: 12,
        aiRequestsCount: 5,
        offlineSessions: 5,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 35, device: "Windows", city: "м. Шостка" },
          { date: "18.11", duration: 40, device: "Windows", city: "м. Шостка" },
          { date: "19.11", duration: 45, device: "Windows", city: "м. Шостка" },
          { date: "20.11", duration: 38, device: "Windows", city: "м. Шостка" },
          { date: "21.11", duration: 17, device: "Windows", city: "м. Шостка" },
        ],
        avgTimePerTask: 14,
        hintsUsed: 2,
        errorRate: 8,
      },
      {
        id: "7a-04",
        name: "Демченко В.",
        progress: 83,
        lastActivity: "20.11, 16:30",
        currentTask: "Умовні оператори",
        totalTime: "2г 20хв",
        tasksCompleted: 10,
        totalTasks: 12,
        aiRequestsCount: 15,
        offlineSessions: 2,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 48, device: "Android", city: "с. Собич" },
          { date: "18.11", duration: 52, device: "Android", city: "с. Собич" },
          { date: "20.11", duration: 40, device: "Android", city: "м. Шостка" },
        ],
        avgTimePerTask: 14,
        hintsUsed: 7,
        errorRate: 22,
      },
      {
        id: "7a-05",
        name: "Євтушенко К.",
        progress: 100,
        lastActivity: "21.11, 14:00",
        currentTask: "Завершено",
        totalTime: "3г 05хв",
        tasksCompleted: 12,
        totalTasks: 12,
        aiRequestsCount: 6,
        offlineSessions: 4,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 40, device: "Android", city: "смт Ямпіль" },
          { date: "18.11", duration: 45, device: "Android", city: "смт Ямпіль" },
          { date: "19.11", duration: 50, device: "Android", city: "м. Шостка" },
          { date: "21.11", duration: 50, device: "Android", city: "м. Шостка" },
        ],
        avgTimePerTask: 15,
        hintsUsed: 3,
        errorRate: 10,
      },
      {
        id: "7a-06",
        name: "Жук С.",
        progress: 75,
        lastActivity: "19.11, 15:45",
        currentTask: "Базові алгоритми",
        totalTime: "1г 50хв",
        tasksCompleted: 9,
        totalTasks: 12,
        aiRequestsCount: 18,
        offlineSessions: 1,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 55, device: "iOS", city: "м. Шостка" },
          { date: "19.11", duration: 55, device: "iOS", city: "м. Шостка" },
        ],
        avgTimePerTask: 12,
        hintsUsed: 9,
        errorRate: 28,
      },
      {
        id: "7a-07",
        name: "Захарченко І.",
        progress: 100,
        lastActivity: "21.11, 13:55",
        currentTask: "Завершено",
        totalTime: "2г 40хв",
        tasksCompleted: 12,
        totalTasks: 12,
        aiRequestsCount: 4,
        offlineSessions: 3,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 38, device: "Android", city: "м. Шостка" },
          { date: "18.11", duration: 42, device: "Android", city: "м. Шостка" },
          { date: "21.11", duration: 80, device: "Android", city: "м. Шостка" },
        ],
        avgTimePerTask: 13,
        hintsUsed: 2,
        errorRate: 6,
      },
      {
        id: "7a-08",
        name: "Іванченко Л.",
        progress: 92,
        lastActivity: "21.11, 14:30",
        currentTask: "Фінальний тест",
        totalTime: "2г 35хв",
        tasksCompleted: 11,
        totalTasks: 12,
        aiRequestsCount: 9,
        offlineSessions: 4,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 35, device: "Android", city: "с. Клишки" },
          { date: "18.11", duration: 40, device: "Android", city: "с. Клишки" },
          { date: "19.11", duration: 38, device: "Android", city: "м. Шостка" },
          { date: "21.11", duration: 42, device: "Android", city: "м. Шостка" },
        ],
        avgTimePerTask: 14,
        hintsUsed: 4,
        errorRate: 15,
      },
      {
        id: "7a-09",
        name: "Кравченко П.",
        progress: 100,
        lastActivity: "21.11, 15:20",
        currentTask: "Завершено",
        totalTime: "3г 20хв",
        tasksCompleted: 12,
        totalTasks: 12,
        aiRequestsCount: 7,
        offlineSessions: 5,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 45, device: "Windows", city: "м. Шостка" },
          { date: "18.11", duration: 42, device: "Windows", city: "м. Шостка" },
          { date: "19.11", duration: 48, device: "Windows", city: "м. Шостка" },
          { date: "20.11", duration: 35, device: "Windows", city: "м. Шостка" },
          { date: "21.11", duration: 30, device: "Windows", city: "м. Шостка" },
        ],
        avgTimePerTask: 17,
        hintsUsed: 3,
        errorRate: 9,
      },
      {
        id: "7a-10",
        name: "Литвиненко Д.",
        progress: 67,
        lastActivity: "20.11, 14:15",
        currentTask: "Вкладені цикли",
        totalTime: "1г 45хв",
        tasksCompleted: 8,
        totalTasks: 12,
        aiRequestsCount: 20,
        offlineSessions: 2,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 50, device: "Android", city: "м. Шостка" },
          { date: "20.11", duration: 55, device: "Android", city: "м. Шостка" },
        ],
        avgTimePerTask: 13,
        hintsUsed: 10,
        errorRate: 32,
      },
      // ВПО за кордоном - стабільна локація
      {
        id: "7a-11",
        name: "Мельник А.",
        progress: 95,
        lastActivity: "21.11, 16:00",
        currentTask: "Фінальне завдання",
        totalTime: "2г 50хв",
        tasksCompleted: 11,
        totalTasks: 12,
        aiRequestsCount: 8,
        offlineSessions: 0,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 40, device: "Windows", city: "Варшава, PL" },
          { date: "18.11", duration: 45, device: "Windows", city: "Варшава, PL" },
          { date: "19.11", duration: 42, device: "Windows", city: "Варшава, PL" },
          { date: "21.11", duration: 38, device: "Windows", city: "Варшава, PL" },
        ],
        avgTimePerTask: 15,
        hintsUsed: 4,
        errorRate: 14,
      },
      {
        id: "7a-12",
        name: "Новак О.",
        progress: 100,
        lastActivity: "21.11, 12:30",
        currentTask: "Завершено",
        totalTime: "2г 30хв",
        tasksCompleted: 12,
        totalTasks: 12,
        aiRequestsCount: 5,
        offlineSessions: 0,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 38, device: "MacOS", city: "Прага, CZ" },
          { date: "18.11", duration: 35, device: "MacOS", city: "Прага, CZ" },
          { date: "19.11", duration: 40, device: "MacOS", city: "Прага, CZ" },
          { date: "21.11", duration: 37, device: "MacOS", city: "Прага, CZ" },
        ],
        avgTimePerTask: 12,
        hintsUsed: 2,
        errorRate: 8,
      },
      // Львів - стабільна локація
      {
        id: "7a-13",
        name: "Олійник В.",
        progress: 88,
        lastActivity: "21.11, 14:20",
        currentTask: "Масиви даних",
        totalTime: "2г 15хв",
        tasksCompleted: 10,
        totalTasks: 12,
        aiRequestsCount: 11,
        offlineSessions: 1,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 42, device: "Windows", city: "м. Львів" },
          { date: "19.11", duration: 48, device: "Windows", city: "м. Львів" },
          { date: "21.11", duration: 45, device: "Windows", city: "м. Львів" },
        ],
        avgTimePerTask: 13,
        hintsUsed: 5,
        errorRate: 18,
      },
      {
        id: "7a-14",
        name: "Петренко С.",
        progress: 100,
        lastActivity: "21.11, 15:45",
        currentTask: "Завершено",
        totalTime: "3г 00хв",
        tasksCompleted: 12,
        totalTasks: 12,
        aiRequestsCount: 6,
        offlineSessions: 4,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 42, device: "Android", city: "м. Шостка" },
          { date: "18.11", duration: 38, device: "Android", city: "м. Шостка" },
          { date: "19.11", duration: 45, device: "Android", city: "м. Шостка" },
          { date: "20.11", duration: 40, device: "Android", city: "м. Шостка" },
          { date: "21.11", duration: 35, device: "Android", city: "м. Шостка" },
        ],
        avgTimePerTask: 15,
        hintsUsed: 3,
        errorRate: 10,
      },
      {
        id: "7a-15",
        name: "Романенко І.",
        progress: 58,
        lastActivity: "19.11, 11:30",
        currentTask: "Основи циклів",
        totalTime: "1г 20хв",
        tasksCompleted: 7,
        totalTasks: 12,
        aiRequestsCount: 22,
        offlineSessions: 3,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 40, device: "Android", city: "смт Вороніж" },
          { date: "19.11", duration: 40, device: "Android", city: "смт Вороніж" },
        ],
        avgTimePerTask: 11,
        hintsUsed: 12,
        errorRate: 35,
      },
      {
        id: "7a-16",
        name: "Сидоренко Т.",
        progress: 100,
        lastActivity: "21.11, 13:00",
        currentTask: "Завершено",
        totalTime: "2г 45хв",
        tasksCompleted: 12,
        totalTasks: 12,
        aiRequestsCount: 7,
        offlineSessions: 2,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 45, device: "iOS", city: "м. Шостка" },
          { date: "18.11", duration: 50, device: "iOS", city: "м. Шостка" },
          { date: "19.11", duration: 35, device: "iOS", city: "м. Шостка" },
          { date: "21.11", duration: 35, device: "iOS", city: "м. Шостка" },
        ],
        avgTimePerTask: 14,
        hintsUsed: 3,
        errorRate: 11,
      },
      {
        id: "7a-17",
        name: "Ткаченко М.",
        progress: 92,
        lastActivity: "21.11, 14:50",
        currentTask: "Останнє завдання",
        totalTime: "2г 55хв",
        tasksCompleted: 11,
        totalTasks: 12,
        aiRequestsCount: 9,
        offlineSessions: 3,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 48, device: "Windows", city: "м. Шостка" },
          { date: "18.11", duration: 42, device: "Windows", city: "м. Шостка" },
          { date: "19.11", duration: 45, device: "Windows", city: "м. Шостка" },
          { date: "21.11", duration: 40, device: "Windows", city: "м. Шостка" },
        ],
        avgTimePerTask: 16,
        hintsUsed: 4,
        errorRate: 13,
      },
      {
        id: "7a-18",
        name: "Усенко Л.",
        progress: 75,
        lastActivity: "20.11, 15:30",
        currentTask: "Умовні конструкції",
        totalTime: "1г 55хв",
        tasksCompleted: 9,
        totalTasks: 12,
        aiRequestsCount: 14,
        offlineSessions: 2,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 55, device: "Android", city: "с. Клишки" },
          { date: "20.11", duration: 60, device: "Android", city: "с. Клишки" },
        ],
        avgTimePerTask: 13,
        hintsUsed: 7,
        errorRate: 24,
      },
      // ВПО - Швейцарія
      {
        id: "7a-19",
        name: "Федоренко К.",
        progress: 100,
        lastActivity: "21.11, 11:00",
        currentTask: "Завершено",
        totalTime: "2г 20хв",
        tasksCompleted: 12,
        totalTasks: 12,
        aiRequestsCount: 4,
        offlineSessions: 0,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 35, device: "MacOS", city: "Цюрих, CH" },
          { date: "18.11", duration: 38, device: "MacOS", city: "Цюрих, CH" },
          { date: "19.11", duration: 32, device: "MacOS", city: "Цюрих, CH" },
          { date: "21.11", duration: 35, device: "MacOS", city: "Цюрих, CH" },
        ],
        avgTimePerTask: 12,
        hintsUsed: 2,
        errorRate: 6,
      },
      {
        id: "7a-20",
        name: "Харченко О.",
        progress: 83,
        lastActivity: "21.11, 13:45",
        currentTask: "Функції",
        totalTime: "2г 10хв",
        tasksCompleted: 10,
        totalTasks: 12,
        aiRequestsCount: 11,
        offlineSessions: 3,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 40, device: "Android", city: "м. Шостка" },
          { date: "18.11", duration: 45, device: "Android", city: "м. Шостка" },
          { date: "19.11", duration: 38, device: "Android", city: "м. Шостка" },
          { date: "21.11", duration: 42, device: "Android", city: "м. Шостка" },
        ],
        avgTimePerTask: 13,
        hintsUsed: 5,
        errorRate: 19,
      },
      {
        id: "7a-21",
        name: "Цимбал В.",
        progress: 100,
        lastActivity: "21.11, 15:00",
        currentTask: "Завершено",
        totalTime: "2г 35хв",
        tasksCompleted: 12,
        totalTasks: 12,
        aiRequestsCount: 6,
        offlineSessions: 4,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 38, device: "Windows", city: "м. Шостка" },
          { date: "18.11", duration: 35, device: "Windows", city: "м. Шостка" },
          { date: "19.11", duration: 42, device: "Windows", city: "м. Шостка" },
          { date: "20.11", duration: 35, device: "Windows", city: "м. Шостка" },
          { date: "21.11", duration: 30, device: "Windows", city: "м. Шостка" },
        ],
        avgTimePerTask: 13,
        hintsUsed: 3,
        errorRate: 9,
      },
      {
        id: "7a-22",
        name: "Шевченко Н.",
        progress: 67,
        lastActivity: "19.11, 16:20",
        currentTask: "Масиви",
        totalTime: "1г 40хв",
        tasksCompleted: 8,
        totalTasks: 12,
        aiRequestsCount: 16,
        offlineSessions: 2,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 50, device: "Android", city: "смт Ямпіль" },
          { date: "19.11", duration: 50, device: "Android", city: "смт Ямпіль" },
        ],
        avgTimePerTask: 12,
        hintsUsed: 8,
        errorRate: 28,
      },
      // Суми - ВПО з Шостки
      {
        id: "7a-23",
        name: "Щербак А.",
        progress: 92,
        lastActivity: "21.11, 14:10",
        currentTask: "Фінальний тест",
        totalTime: "2г 40хв",
        tasksCompleted: 11,
        totalTasks: 12,
        aiRequestsCount: 8,
        offlineSessions: 1,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 42, device: "Windows", city: "м. Суми" },
          { date: "18.11", duration: 45, device: "Windows", city: "м. Суми" },
          { date: "19.11", duration: 40, device: "Windows", city: "м. Суми" },
          { date: "21.11", duration: 38, device: "Windows", city: "м. Суми" },
        ],
        avgTimePerTask: 15,
        hintsUsed: 4,
        errorRate: 14,
      },
      {
        id: "7a-24",
        name: "Юрченко Д.",
        progress: 100,
        lastActivity: "21.11, 12:45",
        currentTask: "Завершено",
        totalTime: "2г 25хв",
        tasksCompleted: 12,
        totalTasks: 12,
        aiRequestsCount: 5,
        offlineSessions: 3,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 35, device: "Android", city: "м. Шостка" },
          { date: "18.11", duration: 38, device: "Android", city: "м. Шостка" },
          { date: "19.11", duration: 40, device: "Android", city: "м. Шостка" },
          { date: "21.11", duration: 32, device: "Android", city: "м. Шостка" },
        ],
        avgTimePerTask: 12,
        hintsUsed: 2,
        errorRate: 8,
      },
      {
        id: "7a-25",
        name: "Яковенко І.",
        progress: 50,
        lastActivity: "18.11, 14:00",
        currentTask: "Базові конструкції",
        totalTime: "1г 10хв",
        tasksCompleted: 6,
        totalTasks: 12,
        aiRequestsCount: 25,
        offlineSessions: 1,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 35, device: "Android", city: "с. Собич" },
          { date: "18.11", duration: 35, device: "Android", city: "с. Собич" },
        ],
        avgTimePerTask: 12,
        hintsUsed: 14,
        errorRate: 38,
      },
      // Львів
      {
        id: "7a-26",
        name: "Андрущенко М.",
        progress: 85,
        lastActivity: "21.11, 13:30",
        currentTask: "Рекурсія",
        totalTime: "2г 05хв",
        tasksCompleted: 10,
        totalTasks: 12,
        aiRequestsCount: 10,
        offlineSessions: 1,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 38, device: "Windows", city: "м. Львів" },
          { date: "19.11", duration: 42, device: "Windows", city: "м. Львів" },
          { date: "21.11", duration: 45, device: "Windows", city: "м. Львів" },
        ],
        avgTimePerTask: 12,
        hintsUsed: 5,
        errorRate: 16,
      },
      {
        id: "7a-27",
        name: "Білоус К.",
        progress: 100,
        lastActivity: "21.11, 15:30",
        currentTask: "Завершено",
        totalTime: "2г 50хв",
        tasksCompleted: 12,
        totalTasks: 12,
        aiRequestsCount: 7,
        offlineSessions: 4,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 42, device: "Android", city: "м. Шостка" },
          { date: "18.11", duration: 40, device: "Android", city: "м. Шостка" },
          { date: "19.11", duration: 38, device: "Android", city: "м. Шостка" },
          { date: "20.11", duration: 45, device: "Android", city: "м. Шостка" },
          { date: "21.11", duration: 35, device: "Android", city: "м. Шостка" },
        ],
        avgTimePerTask: 14,
        hintsUsed: 3,
        errorRate: 10,
      },
      {
        id: "7a-28",
        name: "Войтенко Р.",
        progress: 75,
        lastActivity: "20.11, 16:00",
        currentTask: "Цикли while",
        totalTime: "1г 50хв",
        tasksCompleted: 9,
        totalTasks: 12,
        aiRequestsCount: 13,
        offlineSessions: 2,
        className: "7-А",
        sessions: [
          { date: "17.11", duration: 55, device: "Android", city: "смт Вороніж" },
          { date: "20.11", duration: 55, device: "Android", city: "смт Вороніж" },
        ],
        avgTimePerTask: 12,
        hintsUsed: 6,
        errorRate: 22,
      },
    ],
  },
  {
    id: "10a",
    name: "10-А (Інформатика)",
    topic: "Python: основи програмування",
    totalStudents: 28,
    activeStudents: 26,
    avgScore: 8.7,
    avgProgress: 82,
    students: [
      {
        id: "10a-01",
        name: "Авраменко М.",
        progress: 89,
        lastActivity: "21.11, 14:30",
        currentTask: "Функції Python",
        totalTime: "4г 15хв",
        tasksCompleted: 8,
        totalTasks: 9,
        aiRequestsCount: 12,
        offlineSessions: 3,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 55, device: "Windows", city: "м. Суми" },
          { date: "18.11", duration: 60, device: "Windows", city: "м. Суми" },
          { date: "21.11", duration: 140, device: "Windows", city: "м. Суми" },
        ],
        avgTimePerTask: 28,
        hintsUsed: 6,
        errorRate: 18,
      },
      {
        id: "10a-02",
        name: "Білоус О.",
        progress: 100,
        lastActivity: "21.11, 15:10",
        currentTask: "Завершено",
        totalTime: "4г 40хв",
        tasksCompleted: 9,
        totalTasks: 9,
        aiRequestsCount: 8,
        offlineSessions: 4,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 50, device: "Android", city: "м. Шостка" },
          { date: "18.11", duration: 55, device: "Android", city: "м. Шостка" },
          { date: "19.11", duration: 60, device: "Android", city: "м. Шостка" },
          { date: "21.11", duration: 115, device: "Android", city: "м. Шостка" },
        ],
        avgTimePerTask: 31,
        hintsUsed: 4,
        errorRate: 12,
      },
      {
        id: "10a-03",
        name: "Войтенко С.",
        progress: 78,
        lastActivity: "20.11, 16:45",
        currentTask: "Списки та кортежі",
        totalTime: "3г 50хв",
        tasksCompleted: 7,
        totalTasks: 9,
        aiRequestsCount: 18,
        offlineSessions: 2,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 65, device: "Windows", city: "м. Шостка" },
          { date: "18.11", duration: 70, device: "Windows", city: "м. Шостка" },
          { date: "20.11", duration: 95, device: "Windows", city: "м. Шостка" },
        ],
        avgTimePerTask: 33,
        hintsUsed: 9,
        errorRate: 24,
      },
      {
        id: "10a-04",
        name: "Герасименко Н.",
        progress: 100,
        lastActivity: "21.11, 14:50",
        currentTask: "Завершено",
        totalTime: "4г 25хв",
        tasksCompleted: 9,
        totalTasks: 9,
        aiRequestsCount: 7,
        offlineSessions: 4,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 52, device: "Android", city: "м. Суми" },
          { date: "18.11", duration: 58, device: "Android", city: "м. Суми" },
          { date: "19.11", duration: 55, device: "Android", city: "м. Суми" },
          { date: "21.11", duration: 100, device: "Android", city: "м. Суми" },
        ],
        avgTimePerTask: 29,
        hintsUsed: 3,
        errorRate: 10,
      },
      {
        id: "10a-05",
        name: "Денисенко В.",
        progress: 67,
        lastActivity: "19.11, 15:30",
        currentTask: "Цикли for/while",
        totalTime: "3г 20хв",
        tasksCompleted: 6,
        totalTasks: 9,
        aiRequestsCount: 22,
        offlineSessions: 1,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 75, device: "Android", city: "м. Ромни" },
          { date: "19.11", duration: 125, device: "Android", city: "м. Ромни" },
        ],
        avgTimePerTask: 33,
        hintsUsed: 11,
        errorRate: 30,
      },
      {
        id: "10a-06",
        name: "Єфименко І.",
        progress: 89,
        lastActivity: "21.11, 13:45",
        currentTask: "Словники",
        totalTime: "4г 10хв",
        tasksCompleted: 8,
        totalTasks: 9,
        aiRequestsCount: 10,
        offlineSessions: 3,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 55, device: "iOS", city: "м. Суми" },
          { date: "18.11", duration: 60, device: "iOS", city: "м. Суми" },
          { date: "21.11", duration: 135, device: "iOS", city: "м. Суми" },
        ],
        avgTimePerTask: 28,
        hintsUsed: 5,
        errorRate: 16,
      },
      {
        id: "10a-07",
        name: "Жуков А.",
        progress: 100,
        lastActivity: "21.11, 15:20",
        currentTask: "Завершено",
        totalTime: "4г 35хв",
        tasksCompleted: 9,
        totalTasks: 9,
        aiRequestsCount: 6,
        offlineSessions: 5,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 48, device: "Windows", city: "м. Суми" },
          { date: "18.11", duration: 52, device: "Windows", city: "м. Суми" },
          { date: "19.11", duration: 55, device: "Windows", city: "м. Суми" },
          { date: "20.11", duration: 60, device: "Windows", city: "м. Суми" },
          { date: "21.11", duration: 60, device: "Windows", city: "м. Суми" },
        ],
        avgTimePerTask: 30,
        hintsUsed: 3,
        errorRate: 8,
      },
      {
        id: "10a-08",
        name: "Зайцев П.",
        progress: 78,
        lastActivity: "20.11, 14:20",
        currentTask: "Умовні оператори",
        totalTime: "3г 45хв",
        tasksCompleted: 7,
        totalTasks: 9,
        aiRequestsCount: 15,
        offlineSessions: 2,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 70, device: "Android", city: "м. Шостка" },
          { date: "18.11", duration: 65, device: "Android", city: "м. Шостка" },
          { date: "20.11", duration: 90, device: "Android", city: "м. Шостка" },
        ],
        avgTimePerTask: 32,
        hintsUsed: 7,
        errorRate: 22,
      },
      {
        id: "10a-09",
        name: "Ільченко Д.",
        progress: 100,
        lastActivity: "21.11, 14:15",
        currentTask: "Завершено",
        totalTime: "4г 20хв",
        tasksCompleted: 9,
        totalTasks: 9,
        aiRequestsCount: 9,
        offlineSessions: 4,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 52, device: "Android", city: "м. Суми" },
          { date: "18.11", duration: 58, device: "Android", city: "м. Суми" },
          { date: "19.11", duration: 55, device: "Android", city: "м. Суми" },
          { date: "21.11", duration: 95, device: "Android", city: "м. Суми" },
        ],
        avgTimePerTask: 29,
        hintsUsed: 4,
        errorRate: 11,
      },
      {
        id: "10a-10",
        name: "Калініченко О.",
        progress: 56,
        lastActivity: "18.11, 16:00",
        currentTask: "Змінні та типи",
        totalTime: "2г 50хв",
        tasksCompleted: 5,
        totalTasks: 9,
        aiRequestsCount: 25,
        offlineSessions: 1,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 85, device: "Android", city: "м. Охтирка" },
          { date: "18.11", duration: 85, device: "Android", city: "м. Охтирка" },
        ],
        avgTimePerTask: 34,
        hintsUsed: 13,
        errorRate: 38,
      },
      {
        id: "10a-11",
        name: "Лисенко Р.",
        progress: 89,
        lastActivity: "21.11, 13:55",
        currentTask: "ООП основи",
        totalTime: "4г 05хв",
        tasksCompleted: 8,
        totalTasks: 9,
        aiRequestsCount: 11,
        offlineSessions: 3,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 58, device: "Windows", city: "м. Суми" },
          { date: "18.11", duration: 62, device: "Windows", city: "м. Суми" },
          { date: "21.11", duration: 125, device: "Windows", city: "м. Суми" },
        ],
        avgTimePerTask: 27,
        hintsUsed: 5,
        errorRate: 15,
      },
      {
        id: "10a-12",
        name: "Мартиненко К.",
        progress: 100,
        lastActivity: "21.11, 15:00",
        currentTask: "Завершено",
        totalTime: "4г 30хв",
        tasksCompleted: 9,
        totalTasks: 9,
        aiRequestsCount: 5,
        offlineSessions: 4,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 50, device: "Android", city: "м. Конотоп" },
          { date: "18.11", duration: 55, device: "Android", city: "м. Конотоп" },
          { date: "19.11", duration: 58, device: "Android", city: "м. Конотоп" },
          { date: "21.11", duration: 107, device: "Android", city: "м. Конотоп" },
        ],
        avgTimePerTask: 30,
        hintsUsed: 2,
        errorRate: 7,
      },
      {
        id: "10a-13",
        name: "Нестеренко Т.",
        progress: 78,
        lastActivity: "20.11, 15:40",
        currentTask: "Рядки",
        totalTime: "3г 40хв",
        tasksCompleted: 7,
        totalTasks: 9,
        aiRequestsCount: 14,
        offlineSessions: 2,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 68, device: "iOS", city: "м. Суми" },
          { date: "18.11", duration: 72, device: "iOS", city: "м. Суми" },
          { date: "20.11", duration: 80, device: "iOS", city: "м. Суми" },
        ],
        avgTimePerTask: 31,
        hintsUsed: 7,
        errorRate: 20,
      },
      {
        id: "10a-14",
        name: "Остапенко М.",
        progress: 100,
        lastActivity: "21.11, 14:40",
        currentTask: "Завершено",
        totalTime: "4г 25хв",
        tasksCompleted: 9,
        totalTasks: 9,
        aiRequestsCount: 8,
        offlineSessions: 4,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 52, device: "Android", city: "м. Суми" },
          { date: "18.11", duration: 58, device: "Android", city: "м. Суми" },
          { date: "19.11", duration: 55, device: "Android", city: "м. Суми" },
          { date: "21.11", duration: 100, device: "Android", city: "м. Суми" },
        ],
        avgTimePerTask: 29,
        hintsUsed: 4,
        errorRate: 12,
      },
      {
        id: "10a-15",
        name: "Павленко С.",
        progress: 89,
        lastActivity: "21.11, 13:30",
        currentTask: "Файли",
        totalTime: "4г 00хв",
        tasksCompleted: 8,
        totalTasks: 9,
        aiRequestsCount: 13,
        offlineSessions: 3,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 55, device: "Windows", city: "м. Ромни" },
          { date: "18.11", duration: 60, device: "Windows", city: "м. Ромни" },
          { date: "21.11", duration: 125, device: "Windows", city: "м. Ромни" },
        ],
        avgTimePerTask: 30,
        hintsUsed: 6,
        errorRate: 17,
      },
      {
        id: "10a-16",
        name: "Радченко В.",
        progress: 100,
        lastActivity: "21.11, 15:15",
        currentTask: "Завершено",
        totalTime: "4г 45хв",
        tasksCompleted: 9,
        totalTasks: 9,
        aiRequestsCount: 6,
        offlineSessions: 5,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 48, device: "Android", city: "м. Суми" },
          { date: "18.11", duration: 52, device: "Android", city: "м. Суми" },
          { date: "19.11", duration: 58, device: "Android", city: "м. Суми" },
          { date: "20.11", duration: 62, device: "Android", city: "м. Суми" },
          { date: "21.11", duration: 65, device: "Android", city: "м. Суми" },
        ],
        avgTimePerTask: 32,
        hintsUsed: 3,
        errorRate: 9,
      },
      {
        id: "10a-17",
        name: "Сидоренко І.",
        progress: 67,
        lastActivity: "19.11, 14:50",
        currentTask: "Операції",
        totalTime: "3г 15хв",
        tasksCompleted: 6,
        totalTasks: 9,
        aiRequestsCount: 20,
        offlineSessions: 1,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 80, device: "Android", city: "м. Шостка" },
          { date: "19.11", duration: 115, device: "Android", city: "м. Шостка" },
        ],
        avgTimePerTask: 32,
        hintsUsed: 10,
        errorRate: 28,
      },
      {
        id: "10a-18",
        name: "Тимошенко О.",
        progress: 100,
        lastActivity: "21.11, 14:25",
        currentTask: "Завершено",
        totalTime: "4г 20хв",
        tasksCompleted: 9,
        totalTasks: 9,
        aiRequestsCount: 7,
        offlineSessions: 4,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 55, device: "iOS", city: "м. Суми" },
          { date: "18.11", duration: 58, device: "iOS", city: "м. Суми" },
          { date: "19.11", duration: 52, device: "iOS", city: "м. Суми" },
          { date: "21.11", duration: 95, device: "iOS", city: "м. Суми" },
        ],
        avgTimePerTask: 29,
        hintsUsed: 3,
        errorRate: 10,
      },
      {
        id: "10a-19",
        name: "Ульянченко Д.",
        progress: 78,
        lastActivity: "20.11, 13:15",
        currentTask: "Модулі",
        totalTime: "3г 35хв",
        tasksCompleted: 7,
        totalTasks: 9,
        aiRequestsCount: 16,
        offlineSessions: 2,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 72, device: "Android", city: "м. Суми" },
          { date: "18.11", duration: 68, device: "Android", city: "м. Суми" },
          { date: "20.11", duration: 75, device: "Android", city: "м. Суми" },
        ],
        avgTimePerTask: 31,
        hintsUsed: 8,
        errorRate: 23,
      },
      {
        id: "10a-20",
        name: "Філіпенко Н.",
        progress: 100,
        lastActivity: "21.11, 15:05",
        currentTask: "Завершено",
        totalTime: "4г 30хв",
        tasksCompleted: 9,
        totalTasks: 9,
        aiRequestsCount: 9,
        offlineSessions: 4,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 50, device: "Windows", city: "м. Охтирка" },
          { date: "18.11", duration: 55, device: "Windows", city: "м. Охтирка" },
          { date: "19.11", duration: 60, device: "Windows", city: "м. Охтирка" },
          { date: "21.11", duration: 105, device: "Windows", city: "м. Охтирка" },
        ],
        avgTimePerTask: 30,
        hintsUsed: 4,
        errorRate: 11,
      },
      {
        id: "10a-21",
        name: "Хоменко Р.",
        progress: 89,
        lastActivity: "21.11, 14:00",
        currentTask: "Винятки",
        totalTime: "4г 10хв",
        tasksCompleted: 8,
        totalTasks: 9,
        aiRequestsCount: 12,
        offlineSessions: 3,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 58, device: "Android", city: "м. Суми" },
          { date: "18.11", duration: 62, device: "Android", city: "м. Суми" },
          { date: "21.11", duration: 130, device: "Android", city: "м. Суми" },
        ],
        avgTimePerTask: 28,
        hintsUsed: 6,
        errorRate: 14,
      },
      {
        id: "10a-22",
        name: "Циганенко К.",
        progress: 100,
        lastActivity: "21.11, 14:45",
        currentTask: "Завершено",
        totalTime: "4г 35хв",
        tasksCompleted: 9,
        totalTasks: 9,
        aiRequestsCount: 5,
        offlineSessions: 5,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 52, device: "iOS", city: "м. Конотоп" },
          { date: "18.11", duration: 55, device: "iOS", city: "м. Конотоп" },
          { date: "19.11", duration: 58, device: "iOS", city: "м. Конотоп" },
          { date: "20.11", duration: 55, device: "iOS", city: "м. Конотоп" },
          { date: "21.11", duration: 55, device: "iOS", city: "м. Конотоп" },
        ],
        avgTimePerTask: 30,
        hintsUsed: 2,
        errorRate: 6,
      },
      {
        id: "10a-23",
        name: "Шаповал М.",
        progress: 56,
        lastActivity: "18.11, 14:30",
        currentTask: "Основи синтаксису",
        totalTime: "2г 40хв",
        tasksCompleted: 5,
        totalTasks: 9,
        aiRequestsCount: 28,
        offlineSessions: 1,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 90, device: "Android", city: "м. Суми" },
          { date: "18.11", duration: 70, device: "Android", city: "м. Суми" },
        ],
        avgTimePerTask: 32,
        hintsUsed: 14,
        errorRate: 42,
      },
      {
        id: "10a-24",
        name: "Щербаков О.",
        progress: 89,
        lastActivity: "21.11, 13:40",
        currentTask: "Колекції",
        totalTime: "4г 05хв",
        tasksCompleted: 8,
        totalTasks: 9,
        aiRequestsCount: 10,
        offlineSessions: 3,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 60, device: "Windows", city: "м. Суми" },
          { date: "18.11", duration: 65, device: "Windows", city: "м. Суми" },
          { date: "21.11", duration: 120, device: "Windows", city: "м. Суми" },
        ],
        avgTimePerTask: 27,
        hintsUsed: 5,
        errorRate: 13,
      },
      {
        id: "10a-25",
        name: "Юрченко Т.",
        progress: 100,
        lastActivity: "21.11, 15:10",
        currentTask: "Завершено",
        totalTime: "4г 25хв",
        tasksCompleted: 9,
        totalTasks: 9,
        aiRequestsCount: 7,
        offlineSessions: 4,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 52, device: "Android", city: "м. Ромни" },
          { date: "18.11", duration: 58, device: "Android", city: "м. Ромни" },
          { date: "19.11", duration: 55, device: "Android", city: "м. Ромни" },
          { date: "21.11", duration: 100, device: "Android", city: "м. Ромни" },
        ],
        avgTimePerTask: 29,
        hintsUsed: 3,
        errorRate: 9,
      },
      {
        id: "10a-26",
        name: "Яременко С.",
        progress: 78,
        lastActivity: "20.11, 15:00",
        currentTask: "Введення/виведення",
        totalTime: "3г 30хв",
        tasksCompleted: 7,
        totalTasks: 9,
        aiRequestsCount: 17,
        offlineSessions: 2,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 70, device: "Android", city: "м. Суми" },
          { date: "18.11", duration: 65, device: "Android", city: "м. Суми" },
          { date: "20.11", duration: 75, device: "Android", city: "м. Суми" },
        ],
        avgTimePerTask: 30,
        hintsUsed: 8,
        errorRate: 21,
      },
      {
        id: "10a-27",
        name: "Антонюк В.",
        progress: 100,
        lastActivity: "21.11, 14:35",
        currentTask: "Завершено",
        totalTime: "4г 40хв",
        tasksCompleted: 9,
        totalTasks: 9,
        aiRequestsCount: 6,
        offlineSessions: 4,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 55, device: "iOS", city: "м. Шостка" },
          { date: "18.11", duration: 58, device: "iOS", city: "м. Шостка" },
          { date: "19.11", duration: 60, device: "iOS", city: "м. Шостка" },
          { date: "21.11", duration: 107, device: "iOS", city: "м. Шостка" },
        ],
        avgTimePerTask: 31,
        hintsUsed: 3,
        errorRate: 8,
      },
      {
        id: "10a-28",
        name: "Барабаш І.",
        progress: 89,
        lastActivity: "21.11, 13:50",
        currentTask: "Регулярні вирази",
        totalTime: "4г 00хв",
        tasksCompleted: 8,
        totalTasks: 9,
        aiRequestsCount: 14,
        offlineSessions: 3,
        className: "10-А",
        sessions: [
          { date: "17.11", duration: 58, device: "Windows", city: "м. Суми" },
          { date: "18.11", duration: 62, device: "Windows", city: "м. Суми" },
          { date: "21.11", duration: 120, device: "Windows", city: "м. Суми" },
        ],
        avgTimePerTask: 30,
        hintsUsed: 7,
        errorRate: 16,
      },
    ],
  },
  {
    id: "11b",
    name: "11-Б (Стандарт)",
    topic: "HTML/CSS: веб-розробка",
    totalStudents: 26,
    activeStudents: 24,
    avgScore: 10.1,
    avgProgress: 100,
    students: [
      {
        id: "11b-01",
        name: "Абрамов О.",
        progress: 100,
        lastActivity: "21.11, 14:20",
        currentTask: "Завершено",
        totalTime: "3г 45хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 5,
        offlineSessions: 4,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 48, device: "Android", city: "м. Суми" },
          { date: "18.11", duration: 52, device: "Android", city: "м. Суми" },
          { date: "19.11", duration: 55, device: "Android", city: "м. Суми" },
          { date: "21.11", duration: 70, device: "Android", city: "м. Суми" },
        ],
        avgTimePerTask: 28,
        hintsUsed: 2,
        errorRate: 8,
      },
      {
        id: "11b-02",
        name: "Бережний К.",
        progress: 100,
        lastActivity: "21.11, 15:00",
        currentTask: "Завершено",
        totalTime: "3г 50хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 6,
        offlineSessions: 4,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 50, device: "iOS", city: "м. Охтирка" },
          { date: "18.11", duration: 55, device: "iOS", city: "м. Охтирка" },
          { date: "19.11", duration: 52, device: "iOS", city: "м. Охтирка" },
          { date: "21.11", duration: 73, device: "iOS", city: "м. Охтирка" },
        ],
        avgTimePerTask: 29,
        hintsUsed: 3,
        errorRate: 10,
      },
      {
        id: "11b-03",
        name: "Власенко Т.",
        progress: 100,
        lastActivity: "21.11, 14:40",
        currentTask: "Завершено",
        totalTime: "3г 35хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 4,
        offlineSessions: 5,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 42, device: "Windows", city: "м. Суми" },
          { date: "18.11", duration: 45, device: "Windows", city: "м. Суми" },
          { date: "19.11", duration: 48, device: "Windows", city: "м. Суми" },
          { date: "20.11", duration: 40, device: "Windows", city: "м. Суми" },
          { date: "21.11", duration: 40, device: "Windows", city: "м. Суми" },
        ],
        avgTimePerTask: 27,
        hintsUsed: 2,
        errorRate: 6,
      },
      {
        id: "11b-04",
        name: "Гладченко Р.",
        progress: 100,
        lastActivity: "21.11, 13:55",
        currentTask: "Завершено",
        totalTime: "3г 40хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 7,
        offlineSessions: 3,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 55, device: "Android", city: "м. Конотоп" },
          { date: "18.11", duration: 58, device: "Android", city: "м. Конотоп" },
          { date: "21.11", duration: 107, device: "Android", city: "м. Конотоп" },
        ],
        avgTimePerTask: 27,
        hintsUsed: 3,
        errorRate: 9,
      },
      {
        id: "11b-05",
        name: "Данилюк М.",
        progress: 100,
        lastActivity: "21.11, 14:50",
        currentTask: "Завершено",
        totalTime: "3г 55хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 5,
        offlineSessions: 4,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 48, device: "Android", city: "м. Суми" },
          { date: "18.11", duration: 52, device: "Android", city: "м. Суми" },
          { date: "19.11", duration: 55, device: "Android", city: "м. Суми" },
          { date: "21.11", duration: 80, device: "Android", city: "м. Суми" },
        ],
        avgTimePerTask: 30,
        hintsUsed: 2,
        errorRate: 7,
      },
      {
        id: "11b-06",
        name: "Євдокименко С.",
        progress: 100,
        lastActivity: "21.11, 15:10",
        currentTask: "Завершено",
        totalTime: "3г 30хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 3,
        offlineSessions: 5,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 40, device: "iOS", city: "м. Суми" },
          { date: "18.11", duration: 42, device: "iOS", city: "м. Суми" },
          { date: "19.11", duration: 45, device: "iOS", city: "м. Суми" },
          { date: "20.11", duration: 43, device: "iOS", city: "м. Суми" },
          { date: "21.11", duration: 40, device: "iOS", city: "м. Суми" },
        ],
        avgTimePerTask: 26,
        hintsUsed: 1,
        errorRate: 5,
      },
      {
        id: "11b-07",
        name: "Жилін О.",
        progress: 100,
        lastActivity: "21.11, 14:30",
        currentTask: "Завершено",
        totalTime: "3г 45хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 6,
        offlineSessions: 4,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 50, device: "Android", city: "м. Ромни" },
          { date: "18.11", duration: 52, device: "Android", city: "м. Ромни" },
          { date: "19.11", duration: 55, device: "Android", city: "м. Ромни" },
          { date: "21.11", duration: 68, device: "Android", city: "м. Ромни" },
        ],
        avgTimePerTask: 28,
        hintsUsed: 3,
        errorRate: 8,
      },
      {
        id: "11b-08",
        name: "Зубко В.",
        progress: 100,
        lastActivity: "21.11, 13:45",
        currentTask: "Завершено",
        totalTime: "3г 35хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 8,
        offlineSessions: 3,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 55, device: "Windows", city: "м. Шостка" },
          { date: "18.11", duration: 58, device: "Windows", city: "м. Шостка" },
          { date: "21.11", duration: 102, device: "Windows", city: "м. Шостка" },
        ],
        avgTimePerTask: 27,
        hintsUsed: 4,
        errorRate: 11,
      },
      {
        id: "11b-09",
        name: "Іващенко Н.",
        progress: 100,
        lastActivity: "21.11, 15:05",
        currentTask: "Завершено",
        totalTime: "3г 50хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 4,
        offlineSessions: 4,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 48, device: "Android", city: "м. Суми" },
          { date: "18.11", duration: 50, device: "Android", city: "м. Суми" },
          { date: "19.11", duration: 55, device: "Android", city: "м. Суми" },
          { date: "21.11", duration: 77, device: "Android", city: "м. Суми" },
        ],
        avgTimePerTask: 29,
        hintsUsed: 2,
        errorRate: 6,
      },
      {
        id: "11b-10",
        name: "Козаченко Д.",
        progress: 100,
        lastActivity: "21.11, 14:25",
        currentTask: "Завершено",
        totalTime: "3г 40хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 5,
        offlineSessions: 4,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 45, device: "iOS", city: "м. Суми" },
          { date: "18.11", duration: 48, device: "iOS", city: "м. Суми" },
          { date: "19.11", duration: 52, device: "iOS", city: "м. Суми" },
          { date: "21.11", duration: 75, device: "iOS", city: "м. Суми" },
        ],
        avgTimePerTask: 27,
        hintsUsed: 2,
        errorRate: 7,
      },
      {
        id: "11b-11",
        name: "Лебеденко І.",
        progress: 100,
        lastActivity: "21.11, 14:55",
        currentTask: "Завершено",
        totalTime: "3г 55хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 6,
        offlineSessions: 4,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 50, device: "Android", city: "м. Охтирка" },
          { date: "18.11", duration: 55, device: "Android", city: "м. Охтирка" },
          { date: "19.11", duration: 52, device: "Android", city: "м. Охтирка" },
          { date: "21.11", duration: 78, device: "Android", city: "м. Охтирка" },
        ],
        avgTimePerTask: 30,
        hintsUsed: 3,
        errorRate: 8,
      },
      {
        id: "11b-12",
        name: "Михайленко П.",
        progress: 100,
        lastActivity: "21.11, 13:50",
        currentTask: "Завершено",
        totalTime: "3г 30хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 4,
        offlineSessions: 5,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 42, device: "Windows", city: "м. Суми" },
          { date: "18.11", duration: 45, device: "Windows", city: "м. Суми" },
          { date: "19.11", duration: 43, device: "Windows", city: "м. Суми" },
          { date: "20.11", duration: 40, device: "Windows", city: "м. Суми" },
          { date: "21.11", duration: 40, device: "Windows", city: "м. Суми" },
        ],
        avgTimePerTask: 26,
        hintsUsed: 2,
        errorRate: 5,
      },
      {
        id: "11b-13",
        name: "Ніколенко Т.",
        progress: 100,
        lastActivity: "21.11, 14:45",
        currentTask: "Завершено",
        totalTime: "3г 45хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 7,
        offlineSessions: 3,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 55, device: "Android", city: "м. Конотоп" },
          { date: "18.11", duration: 60, device: "Android", city: "м. Конотоп" },
          { date: "21.11", duration: 110, device: "Android", city: "м. Конотоп" },
        ],
        avgTimePerTask: 28,
        hintsUsed: 3,
        errorRate: 9,
      },
      {
        id: "11b-14",
        name: "Опанасенко М.",
        progress: 100,
        lastActivity: "21.11, 15:15",
        currentTask: "Завершено",
        totalTime: "3г 35хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 3,
        offlineSessions: 5,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 40, device: "iOS", city: "м. Суми" },
          { date: "18.11", duration: 42, device: "iOS", city: "м. Суми" },
          { date: "19.11", duration: 45, device: "iOS", city: "м. Суми" },
          { date: "20.11", duration: 43, device: "iOS", city: "м. Суми" },
          { date: "21.11", duration: 45, device: "iOS", city: "м. Суми" },
        ],
        avgTimePerTask: 27,
        hintsUsed: 1,
        errorRate: 4,
      },
      {
        id: "11b-15",
        name: "Пилипенко С.",
        progress: 100,
        lastActivity: "21.11, 14:35",
        currentTask: "Завершено",
        totalTime: "3г 50хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 5,
        offlineSessions: 4,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 48, device: "Android", city: "м. Ромни" },
          { date: "18.11", duration: 52, device: "Android", city: "м. Ромни" },
          { date: "19.11", duration: 55, device: "Android", city: "м. Ромни" },
          { date: "21.11", duration: 75, device: "Android", city: "м. Ромни" },
        ],
        avgTimePerTask: 29,
        hintsUsed: 2,
        errorRate: 7,
      },
      {
        id: "11b-16",
        name: "Романюк В.",
        progress: 100,
        lastActivity: "21.11, 14:10",
        currentTask: "Завершено",
        totalTime: "3г 40хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 6,
        offlineSessions: 4,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 50, device: "Windows", city: "м. Суми" },
          { date: "18.11", duration: 52, device: "Windows", city: "м. Суми" },
          { date: "19.11", duration: 55, device: "Windows", city: "м. Суми" },
          { date: "21.11", duration: 63, device: "Windows", city: "м. Суми" },
        ],
        avgTimePerTask: 28,
        hintsUsed: 3,
        errorRate: 8,
      },
      {
        id: "11b-17",
        name: "Степанюк О.",
        progress: 100,
        lastActivity: "21.11, 13:40",
        currentTask: "Завершено",
        totalTime: "3г 30хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 4,
        offlineSessions: 5,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 42, device: "Android", city: "м. Шостка" },
          { date: "18.11", duration: 45, device: "Android", city: "м. Шостка" },
          { date: "19.11", duration: 43, device: "Android", city: "м. Шостка" },
          { date: "20.11", duration: 40, device: "Android", city: "м. Шостка" },
          { date: "21.11", duration: 40, device: "Android", city: "м. Шостка" },
        ],
        avgTimePerTask: 26,
        hintsUsed: 2,
        errorRate: 6,
      },
      {
        id: "11b-18",
        name: "Терещенко Д.",
        progress: 88,
        lastActivity: "20.11, 16:30",
        currentTask: "Flexbox",
        totalTime: "3г 20хв",
        tasksCompleted: 7,
        totalTasks: 8,
        aiRequestsCount: 12,
        offlineSessions: 2,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 65, device: "iOS", city: "м. Суми" },
          { date: "18.11", duration: 70, device: "iOS", city: "м. Суми" },
          { date: "20.11", duration: 65, device: "iOS", city: "м. Суми" },
        ],
        avgTimePerTask: 29,
        hintsUsed: 6,
        errorRate: 15,
      },
      {
        id: "11b-19",
        name: "Ущенко Р.",
        progress: 100,
        lastActivity: "21.11, 15:00",
        currentTask: "Завершено",
        totalTime: "3г 45хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 5,
        offlineSessions: 4,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 48, device: "Android", city: "м. Суми" },
          { date: "18.11", duration: 50, device: "Android", city: "м. Суми" },
          { date: "19.11", duration: 55, device: "Android", city: "м. Суми" },
          { date: "21.11", duration: 72, device: "Android", city: "м. Суми" },
        ],
        avgTimePerTask: 28,
        hintsUsed: 2,
        errorRate: 7,
      },
      {
        id: "11b-20",
        name: "Федорчук І.",
        progress: 100,
        lastActivity: "21.11, 14:15",
        currentTask: "Завершено",
        totalTime: "3г 35хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 4,
        offlineSessions: 4,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 45, device: "Windows", city: "м. Охтирка" },
          { date: "18.11", duration: 48, device: "Windows", city: "м. Охтирка" },
          { date: "19.11", duration: 50, device: "Windows", city: "м. Охтирка" },
          { date: "21.11", duration: 72, device: "Windows", city: "м. Охтирка" },
        ],
        avgTimePerTask: 27,
        hintsUsed: 2,
        errorRate: 6,
      },
      {
        id: "11b-21",
        name: "Христенко Н.",
        progress: 75,
        lastActivity: "19.11, 15:20",
        currentTask: "CSS Grid",
        totalTime: "2г 50хв",
        tasksCompleted: 6,
        totalTasks: 8,
        aiRequestsCount: 18,
        offlineSessions: 1,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 75, device: "Android", city: "м. Конотоп" },
          { date: "19.11", duration: 95, device: "Android", city: "м. Конотоп" },
        ],
        avgTimePerTask: 28,
        hintsUsed: 9,
        errorRate: 22,
      },
      {
        id: "11b-22",
        name: "Циба О.",
        progress: 100,
        lastActivity: "21.11, 14:40",
        currentTask: "Завершено",
        totalTime: "3г 50хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 6,
        offlineSessions: 4,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 50, device: "iOS", city: "м. Суми" },
          { date: "18.11", duration: 55, device: "iOS", city: "м. Суми" },
          { date: "19.11", duration: 52, device: "iOS", city: "м. Суми" },
          { date: "21.11", duration: 73, device: "iOS", city: "м. Суми" },
        ],
        avgTimePerTask: 29,
        hintsUsed: 3,
        errorRate: 8,
      },
      {
        id: "11b-23",
        name: "Шульга М.",
        progress: 100,
        lastActivity: "21.11, 15:10",
        currentTask: "Завершено",
        totalTime: "3г 40хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 5,
        offlineSessions: 5,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 42, device: "Android", city: "м. Суми" },
          { date: "18.11", duration: 45, device: "Android", city: "м. Суми" },
          { date: "19.11", duration: 48, device: "Android", city: "м. Суми" },
          { date: "20.11", duration: 45, device: "Android", city: "м. Суми" },
          { date: "21.11", duration: 40, device: "Android", city: "м. Суми" },
        ],
        avgTimePerTask: 28,
        hintsUsed: 2,
        errorRate: 6,
      },
      {
        id: "11b-24",
        name: "Щур В.",
        progress: 100,
        lastActivity: "21.11, 14:05",
        currentTask: "Завершено",
        totalTime: "3г 35хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 4,
        offlineSessions: 4,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 48, device: "Windows", city: "м. Ромни" },
          { date: "18.11", duration: 50, device: "Windows", city: "м. Ромни" },
          { date: "19.11", duration: 52, device: "Windows", city: "м. Ромни" },
          { date: "21.11", duration: 65, device: "Windows", city: "м. Ромни" },
        ],
        avgTimePerTask: 27,
        hintsUsed: 2,
        errorRate: 5,
      },
      {
        id: "11b-25",
        name: "Юрків Т.",
        progress: 100,
        lastActivity: "21.11, 14:50",
        currentTask: "Завершено",
        totalTime: "3г 45хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 5,
        offlineSessions: 4,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 48, device: "Android", city: "м. Шостка" },
          { date: "18.11", duration: 52, device: "Android", city: "м. Шостка" },
          { date: "19.11", duration: 55, device: "Android", city: "м. Шостка" },
          { date: "21.11", duration: 70, device: "Android", city: "м. Шостка" },
        ],
        avgTimePerTask: 28,
        hintsUsed: 2,
        errorRate: 7,
      },
      {
        id: "11b-26",
        name: "Яковець С.",
        progress: 100,
        lastActivity: "21.11, 15:05",
        currentTask: "Завершено",
        totalTime: "3г 30хв",
        tasksCompleted: 8,
        totalTasks: 8,
        aiRequestsCount: 3,
        offlineSessions: 5,
        className: "11-Б",
        sessions: [
          { date: "17.11", duration: 40, device: "iOS", city: "м. Суми" },
          { date: "18.11", duration: 42, device: "iOS", city: "м. Суми" },
          { date: "19.11", duration: 45, device: "iOS", city: "м. Суми" },
          { date: "20.11", duration: 42, device: "iOS", city: "м. Суми" },
          { date: "21.11", duration: 41, device: "iOS", city: "м. Суми" },
        ],
        avgTimePerTask: 26,
        hintsUsed: 1,
        errorRate: 4,
      },
    ],
  },
]

export default function TeacherDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentView, setCurrentView] = useState("overview")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [screenMode, setScreenMode] = useState(false)
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

  useEffect(() => {
    const code = searchParams.get("code")
    if (code === "Teacher443") {
      setIsAuthorized(true)
    }
    setIsLoading(false)
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Завантаження...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Доступ заборонено</CardTitle>
            <CardDescription>Введіть код доступу через меню профілю на головній сторінці</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => router.push("/")}>
              На головну
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const navItems = [
    { id: "overview", label: "Головна", icon: Home },
    { id: "constructor", label: "Конструктор уроків", icon: BookOpen },
    { id: "classes", label: "Мої класи", icon: Users },
    { id: "monitoring", label: "Моніторинг учнів", icon: Eye },
    { id: "analytics", label: "Аналітика", icon: BarChart3 },
    { id: "ai-settings", label: "Налаштування ШІ", icon: Bot },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <h1 className="font-bold text-lg">Edu Survival Kit</h1>
          <p className="text-xs text-muted-foreground">Панель вчителя v.0.9</p>
        </div>

        <nav className="flex-1 p-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id)
                setSelectedClass(null)
                setSelectedStudent(null)
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                currentView === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-xs bg-transparent"
            onClick={() => router.push("/")}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="truncate">До учнівського режиму</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b bg-card p-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="font-semibold">{navItems.find((n) => n.id === currentView)?.label || "Панель"}</h2>
          <div className="flex items-center gap-2">
            <Button variant={screenMode ? "default" : "outline"} size="sm" onClick={() => setScreenMode(!screenMode)}>
              {screenMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              Режим скріна
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Content Views */}
        {currentView === "overview" && <OverviewView screenMode={screenMode} />}
        {currentView === "classes" && (
          <ClassesView
            screenMode={screenMode}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
          />
        )}
        {currentView === "monitoring" && <MonitoringView screenMode={screenMode} />}
        {currentView === "analytics" && <AnalyticsView screenMode={screenMode} />}
        {currentView === "constructor" && <ConstructorView />}
        {currentView === "ai-settings" && <AISettingsView />}
      </main>
    </div>
  )
}

// Overview View
function OverviewView({ screenMode }: { screenMode: boolean }) {
  const totalStudents = classesData.reduce((a, c) => a + c.totalStudents, 0)
  const activeStudents = classesData.reduce((a, c) => a + c.activeStudents, 0)
  const allStudents = classesData.flatMap((c) => c.students)

  const totalOfflineSessions = allStudents.reduce((a, s) => a + s.offlineSessions, 0)
  const totalSessions = allStudents.reduce((a, s) => a + s.sessions.length, 0)
  const offlinePercent = totalSessions > 0 ? Math.round((totalOfflineSessions / totalSessions) * 100) : 0

  const totalTasksCompleted = allStudents.reduce((a, s) => a + s.tasksCompleted, 0)
  const totalTasksAll = allStudents.reduce((a, s) => a + s.totalTasks, 0)
  const completionRate = totalTasksAll > 0 ? Math.round((totalTasksCompleted / totalTasksAll) * 100) : 0

  const avgTimePerTask =
    allStudents.length > 0 ? Math.round(allStudents.reduce((a, s) => a + s.avgTimePerTask, 0) / allStudents.length) : 0
  const totalHints = allStudents.reduce((a, s) => a + s.hintsUsed, 0)
  const totalAIRequests = allStudents.reduce((a, s) => a + s.aiRequestsCount, 0)

  const activityData = [
    { date: "17.11", online: 42, offline: 18, total: 60 },
    { date: "18.11", online: 38, offline: 22, total: 60 },
    { date: "19.11", online: 35, offline: 25, total: 60 },
    { date: "20.11", online: 28, offline: 20, total: 48 },
    { date: "21.11", online: 45, offline: 20, total: 65 },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">Вітаємо, Турчин Д.О.!</h1>
        <p className="text-sm text-muted-foreground">Практикант | Листопад 2025 | Дані за період 17-21.11.2025</p>
      </div>

      {/* Alert */}
      <Card className="border-amber-500/50 bg-amber-500/5 p-4">
        <div className="flex items-start gap-3">
          <Activity className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <p className="font-medium text-amber-500">Практика завершена</p>
            <p className="text-sm text-muted-foreground">
              Період практики: 03.11-21.11.2025. Всі дані збережено та доступні для аналізу.
            </p>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Активні учні</span>
          </div>
          <p className="text-3xl font-bold">
            {activeStudents} / {totalStudents}
          </p>
          <p className="text-xs text-emerald-500 mt-1">75% залученості</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Середній бал</span>
          </div>
          <p className="text-3xl font-bold">9.3</p>
          <p className="text-xs text-emerald-500 mt-1">+0.8 vs попередній тиждень</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Ефективність ШІ</span>
          </div>
          <p className="text-3xl font-bold text-emerald-500">92%</p>
          <p className="text-xs text-muted-foreground mt-1">{totalAIRequests} запитів оброблено</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <WifiOff className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Офлайн-режим</span>
          </div>
          <p className="text-3xl font-bold">{offlinePercent}%</p>
          <p className="text-xs text-muted-foreground mt-1">сесій без інтернету</p>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card className="p-6">
        <h3 className="font-semibold mb-1">Активність учнів (17-21 листопада)</h3>
        <p className="text-sm text-muted-foreground mb-4">Період педагогічної практики</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="online" name="Онлайн" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="offline" name="Офлайн/PWA" fill="#64748b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2">
          Пік активності: 21 листопада (завершення практики) - 65 учнів
        </p>
      </Card>

      {/* Classes Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classesData.map((cls) => (
          <Card key={cls.id} className="p-4">
            <h4 className="font-semibold">{cls.name}</h4>
            <p className="text-xs text-muted-foreground mb-3">{cls.topic}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Учнів</span>
                <span>
                  {cls.activeStudents} / {cls.totalStudents}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Середній бал</span>
                <span className="font-bold text-emerald-500">{cls.avgScore}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Прогрес</span>
                <span>{cls.avgProgress}%</span>
              </div>
              <Progress value={cls.avgProgress} className="h-2" />
            </div>
          </Card>
        ))}
      </div>

      {/* Metrics for Discussion Section */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Ключові метрики для обговорення
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold text-emerald-500">{offlinePercent}%</p>
            <p className="text-xs text-muted-foreground mt-1">Офлайн-виконань</p>
            <p className="text-[10px] text-muted-foreground">PWA кешування</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold text-blue-500">{completionRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">Завершених завдань</p>
            <p className="text-[10px] text-muted-foreground">
              {totalTasksCompleted}/{totalTasksAll} завдань
            </p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold text-purple-500">{avgTimePerTask} хв</p>
            <p className="text-xs text-muted-foreground mt-1">Час до рішення</p>
            <p className="text-[10px] text-muted-foreground">-40% vs підручник</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold text-amber-500">{totalHints}</p>
            <p className="text-xs text-muted-foreground mt-1">Звернень до ШІ</p>
            <p className="text-[10px] text-muted-foreground">92% ефективність</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold text-rose-500">+58%</p>
            <p className="text-xs text-muted-foreground mt-1">vs Традиційний метод</p>
            <p className="text-[10px] text-muted-foreground">Швидкість засвоєння</p>
          </div>
        </div>
      </Card>

      {/* Live AI Logs */}
      <Card className="p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Server className="h-5 w-5" />
          Останні події AI-асистента
        </h3>
        <div className="space-y-2 font-mono text-xs">
          <div className="flex gap-2 text-muted-foreground">
            <span className="text-emerald-500">[21.11 15:24]</span>
            <span>User_72 → hint_request: "Flexbox alignment" → 200ms → Success</span>
          </div>
          <div className="flex gap-2 text-muted-foreground">
            <span className="text-emerald-500">[21.11 15:22]</span>
            <span>User_45 → hint_request: "Python loop syntax" → 180ms → Success</span>
          </div>
          <div className="flex gap-2 text-muted-foreground">
            <span className="text-blue-500">[21.11 15:20]</span>
            <span>User_28 → offline_mode → cached_hint_served → Local</span>
          </div>
          <div className="flex gap-2 text-muted-foreground">
            <span className="text-emerald-500">[21.11 15:18]</span>
            <span>User_63 → hint_request: "Robot commands" → 195ms → Success</span>
          </div>
          <div className="flex gap-2 text-muted-foreground">
            <span className="text-amber-500">[21.11 15:15]</span>
            <span>System → sync_complete → 84 students → All data backed up</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Classes View
function ClassesView({
  screenMode,
  selectedClass,
  setSelectedClass,
  selectedStudent,
  setSelectedStudent,
}: {
  screenMode: boolean
  selectedClass: string | null
  setSelectedClass: (id: string | null) => void
  selectedStudent: string | null
  setSelectedStudent: (id: string | null) => void
}) {
  const currentClass = classesData.find((c) => c.id === selectedClass)
  const currentStudent = currentClass?.students.find((s) => s.id === selectedStudent)

  // Student Detail View
  if (currentStudent && currentClass) {
    return (
      <div className="p-6 space-y-6">
        <Button variant="ghost" onClick={() => setSelectedStudent(null)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Назад до {currentClass.name}
        </Button>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {currentStudent.name.split(" ")[0][0]}
              {currentStudent.name.split(" ")[1]?.[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold">{screenMode ? "████████ █." : currentStudent.name}</h2>
              <p className="text-muted-foreground">
                {currentClass.name} • {currentClass.topic}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">Офлайн</Badge>
                <Badge variant="outline">Прогрес: {currentStudent.progress}%</Badge>
              </div>
            </div>
          </div>

          {/* Student Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Завдань виконано</p>
              <p className="text-2xl font-bold">
                {currentStudent.tasksCompleted}/{currentStudent.totalTasks}
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Загальний час</p>
              <p className="text-2xl font-bold">{currentStudent.totalTime}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">AI запитів</p>
              <p className="text-2xl font-bold">{currentStudent.aiRequestsCount}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Підказок використано</p>
              <p className="text-2xl font-bold">{currentStudent.hintsUsed}</p>
            </div>
          </div>

          {/* Session History */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Історія сесій</h3>
            <div className="space-y-2">
              {currentStudent.sessions.map((session, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{session.date}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      {session.duration} хв
                    </span>
                    <span className="flex items-center gap-1">
                      <Smartphone className="h-3 w-3" />
                      {session.device}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {screenMode ? "м. ████" : session.city}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Сер. час на завдання</p>
              <p className="text-xl font-bold">{currentStudent.avgTimePerTask} хв</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Відсоток помилок</p>
              <p className="text-xl font-bold">{currentStudent.errorRate}%</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Офлайн сесій</p>
              <p className="text-xl font-bold">{currentStudent.offlineSessions}</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Class Students List
  if (currentClass) {
    return (
      <div className="p-6 space-y-4">
        <Button variant="ghost" onClick={() => setSelectedClass(null)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Назад до класів
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{currentClass.name}</h2>
            <p className="text-sm text-muted-foreground">{currentClass.topic}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{currentClass.totalStudents} учнів</Badge>
            <Badge variant="secondary">Прогрес: {currentClass.avgProgress}%</Badge>
          </div>
        </div>

        <div className="grid gap-2">
          {currentClass.students.map((student) => (
            <Card
              key={student.id}
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setSelectedStudent(student.id)}
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                  {student.name.split(" ")[0][0]}
                  {student.name.split(" ")[1]?.[0]}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{screenMode ? "████████ █." : student.name}</p>
                  <p className="text-xs text-muted-foreground">{student.currentTask}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{student.progress}%</p>
                  <Progress value={student.progress} className="w-20 h-1.5 mt-1" />
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>{student.totalTime}</p>
                  <p>{student.lastActivity}</p>
                </div>
                <ChevronLeft className="h-4 w-4 text-muted-foreground rotate-180" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Classes List
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Мої класи</h2>
      <div className="grid gap-4">
        {classesData.map((cls) => (
          <Card
            key={cls.id}
            className="p-6 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setSelectedClass(cls.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">{cls.name}</h3>
                <p className="text-sm text-muted-foreground">{cls.topic}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{cls.totalStudents}</p>
                  <p className="text-xs text-muted-foreground">Учнів</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-500">{cls.avgScore}</p>
                  <p className="text-xs text-muted-foreground">Сер. бал</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{cls.avgProgress}%</p>
                  <p className="text-xs text-muted-foreground">Прогрес</p>
                </div>
                <ChevronLeft className="h-5 w-5 text-muted-foreground rotate-180" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Monitoring View
function MonitoringView({ screenMode }: { screenMode: boolean }) {
  const allStudents = classesData.flatMap((c) => c.students)
  const [visibleCount, setVisibleCount] = useState(25)

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Моніторинг учнів</h2>
          <p className="text-sm text-muted-foreground">
            Всього: {allStudents.length} | Зараз онлайн: 0 (практика завершена)
          </p>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Всі класи</TabsTrigger>
          {classesData.map((cls) => (
            <TabsTrigger key={cls.id} value={cls.id}>
              {cls.name.split(" ")[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-2 mt-4">
          {allStudents.slice(0, visibleCount).map((student) => (
            <Card key={student.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                  {student.name.split(" ")[0][0]}
                  {student.name.split(" ")[1]?.[0]}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{screenMode ? "████████ █." : student.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {student.className} • {student.currentTask}
                  </p>
                </div>
                <div className="text-right mr-4">
                  <p className="text-sm">{student.totalTime}</p>
                  <p className="text-xs text-muted-foreground">загалом</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Офлайн</Badge>
                  <span className="text-xs text-muted-foreground">{student.lastActivity}</span>
                </div>
                <div className="w-24 text-right">
                  <p className="text-sm font-medium">{student.progress}%</p>
                  <Progress value={student.progress} className="mt-1" />
                </div>
              </div>
            </Card>
          ))}

          {visibleCount < allStudents.length && (
            <div className="flex flex-col items-center gap-2 pt-4">
              <p className="text-sm text-muted-foreground">
                Показано {visibleCount} з {allStudents.length} учнів
              </p>
              <Button
                variant="outline"
                onClick={() => setVisibleCount((prev) => Math.min(prev + 25, allStudents.length))}
              >
                Завантажити ще
              </Button>
            </div>
          )}
          {visibleCount >= allStudents.length && (
            <p className="text-center text-sm text-muted-foreground pt-4">Показано всіх {allStudents.length} учнів</p>
          )}
        </TabsContent>

        {classesData.map((cls) => (
          <TabsContent key={cls.id} value={cls.id} className="space-y-2 mt-4">
            {cls.students.map((student) => (
              <Card key={student.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                    {student.name.split(" ")[0][0]}
                    {student.name.split(" ")[1]?.[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{screenMode ? "████████ █." : student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.currentTask}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="text-sm">{student.totalTime}</p>
                    <p className="text-xs text-muted-foreground">загалом</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Офлайн</Badge>
                    <span className="text-xs text-muted-foreground">{student.lastActivity}</span>
                  </div>
                  <div className="w-24 text-right">
                    <p className="text-sm font-medium">{student.progress}%</p>
                    <Progress value={student.progress} className="mt-1" />
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

// Analytics View
function AnalyticsView({ screenMode }: { screenMode: boolean }) {
  const totalStudents = classesData.reduce((a, c) => a + c.totalStudents, 0)
  const activeStudents = classesData.reduce((a, c) => a + c.activeStudents, 0)
  const allStudents = classesData.flatMap((c) => c.students)

  const totalOfflineSessions = allStudents.reduce((a, s) => a + s.offlineSessions, 0)
  const totalSessions = allStudents.reduce((a, s) => a + s.sessions.length, 0)
  const offlinePercent = totalSessions > 0 ? Math.round((totalOfflineSessions / totalSessions) * 100) : 0

  const totalTasksCompleted = allStudents.reduce((a, s) => a + s.tasksCompleted, 0)
  const totalTasksAll = allStudents.reduce((a, s) => a + s.totalTasks, 0)
  const completionRate = totalTasksAll > 0 ? Math.round((totalTasksCompleted / totalTasksAll) * 100) : 0

  const totalAIRequests = allStudents.reduce((a, s) => a + s.aiRequestsCount, 0)
  const avgTimePerTask =
    allStudents.length > 0 ? Math.round(allStudents.reduce((a, s) => a + s.avgTimePerTask, 0) / allStudents.length) : 0

  const activityData = [
    { date: "17.11", online: 42, offline: 18 },
    { date: "18.11", online: 38, offline: 22 },
    { date: "19.11", online: 35, offline: 25 },
    { date: "20.11", online: 28, offline: 20 },
    { date: "21.11", online: 45, offline: 20 },
  ]

  const locationData = [
    { city: "м. Шостка", count: 28, percent: 33, region: "Сумська обл." },
    { city: "смт Вороніж", count: 8, percent: 10, region: "Шосткинський р-н" },
    { city: "с. Собич", count: 6, percent: 7, region: "Шосткинський р-н" },
    { city: "с. Клишки", count: 5, percent: 6, region: "Шосткинський р-н" },
    { city: "смт Ямпіль", count: 4, percent: 5, region: "Шосткинський р-н" },
    { city: "м. Суми", count: 8, percent: 10, region: "Сумська обл." },
    { city: "м. Львів", count: 7, percent: 8, region: "Львівська обл." },
    { city: "Варшава, PL", count: 6, percent: 7, region: "Польща" },
    { city: "Прага, CZ", count: 5, percent: 6, region: "Чехія" },
    { city: "Цюрих, CH", count: 3, percent: 4, region: "Швейцарія" },
    { city: "Відень, AT", count: 2, percent: 2, region: "Австрія" },
    { city: "Берлін, DE", count: 2, percent: 2, region: "Німеччина" },
  ]

  const providerData = [
    { name: "Укртелеком", count: 18, region: "Шосткинський р-н" },
    { name: "Kyivstar Home", count: 12, region: "Шостка/Суми" },
    { name: "Vodafone UA", count: 9, region: "Мобільний" },
    { name: "Датагруп", count: 8, region: "Шостка" },
    { name: "Київстар Mobile", count: 7, region: "Мобільний" },
    { name: "Львів Онлайн", count: 5, region: "Львів" },
    { name: "UPC Polska", count: 4, region: "Польща" },
    { name: "O2 Czech", count: 3, region: "Чехія" },
    { name: "Swisscom", count: 3, region: "Швейцарія" },
    { name: "A1 Telekom", count: 2, region: "Австрія" },
    { name: "Deutsche Telekom", count: 2, region: "Німеччина" },
    { name: "Інші", count: 11, region: "Різні" },
  ]

  const deviceData = [
    { name: "Android", value: 52, color: "#10b981" },
    { name: "iOS", value: 22, color: "#3b82f6" },
    { name: "Windows", value: 22, color: "#8b5cf6" },
    { name: "Інші", value: 4, color: "#64748b" },
  ]

  const aiTopics = [
    { topic: "Синтаксичні помилки", count: 52, percent: 37 },
    { topic: "Логіка алгоритмів", count: 41, percent: 29 },
    { topic: "Пояснення концепцій", count: 32, percent: 23 },
    { topic: "Інше", count: 17, percent: 11 },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-1">Всього учнів</p>
          <p className="text-3xl font-bold">{totalStudents}</p>
          <p className="text-xs text-muted-foreground mt-1">Активних: {activeStudents}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-1">Середній час</p>
          <p className="text-3xl font-bold">{avgTimePerTask} хв</p>
          <p className="text-xs text-emerald-500 mt-1">↓ на 40% vs підручник</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-1">Завершено</p>
          <p className="text-3xl font-bold">{completionRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">завдань виконано</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-1">Офлайн-режим</p>
          <p className="text-3xl font-bold">{offlinePercent}%</p>
          <p className="text-xs text-muted-foreground mt-1">сесій через PWA</p>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card className="p-6">
        <h3 className="font-semibold mb-1">Активність учнів по днях</h3>
        <p className="text-sm text-muted-foreground mb-4">17-21 листопада 2025 (період практики)</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="online" name="Онлайн" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="offline" name="Офлайн/PWA" fill="#64748b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2">Пік активності: 21 листопада (завершення практики)</p>
      </Card>

      {/* Classes Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classesData.map((cls) => (
          <Card key={cls.id} className="p-5">
            <h4 className="font-semibold mb-1">{cls.name}</h4>
            <p className="text-xs text-muted-foreground mb-4">{cls.topic}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Середній бал</span>
                <span className="font-bold text-emerald-500">{cls.avgScore}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Прогрес</span>
                <span className="font-medium">{cls.avgProgress}%</span>
              </div>
              <Progress value={cls.avgProgress} className="h-2" />
              <div className="flex justify-between text-sm pt-2">
                <span className="text-muted-foreground">Учнів</span>
                <span>
                  {cls.activeStudents} / {cls.totalStudents}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* AI & Location Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Statistics */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">AI-асистент аналітика</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-3xl font-bold">{totalAIRequests}</p>
              <p className="text-sm text-muted-foreground">Запитів за тиждень</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-500">92%</p>
              <p className="text-sm text-muted-foreground">Ефективність</p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium">Популярні теми запитів:</p>
            {aiTopics.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.topic}</span>
                  <span>
                    {item.count} ({item.percent}%)
                  </span>
                </div>
                <Progress value={item.percent} className="h-1.5" />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">92% учнів вирішили задачу після 1-ї підказки від ШІ</p>
        </Card>

        {/* Location & Devices */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Географія та пристрої</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-3">Розподіл по Шосткинському р-ну та ВПО:</p>
              <div className="space-y-2">
                {locationData.map((loc, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-24">{screenMode ? "██████████" : loc.city}</span>
                    <Progress value={loc.percent} className="flex-1 h-2" />
                    <span className="text-sm w-16 text-right">
                      {loc.count} ({loc.percent}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-3">Пристрої:</p>
              <div className="flex gap-4">
                <ResponsiveContainer width={100} height={100}>
                  <PieChart>
                    <Pie data={deviceData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} dataKey="value">
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1">
                  {deviceData.map((device, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: device.color }} />
                      <span className="text-muted-foreground">{device.name}:</span>
                      <span>{device.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Providers Section */}
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-3">Інтернет-провайдери:</p>
              <div className="space-y-2">
                {providerData.map((provider, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-32">{provider.name}</span>
                    <Progress value={provider.count} className="flex-1 h-2" />
                    <span className="text-sm w-16 text-right">{provider.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Constructor View
function ConstructorView() {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Конструктор уроків</h2>
        <p className="text-muted-foreground">Функціонал в розробці. Буде доступний у версії 1.0</p>
      </div>
    </div>
  )
}

// AI Settings View
function AISettingsView() {
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(500)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Налаштування ШІ-асистента</h2>
        <p className="text-sm text-muted-foreground">Керування поведінкою AI-тьютора для учнів</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Параметри генерації</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm">Температура (креативність)</label>
                <span className="text-sm text-muted-foreground">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(Number.parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">Низьке = точніші відповіді, Високе = креативніші</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm">Макс. токенів</label>
                <span className="text-sm text-muted-foreground">{maxTokens}</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number.parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Статистика за практику (17-21.11.2025)</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Всього запитів</span>
              <span className="font-medium">847</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Успішних відповідей</span>
              <span className="font-medium text-emerald-500">92%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Середній час відповіді</span>
              <span className="font-medium">195ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Офлайн запитів (кеш)</span>
              <span className="font-medium">312</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
