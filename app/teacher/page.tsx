"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Users,
  Eye,
  BarChart3,
  ChevronLeft,
  EyeOff,
  WifiOff,
  Timer,
  Smartphone,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowLeft,
  TrendingUp,
  FileText,
  BookOpen,
  Bot,
  Bell,
  Sparkles,
  Settings2,
  PlusCircle,
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
import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"
import { AIControlCenter } from "@/components/teacher/ai-control-center"
import { AssignmentCreator } from "@/components/teacher/assignment-creator"

const classesData = [
  {
    id: "11a",
    name: "11-А",
    topic: "Бази даних та SQL",
    totalStudents: 24,
    activeStudents: 22,
    avgScore: 9.6,
    avgProgress: 89,
    students: [
      { id: "11a-01", name: "Захарченко В.", progress: 100, lastActivity: "12.04, 16:20", currentTask: "SQL JOIN — фінальний проєкт", totalTime: "5г 40хв", tasksCompleted: 16, totalTasks: 16, aiRequestsCount: 4, offlineSessions: 5, className: "11-А", sessions: [{ date: "31.03", duration: 55, device: "Windows", city: "м. Шостка" }, { date: "05.04", duration: 62, device: "Windows", city: "м. Шостка" }, { date: "12.04", duration: 58, device: "Windows", city: "м. Шостка" }], avgTimePerTask: 21, hintsUsed: 2, errorRate: 4 },
      { id: "11a-02", name: "Мельниченко О.", progress: 88, lastActivity: "12.04, 14:05", currentTask: "Агрегатні функції — завдання 6", totalTime: "4г 15хв", tasksCompleted: 14, totalTasks: 16, aiRequestsCount: 9, offlineSessions: 3, className: "11-А", sessions: [{ date: "01.04", duration: 48, device: "macOS", city: "м. Шостка" }, { date: "08.04", duration: 52, device: "macOS", city: "м. Шостка" }], avgTimePerTask: 18, hintsUsed: 5, errorRate: 9 },
      { id: "11a-03", name: "Кириленко Д.", progress: 72, lastActivity: "10.04, 17:40", currentTask: "Нормалізація БД — завдання 4", totalTime: "3г 05хв", tasksCompleted: 11, totalTasks: 16, aiRequestsCount: 17, offlineSessions: 4, className: "11-А", sessions: [{ date: "02.04", duration: 35, device: "Android", city: "с. Вороніж" }, { date: "10.04", duration: 50, device: "Android", city: "с. Вороніж" }], avgTimePerTask: 16, hintsUsed: 10, errorRate: 18 },
    ],
  },
  {
    id: "11b",
    name: "11-Б",
    topic: "Веб-розробка: JavaScript",
    totalStudents: 22,
    activeStudents: 20,
    avgScore: 9.1,
    avgProgress: 84,
    students: [
      { id: "11b-01", name: "Литвиненко А.", progress: 95, lastActivity: "12.04, 15:50", currentTask: "DOM-події — завдання 9", totalTime: "4г 50хв", tasksCompleted: 18, totalTasks: 19, aiRequestsCount: 6, offlineSessions: 4, className: "11-Б", sessions: [{ date: "30.03", duration: 50, device: "Windows", city: "м. Шостка" }, { date: "07.04", duration: 45, device: "Windows", city: "м. Шостка" }, { date: "12.04", duration: 60, device: "Windows", city: "м. Шостка" }], avgTimePerTask: 15, hintsUsed: 3, errorRate: 7 },
      { id: "11b-02", name: "Гончаренко С.", progress: 79, lastActivity: "11.04, 12:30", currentTask: "Масиви та методи — завдання 7", totalTime: "3г 20хв", tasksCompleted: 15, totalTasks: 19, aiRequestsCount: 14, offlineSessions: 2, className: "11-Б", sessions: [{ date: "03.04", duration: 40, device: "iOS", city: "м. Шостка" }, { date: "11.04", duration: 55, device: "iOS", city: "м. Шостка" }], avgTimePerTask: 13, hintsUsed: 8, errorRate: 15 },
    ],
  },
  {
    id: "10a",
    name: "10-А",
    topic: "Комп'ютерні мережі та Інтернет",
    totalStudents: 26,
    activeStudents: 24,
    avgScore: 9.3,
    avgProgress: 86,
    students: [
      { id: "10a-01", name: "Шевченко О.", progress: 92, lastActivity: "12.04, 14:45", currentTask: "IP-адресація — маска підмережі", totalTime: "4г 30хв", tasksCompleted: 12, totalTasks: 13, aiRequestsCount: 7, offlineSessions: 5, className: "10-А", sessions: [{ date: "31.03", duration: 45, device: "Android", city: "м. Шостка" }, { date: "06.04", duration: 50, device: "Android", city: "м. Шостка" }, { date: "12.04", duration: 48, device: "Android", city: "м. Шостка" }], avgTimePerTask: 19, hintsUsed: 4, errorRate: 8 },
      { id: "10a-02", name: "Бойченко А.", progress: 81, lastActivity: "11.04, 16:10", currentTask: "DNS-резолюція — завдання 5", totalTime: "3г 40хв", tasksCompleted: 10, totalTasks: 13, aiRequestsCount: 12, offlineSessions: 3, className: "10-А", sessions: [{ date: "02.04", duration: 38, device: "Windows", city: "м. Шостка" }, { date: "11.04", duration: 52, device: "Windows", city: "м. Шостка" }], avgTimePerTask: 17, hintsUsed: 7, errorRate: 12 },
      { id: "10a-03", name: "Ковальчук М.", progress: 68, lastActivity: "09.04, 13:25", currentTask: "Протоколи TCP/IP — завдання 3", totalTime: "2г 35хв", tasksCompleted: 8, totalTasks: 13, aiRequestsCount: 20, offlineSessions: 6, className: "10-А", sessions: [{ date: "01.04", duration: 30, device: "Android", city: "с. Ямпіль" }, { date: "09.04", duration: 42, device: "Android", city: "с. Ямпіль" }], avgTimePerTask: 14, hintsUsed: 11, errorRate: 21 },
    ],
  },
  {
    id: "10v",
    name: "10-В",
    topic: "Опрацювання табличних даних",
    totalStudents: 23,
    activeStudents: 21,
    avgScore: 8.9,
    avgProgress: 79,
    students: [
      { id: "10v-01", name: "Романенко І.", progress: 90, lastActivity: "12.04, 13:15", currentTask: "Зведені таблиці — завдання 8", totalTime: "3г 55хв", tasksCompleted: 13, totalTasks: 14, aiRequestsCount: 8, offlineSessions: 2, className: "10-В", sessions: [{ date: "04.04", duration: 44, device: "Windows", city: "м. Шостка" }, { date: "12.04", duration: 49, device: "Windows", city: "м. Шостка" }], avgTimePerTask: 16, hintsUsed: 4, errorRate: 10 },
      { id: "10v-02", name: "Ткаченко Н.", progress: 64, lastActivity: "10.04, 11:45", currentTask: "Формули та функції — завдання 5", totalTime: "2г 20хв", tasksCompleted: 9, totalTasks: 14, aiRequestsCount: 18, offlineSessions: 4, className: "10-В", sessions: [{ date: "03.04", duration: 32, device: "Chrome OS", city: "м. Шостка" }, { date: "10.04", duration: 46, device: "Chrome OS", city: "м. Шостка" }], avgTimePerTask: 13, hintsUsed: 9, errorRate: 19 },
    ],
  },
  {
    id: "9a",
    name: "9-А",
    topic: "Основи програмування Python",
    totalStudents: 27,
    activeStudents: 25,
    avgScore: 8.8,
    avgProgress: 82,
    students: [
      { id: "9a-01", name: "Даниленко В.", progress: 95, lastActivity: "12.04, 15:10", currentTask: "Функції Python — завдання 5", totalTime: "4г 20хв", tasksCompleted: 19, totalTasks: 20, aiRequestsCount: 5, offlineSessions: 3, className: "9-А", sessions: [{ date: "30.03", duration: 55, device: "Chrome OS", city: "м. Шостка" }, { date: "05.04", duration: 48, device: "Windows", city: "м. Шостка" }, { date: "12.04", duration: 57, device: "Windows", city: "м. Шостка" }], avgTimePerTask: 14, hintsUsed: 2, errorRate: 5 },
      { id: "9a-02", name: "Єременко С.", progress: 60, lastActivity: "09.04, 11:00", currentTask: "Цикли — завдання 4", totalTime: "1г 30хв", tasksCompleted: 12, totalTasks: 20, aiRequestsCount: 30, offlineSessions: 1, className: "9-А", sessions: [{ date: "31.03", duration: 20, device: "iOS", city: "м. Шостка" }, { date: "09.04", duration: 70, device: "iOS", city: "м. Шостка" }], avgTimePerTask: 8, hintsUsed: 18, errorRate: 42 },
      { id: "9a-03", name: "Полтавець Р.", progress: 78, lastActivity: "11.04, 14:35", currentTask: "Умовні оператори — завдання 6", totalTime: "2г 50хв", tasksCompleted: 15, totalTasks: 20, aiRequestsCount: 13, offlineSessions: 2, className: "9-А", sessions: [{ date: "02.04", duration: 36, device: "Android", city: "м. Шостка" }, { date: "11.04", duration: 44, device: "Android", city: "м. Шостка" }], avgTimePerTask: 11, hintsUsed: 6, errorRate: 14 },
    ],
  },
  {
    id: "9b",
    name: "9-Б",
    topic: "Створення вебсайтів: HTML/CSS",
    totalStudents: 25,
    activeStudents: 23,
    avgScore: 9.5,
    avgProgress: 88,
    students: [
      { id: "9b-01", name: "Коваленко Т.", progress: 100, lastActivity: "12.04, 16:00", currentTask: "CSS Flexbox — фінал", totalTime: "5г 10хв", tasksCompleted: 15, totalTasks: 15, aiRequestsCount: 3, offlineSessions: 6, className: "9-Б", sessions: [{ date: "30.03", duration: 60, device: "macOS", city: "м. Шостка" }, { date: "03.04", duration: 55, device: "macOS", city: "м. Шостка" }, { date: "08.04", duration: 50, device: "Chrome OS", city: "м. Шостка" }, { date: "12.04", duration: 65, device: "macOS", city: "м. Шостка" }], avgTimePerTask: 21, hintsUsed: 1, errorRate: 3 },
      { id: "9b-02", name: "Савченко Л.", progress: 83, lastActivity: "11.04, 15:20", currentTask: "Селектори CSS — завдання 9", totalTime: "3г 30хв", tasksCompleted: 12, totalTasks: 15, aiRequestsCount: 10, offlineSessions: 3, className: "9-Б", sessions: [{ date: "04.04", duration: 42, device: "Windows", city: "м. Шостка" }, { date: "11.04", duration: 51, device: "Windows", city: "м. Шостка" }], avgTimePerTask: 17, hintsUsed: 5, errorRate: 11 },
    ],
  },
  {
    id: "8a",
    name: "8-А",
    topic: "Алгоритми та програми",
    totalStudents: 28,
    activeStudents: 26,
    avgScore: 9.0,
    avgProgress: 85,
    students: [
      { id: "8a-01", name: "Бондаренко А.", progress: 100, lastActivity: "12.04, 14:45", currentTask: "Виконавець Робот — рівень 5", totalTime: "3г 12хв", tasksCompleted: 12, totalTasks: 12, aiRequestsCount: 8, offlineSessions: 4, className: "8-А", sessions: [{ date: "31.03", duration: 45, device: "Android", city: "м. Шостка" }, { date: "04.04", duration: 38, device: "Android", city: "м. Шостка" }, { date: "08.04", duration: 52, device: "Android", city: "м. Шостка" }, { date: "12.04", duration: 47, device: "Android", city: "м. Шостка" }], avgTimePerTask: 16, hintsUsed: 3, errorRate: 12 },
      { id: "8a-02", name: "Василенко О.", progress: 92, lastActivity: "11.04, 13:20", currentTask: "Виконавець Робот — рівень 4", totalTime: "2г 48хв", tasksCompleted: 11, totalTasks: 12, aiRequestsCount: 15, offlineSessions: 2, className: "8-А", sessions: [{ date: "02.04", duration: 40, device: "Windows", city: "м. Шостка" }, { date: "07.04", duration: 35, device: "Windows", city: "м. Шостка" }, { date: "11.04", duration: 53, device: "Windows", city: "м. Шостка" }], avgTimePerTask: 15, hintsUsed: 7, errorRate: 8 },
      { id: "8a-03", name: "Гриценко М.", progress: 75, lastActivity: "10.04, 18:30", currentTask: "Розгалуження — завдання 3", totalTime: "1г 55хв", tasksCompleted: 9, totalTasks: 12, aiRequestsCount: 22, offlineSessions: 5, className: "8-А", sessions: [{ date: "01.04", duration: 25, device: "Android", city: "с. Ямпіль" }, { date: "05.04", duration: 30, device: "Android", city: "с. Ямпіль" }, { date: "10.04", duration: 60, device: "Android", city: "с. Ямпіль" }], avgTimePerTask: 13, hintsUsed: 12, errorRate: 23 },
    ],
  },
  {
    id: "8b",
    name: "8-Б",
    topic: "Кодування даних та графіка",
    totalStudents: 26,
    activeStudents: 23,
    avgScore: 8.6,
    avgProgress: 77,
    students: [
      { id: "8b-01", name: "Олійник Н.", progress: 87, lastActivity: "12.04, 12:50", currentTask: "Растрова графіка — завдання 7", totalTime: "3г 10хв", tasksCompleted: 13, totalTasks: 15, aiRequestsCount: 9, offlineSessions: 3, className: "8-Б", sessions: [{ date: "05.04", duration: 41, device: "Windows", city: "м. Шостка" }, { date: "12.04", duration: 47, device: "Windows", city: "м. Шостка" }], avgTimePerTask: 14, hintsUsed: 5, errorRate: 13 },
      { id: "8b-02", name: "Кравченко Ю.", progress: 62, lastActivity: "10.04, 15:35", currentTask: "Двійкове кодування — завдання 4", totalTime: "2г 05хв", tasksCompleted: 9, totalTasks: 15, aiRequestsCount: 19, offlineSessions: 2, className: "8-Б", sessions: [{ date: "03.04", duration: 28, device: "Android", city: "м. Шостка" }, { date: "10.04", duration: 39, device: "Android", city: "м. Шостка" }], avgTimePerTask: 12, hintsUsed: 10, errorRate: 24 },
    ],
  },
  {
    id: "8v",
    name: "8-В",
    topic: "Електронні таблиці",
    totalStudents: 24,
    activeStudents: 21,
    avgScore: 8.4,
    avgProgress: 73,
    students: [
      { id: "8v-01", name: "Мороз Д.", progress: 84, lastActivity: "12.04, 11:30", currentTask: "Діаграми — завдання 6", totalTime: "2г 45хв", tasksCompleted: 11, totalTasks: 13, aiRequestsCount: 11, offlineSessions: 4, className: "8-В", sessions: [{ date: "06.04", duration: 37, device: "Chrome OS", city: "м. Шостка" }, { date: "12.04", duration: 43, device: "Chrome OS", city: "м. Шостка" }], avgTimePerTask: 15, hintsUsed: 6, errorRate: 16 },
      { id: "8v-02", name: "Лисенко К.", progress: 58, lastActivity: "09.04, 16:40", currentTask: "Формули — завдання 3", totalTime: "1г 50хв", tasksCompleted: 7, totalTasks: 13, aiRequestsCount: 24, offlineSessions: 1, className: "8-В", sessions: [{ date: "02.04", duration: 26, device: "iOS", city: "с. Вороніж" }, { date: "09.04", duration: 48, device: "iOS", city: "с. Вороніж" }], avgTimePerTask: 16, hintsUsed: 13, errorRate: 28 },
    ],
  },
  {
    id: "5a1",
    name: "5-А (1 підгрупа)",
    topic: "Алгоритми. Виконавець Робот",
    totalStudents: 14,
    activeStudents: 13,
    avgScore: 9.4,
    avgProgress: 91,
    students: [
      { id: "5a1-01", name: "Дмитренко А.", progress: 100, lastActivity: "12.04, 12:40", currentTask: "Гра «Робот» — рівень 5", totalTime: "2г 30хв", tasksCompleted: 10, totalTasks: 10, aiRequestsCount: 4, offlineSessions: 3, className: "5-А (1 підгр.)", sessions: [{ date: "01.04", duration: 30, device: "Android", city: "м. Шостка" }, { date: "08.04", duration: 35, device: "Android", city: "м. Шостка" }, { date: "12.04", duration: 32, device: "Android", city: "м. Шос����ка" }], avgTimePerTask: 10, hintsUsed: 2, errorRate: 6 },
      { id: "5a1-02", name: "Ковальчук Н.", progress: 80, lastActivity: "11.04, 14:15", currentTask: "Гра «Робот» — рівень 4", totalTime: "1г 55хв", tasksCompleted: 8, totalTasks: 10, aiRequestsCount: 9, offlineSessions: 2, className: "5-А (1 підгр.)", sessions: [{ date: "04.04", duration: 28, device: "iOS", city: "м. Шостка" }, { date: "11.04", duration: 34, device: "iOS", city: "м. Шостка" }], avgTimePerTask: 11, hintsUsed: 5, errorRate: 12 },
    ],
  },
  {
    id: "5a2",
    name: "5-А (2 підгрупа)",
    topic: "Алгоритми. Виконавець Робот",
    totalStudents: 13,
    activeStudents: 12,
    avgScore: 9.1,
    avgProgress: 87,
    students: [
      { id: "5a2-01", name: "Романчук С.", progress: 90, lastActivity: "12.04, 13:05", currentTask: "Гра «Робот» — рівень 4", totalTime: "2г 10хв", tasksCompleted: 9, totalTasks: 10, aiRequestsCount: 6, offlineSessions: 2, className: "5-А (2 підгр.)", sessions: [{ date: "05.04", duration: 31, device: "Android", city: "м. Шостка" }, { date: "12.04", duration: 36, device: "Android", city: "м. Шостка" }], avgTimePerTask: 12, hintsUsed: 3, errorRate: 9 },
      { id: "5a2-02", name: "Захарчук В.", progress: 70, lastActivity: "10.04, 12:25", currentTask: "Гра «Робот» — рівень 3", totalTime: "1г 40хв", tasksCompleted: 7, totalTasks: 10, aiRequestsCount: 14, offlineSessions: 4, className: "5-А (2 підгр.)", sessions: [{ date: "03.04", duration: 24, device: "Android", city: "с. Ямпіль" }, { date: "10.04", duration: 38, device: "Android", city: "с. Ямпіль" }], avgTimePerTask: 13, hintsUsed: 8, errorRate: 17 },
    ],
  },
  {
    id: "5b1",
    name: "5-Б (1 підгрупа)",
    topic: "Безпека в Інтернеті",
    totalStudents: 12,
    activeStudents: 11,
    avgScore: 9.7,
    avgProgress: 93,
    students: [
      { id: "5b1-01", name: "Калашник О.", progress: 100, lastActivity: "12.04, 15:10", currentTask: "Безпечні паролі — фінал", totalTime: "2г 20хв", tasksCompleted: 8, totalTasks: 8, aiRequestsCount: 2, offlineSessions: 2, className: "5-Б (1 підгр.)", sessions: [{ date: "07.04", duration: 33, device: "iOS", city: "м. Шостка" }, { date: "12.04", duration: 37, device: "iOS", city: "м. Шостка" }], avgTimePerTask: 14, hintsUsed: 1, errorRate: 4 },
      { id: "5b1-02", name: "Міщенко І.", progress: 85, lastActivity: "11.04, 11:50", currentTask: "Фішинг — завдання 6", totalTime: "1г 45хв", tasksCompleted: 7, totalTasks: 8, aiRequestsCount: 7, offlineSessions: 1, className: "5-Б (1 підгр.)", sessions: [{ date: "04.04", duration: 27, device: "Android", city: "м. Шостка" }, { date: "11.04", duration: 31, device: "Android", city: "м. Шостка" }], avgTimePerTask: 12, hintsUsed: 4, errorRate: 10 },
    ],
  },
  {
    id: "5v",
    name: "5-В",
    topic: "Графічний редактор",
    totalStudents: 24,
    activeStudents: 22,
    avgScore: 9.2,
    avgProgress: 88,
    students: [
      { id: "5v-01", name: "Петриченко М.", progress: 96, lastActivity: "12.04, 10:35", currentTask: "Колаж — завдання 9", totalTime: "2г 40хв", tasksCompleted: 11, totalTasks: 12, aiRequestsCount: 5, offlineSessions: 3, className: "5-В", sessions: [{ date: "06.04", duration: 35, device: "Windows", city: "м. Шостка" }, { date: "12.04", duration: 40, device: "Windows", city: "м. Шостка" }], avgTimePerTask: 13, hintsUsed: 3, errorRate: 7 },
      { id: "5v-02", name: "Гаврилюк Т.", progress: 74, lastActivity: "10.04, 14:20", currentTask: "Шари зображення — завдання 6", totalTime: "1г 55хв", tasksCompleted: 9, totalTasks: 12, aiRequestsCount: 12, offlineSessions: 2, className: "5-В", sessions: [{ date: "03.04", duration: 29, device: "Android", city: "м. Шостка" }, { date: "10.04", duration: 36, device: "Android", city: "м. Шостка" }], avgTimePerTask: 12, hintsUsed: 7, errorRate: 15 },
    ],
  },
]

// Активність за період 30.03 - 12.04 (по днях)
const activityData = [
  { time: "30.03", active: 42 }, { time: "31.03", active: 38 }, { time: "01.04", active: 55 },
  { time: "02.04", active: 48 }, { time: "03.04", active: 61 }, { time: "04.04", active: 52 },
  { time: "05.04", active: 47 }, { time: "06.04", active: 12 }, { time: "07.04", active: 15 },
  { time: "08.04", active: 58 }, { time: "09.04", active: 44 }, { time: "10.04", active: 39 },
  { time: "11.04", active: 51 }, { time: "12.04", active: 46 },
]

// Активність за годинами (типовий день, усереднено за період)
const hourlyActivity = [
  { hour: "08:00", active: 3 }, { hour: "10:00", active: 28 }, { hour: "12:00", active: 38 },
  { hour: "14:00", active: 35 }, { hour: "16:00", active: 30 }, { hour: "18:00", active: 25 },
  { hour: "20:00", active: 8 },
]

const deviceData = [
  { name: "Android", value: 38 }, { name: "Windows", value: 31 },
  { name: "iOS", value: 14 }, { name: "macOS", value: 7 },
  { name: "Chrome OS", value: 10 },
]

// Виконання завдань по темах
const topicStats = [
  { topic: "Змінні", completed: 89 },
  { topic: "Умови", completed: 76 },
  { topic: "Цикли", completed: 64 },
  { topic: "Функції", completed: 52 },
  { topic: "Списки", completed: 41 },
  { topic: "Flexbox", completed: 38 },
]

const COLORS = ["#16a34a", "#3b82f6", "#f59e0b", "#8b5cf6", "#06b6d4"]

// Premium glassmorphism card styles (reused across the dashboard)
const CARD_CLS = "rounded-xl border border-white/5 bg-card/60 shadow-xl backdrop-blur-md"
const CARD_HOVER_CLS = "rounded-xl border border-white/5 bg-card/60 shadow-xl backdrop-blur-md cursor-pointer transition-all hover:border-primary/40 hover:bg-card hover:shadow-primary/5"
const TILE_CLS = "rounded-lg border border-white/5 bg-white/[0.03] p-3 text-center"
// Shared dark-mode chart tooltip style
const TOOLTIP_STYLE = { background: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 12, color: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" } as const
const AXIS_STROKE = "#52525b"
const GRID_STROKE = "rgba(255,255,255,0.06)"

const progressByClass = [
  { class: "11-А", progress: 89, score: 9.6 },
  { class: "11-Б", progress: 84, score: 9.1 },
  { class: "10-А", progress: 86, score: 9.3 },
  { class: "10-В", progress: 79, score: 8.9 },
  { class: "9-А", progress: 82, score: 8.8 },
  { class: "9-Б", progress: 88, score: 9.5 },
  { class: "8-А", progress: 85, score: 9.0 },
  { class: "8-Б", progress: 77, score: 8.6 },
  { class: "8-В", progress: 73, score: 8.4 },
  { class: "5-А (1)", progress: 91, score: 9.4 },
  { class: "5-А (2)", progress: 87, score: 9.1 },
  { class: "5-Б (1)", progress: 93, score: 9.7 },
  { class: "5-В", progress: 88, score: 9.2 },
]

export default function TeacherPage() {
  const router = useRouter()
  const [hasAccess, setHasAccess] = useState(false)
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
  const [showStudentDetail, setShowStudentDetail] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  useEffect(() => {
    // Панель відкривається одразу — доступ надається автоматично (демо-режим)
    const urlParams = new URLSearchParams(window.location.search)
    const codeParam = urlParams.get("code")

    localStorage.setItem("teacherAccessCode", codeParam || "Teacher443")
    localStorage.setItem("edu_teacher_access", "true")
    localStorage.setItem("edu_teacher_code", codeParam || "Teacher443")
    setHasAccess(true)
  }, [router])

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Перевірка доступу...</p>
        </div>
      </div>
    )
  }

  const currentClass = classesData.find((c) => c.id === selectedClass)
  const totalStudents = classesData.reduce((a, c) => a + c.totalStudents, 0)
  const totalActive = classesData.reduce((a, c) => a + c.activeStudents, 0)
  const avgScore = (classesData.reduce((a, c) => a + c.avgScore, 0) / classesData.length).toFixed(1)
  const avgProgress = Math.round(classesData.reduce((a, c) => a + c.avgProgress, 0) / classesData.length)

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-500/5 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="flex h-12 items-center justify-between px-2 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground">
              <Link href="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div className="flex items-center gap-2 min-w-0">
              <BrandLogo className="shrink-0" />
              <span className="font-mono text-sm font-semibold tracking-tight text-foreground whitespace-nowrap">
                <span className="hidden sm:inline">dot<span className="text-primary">.</span>kit</span>
                <span className="sm:hidden">dot</span>
                <span className="hidden sm:inline text-muted-foreground">.me</span>
              </span>
              <span className="text-muted-foreground/60 text-sm shrink-0">/</span>
              <h1 className="text-sm font-semibold text-foreground whitespace-nowrap truncate">Кабінет вчителя</h1>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              {notificationsEnabled ? <Bell className="h-4 w-4 text-primary" /> : <Bell className="h-4 w-4" />}
            </Button>
            <Badge variant="outline" className="gap-1.5 text-muted-foreground border-border bg-secondary/50">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
              <span className="hidden sm:inline">Архів</span>
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-2 sm:px-4 border-t border-border overflow-x-auto">
          {[
            { id: "overview", label: "Огляд", icon: BarChart3 },
            { id: "classes", label: "Класи", icon: Users },
            { id: "ai", label: "AI Помічник", icon: Settings2 },
            { id: "assignments", label: "Завдання", icon: PlusCircle },
            { id: "activity", label: "Активність", icon: Activity },
            { id: "archive", label: "Архів", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap -mb-px ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="relative z-10 flex-1 p-4 sm:p-6 space-y-6">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <>
            {/* Welcome hero */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-card to-card/40 p-6 backdrop-blur-md">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium uppercase tracking-widest text-primary">Командний центр</span>
              </div>
              <h2 className="relative text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                Вітаємо у кабінеті вчителя
              </h2>
              <p className="relative mt-1 text-sm text-muted-foreground">
                Повний огляд успішності учнів, активності та аналітики за період практики
              </p>
            </div>

            {/* Stats */}
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Учнів всього", value: totalStudents, sub: `${totalActive} брали участь`, icon: Users, color: "text-primary", glow: "shadow-primary/20", iconBg: "bg-primary/10" },
                { label: "Середній бал", value: avgScore, sub: "По всіх класах", icon: TrendingUp, color: "text-green-400", glow: "shadow-green-500/20", iconBg: "bg-green-500/10" },
                { label: "Прогрес", value: `${avgProgress}%`, sub: "Середній по курсу", icon: CheckCircle2, color: "text-blue-400", glow: "shadow-blue-500/20", iconBg: "bg-blue-500/10" },
                { label: "AI запити", value: "103", sub: "30.03 — 12.04", icon: Bot, color: "text-amber-400", glow: "shadow-amber-500/20", iconBg: "bg-amber-500/10" },
              ].map((s) => (
                <div key={s.label} className="group relative overflow-hidden rounded-xl border border-white/5 bg-card/60 p-4 shadow-xl backdrop-blur-md transition-all hover:border-white/10 hover:bg-card">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.iconBg} shadow-lg ${s.glow}`}>
                      <s.icon className={`h-4 w-4 ${s.color}`} />
                    </div>
                  </div>
                  <p className={`text-3xl font-bold tracking-tight ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className={`lg:col-span-2 ${CARD_CLS}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-foreground">Активність за період</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">30 березня — 12 квітня · кількість активних учнів</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={activityData}>
                      <defs>
                        <linearGradient id="grad-emerald" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4ade80" />
                          <stop offset="100%" stopColor="#16a34a" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                      <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke={AXIS_STROKE} />
                      <YAxis tick={{ fontSize: 10 }} stroke={AXIS_STROKE} />
                      <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={TOOLTIP_STYLE} />
                      <Bar dataKey="active" fill="url(#grad-emerald)" radius={[4, 4, 0, 0]} name="Активних" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className={CARD_CLS}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-foreground">Пристрої</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Розподіл по типах</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={deviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" stroke="#18181b" strokeWidth={2}>
                        {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Legend wrapperStyle={{ fontSize: 11, color: "#a1a1aa" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Progress by class + Topics */}
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className={CARD_CLS}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-foreground">Прогрес по класах</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Середній % виконаних завдань</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={380}>
                    <BarChart data={progressByClass} layout="vertical">
                      <defs>
                        <linearGradient id="grad-emerald-h" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#16a34a" />
                          <stop offset="100%" stopColor="#4ade80" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} stroke={AXIS_STROKE} />
                      <YAxis dataKey="class" type="category" tick={{ fontSize: 10 }} stroke={AXIS_STROKE} width={58} />
                      <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={TOOLTIP_STYLE} />
                      <Bar dataKey="progress" fill="url(#grad-emerald-h)" radius={[0, 4, 4, 0]} name="Прогрес %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className={CARD_CLS}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-foreground">Популярність тем</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Кількість виконаних завдань</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={topicStats} layout="vertical">
                      <defs>
                        <linearGradient id="grad-blue-h" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#60a5fa" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 10 }} stroke={AXIS_STROKE} />
                      <YAxis dataKey="topic" type="category" tick={{ fontSize: 10 }} stroke={AXIS_STROKE} width={55} />
                      <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={TOOLTIP_STYLE} />
                      <Bar dataKey="completed" fill="url(#grad-blue-h)" radius={[0, 4, 4, 0]} name="Виконано" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Період підсумки */}
            <Card className={CARD_CLS}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  Підсумки періоду
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">30 березня — 12 квітня 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className={TILE_CLS}>
                    <p className="text-2xl font-bold text-primary">647</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Сесій навчання</p>
                  </div>
                  <div className={TILE_CLS}>
                    <p className="text-2xl font-bold text-green-400">289</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Завершених завдань</p>
                  </div>
                  <div className={TILE_CLS}>
                    <p className="text-2xl font-bold text-blue-400">54г</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Сумарний час</p>
                  </div>
                  <div className={TILE_CLS}>
                    <p className="text-2xl font-bold text-amber-400">42</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Офлайн сесій</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* ── CLASSES TAB ── */}
        {activeTab === "classes" && (
          <>
            {!selectedClass ? (
              <div className="space-y-3">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Всі класи</h2>
                {classesData.map((cls) => (
                  <Card key={cls.id} className={CARD_HOVER_CLS} onClick={() => setSelectedClass(cls.id)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{cls.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{cls.topic}</p>
                        </div>
                        <Badge className="border-primary/30 bg-primary/10 text-primary">{cls.avgScore} балів</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                        <div>
                          <p className="text-lg font-bold text-primary">{cls.totalStudents}</p>
                          <p className="text-xs text-muted-foreground">Учнів</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-green-400">{cls.activeStudents}</p>
                          <p className="text-xs text-muted-foreground">Активних</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-blue-400">{cls.avgProgress}%</p>
                          <p className="text-xs text-muted-foreground">Прогрес</p>
                        </div>
                      </div>
                      <Progress value={cls.avgProgress} className="h-1.5 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-primary" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : showStudentDetail && selectedStudent ? (
              /* Student detail */
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setShowStudentDetail(false)} className="text-muted-foreground hover:text-foreground hover:bg-white/5">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Назад до класу
                </Button>
                <Card className={CARD_CLS}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-lg ring-1 ring-primary/20">
                          {selectedStudent.name.charAt(0)}
                        </div>
                        <div>
                          <CardTitle className="text-foreground">{selectedStudent.name}</CardTitle>
                          <CardDescription className="text-muted-foreground">{selectedStudent.className} · {selectedStudent.currentTask}</CardDescription>
                        </div>
                      </div>
                      <Badge className={selectedStudent.progress >= 90 ? "border-primary/30 bg-primary/10 text-primary" : "border-white/10 bg-white/5 text-foreground/90"}>
                        {selectedStudent.progress}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        { icon: Clock, label: "Час навчання", value: selectedStudent.totalTime, color: "text-primary" },
                        { icon: CheckCircle2, label: "Завдань", value: `${selectedStudent.tasksCompleted}/${selectedStudent.totalTasks}`, color: "text-green-400" },
                        { icon: Bot, label: "AI запити", value: selectedStudent.aiRequestsCount, color: "text-amber-400" },
                        { icon: WifiOff, label: "Офлайн сесій", value: selectedStudent.offlineSessions, color: "text-blue-400" },
                      ].map((s) => (
                        <div key={s.label} className={TILE_CLS}>
                          <s.icon className={`h-4 w-4 ${s.color} mx-auto mb-1.5`} />
                          <p className="text-lg font-bold text-foreground">{s.value}</p>
                          <p className="text-xs text-muted-foreground">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2 text-foreground/90">Загальний прогрес</p>
                      <Progress value={selectedStudent.progress} className="h-2 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-primary" />
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2 text-foreground/90">Сесії навчання</p>
                      <div className="space-y-2">
                        {selectedStudent.sessions.map((s: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-white/5 bg-white/[0.03]">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-muted-foreground">{s.date}</span>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Smartphone className="h-3 w-3" />
                                {s.device}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {s.city}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium text-primary">
                              <Timer className="h-3 w-3" />
                              {s.duration} хв
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Class students list */
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedClass(null)} className="text-muted-foreground hover:text-foreground hover:bg-white/5">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Всі класи
                  </Button>
                  <span className="text-sm font-semibold text-foreground">{currentClass?.name}</span>
                </div>
                {currentClass?.students.map((student) => (
                  <Card key={student.id} className={CARD_HOVER_CLS}
                    onClick={() => { setSelectedStudent(student); setShowStudentDetail(true) }}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm shrink-0 ring-1 ring-primary/20">
                          {student.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium truncate text-foreground">{student.name}</p>
                            <span className="text-xs font-mono text-primary ml-2 shrink-0">{student.progress}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{student.currentTask}</p>
                          <Progress value={student.progress} className="h-1 mt-1.5 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-primary" />
                        </div>
                        <div className="text-right shrink-0 hidden sm:block">
                          <p className="text-xs text-muted-foreground">{student.lastActivity}</p>
                          <p className="text-xs text-muted-foreground">{student.totalTime}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── AI ASSISTANT TAB ── */}
        {activeTab === "ai" && <AIControlCenter />}

        {/* ── ASSIGNMENTS TAB ── */}
        {activeTab === "assignments" && <AssignmentCreator />}

        {/* ── ACTIVITY TAB ── */}
        {activeTab === "activity" && (
          <div className="space-y-4">
            <Card className={CARD_CLS}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                  <Eye className="h-4 w-4 text-primary" />
                  Активність за період
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">30 березня — 12 квітня 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={TILE_CLS}>
                    <WifiOff className="h-5 w-5 text-amber-400 mx-auto mb-1.5" />
                    <p className="text-xl font-bold text-foreground">42</p>
                    <p className="text-xs text-muted-foreground">Офлайн сесій за період</p>
                  </div>
                  <div className={TILE_CLS}>
                    <EyeOff className="h-5 w-5 text-blue-400 mx-auto mb-1.5" />
                    <p className="text-xl font-bold text-foreground">18г</p>
                    <p className="text-xs text-muted-foreground">Загальний офлайн час</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={activityData}>
                    <defs>
                      <linearGradient id="grad-emerald-2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4ade80" />
                        <stop offset="100%" stopColor="#16a34a" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke={AXIS_STROKE} />
                    <YAxis tick={{ fontSize: 10 }} stroke={AXIS_STROKE} />
                    <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={TOOLTIP_STYLE} />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#a1a1aa" }} />
                    <Bar dataKey="active" fill="url(#grad-emerald-2)" radius={[4, 4, 0, 0]} name="Активних учнів" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className={CARD_CLS}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-foreground">Активність по годинах</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Типовий розподіл за добу (усереднено)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={hourlyActivity}>
                    <defs>
                      <linearGradient id="grad-blue-2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke={AXIS_STROKE} />
                    <YAxis tick={{ fontSize: 10 }} stroke={AXIS_STROKE} />
                    <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="active" fill="url(#grad-blue-2)" radius={[4, 4, 0, 0]} name="Учнів онлайн" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className={CARD_CLS}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-foreground">Остання активність</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Події за 12 квітня 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { time: "12.04 15:42", student: "Бондаренко А.", action: "Завершив завдання", class: "8-А" },
                    { time: "12.04 15:30", student: "Коваленко Т.", action: "Запитав AI підказку", class: "9-Б" },
                    { time: "12.04 15:10", student: "Даниленко В.", action: "Розпочав новий модуль", class: "9-А" },
                    { time: "12.04 14:55", student: "Захарченко В.", action: "Завершив фінальний проєкт SQL", class: "11-А" },
                    { time: "11.04 18:20", student: "Гриценко М.", action: "Отримав досягнення", class: "8-А" },
                    { time: "11.04 16:05", student: "Литвиненко А.", action: "Завершив тему 'DOM-події'", class: "11-Б" },
                    { time: "10.04 14:40", student: "Дмитренко А.", action: "Розпочав завдання", class: "5-А (1 підгр.)" },
                  ].map((e, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-white/5 bg-white/[0.03] transition-colors hover:bg-white/[0.06]">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_8px_var(--primary)]" />
                      <span className="font-mono text-xs text-muted-foreground shrink-0">{e.time}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-foreground">{e.student}</span>
                        <span className="text-xs text-muted-foreground ml-2">{e.action}</span>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0 border-white/10 bg-white/5 text-muted-foreground">{e.class}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── ARCHIVE TAB ── */}
        {activeTab === "archive" && (
          <div className="space-y-4">
            <Card className={CARD_CLS}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  Архів даних
                </CardTitle>
                <CardDescription className="text-muted-foreground">Статистика попередніх навчальних періодів</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-white/10 bg-white/5 text-foreground hover:bg-white/10 hover:text-foreground" asChild>
                  <Link href="/teacher/practice-2025?code=Teacher443">
                    <BookOpen className="mr-2 h-4 w-4 text-primary" />
                    Практика 2025 — 83 учні, 3 класи (повна статистика)
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Детальна статистика з діаграмами, прогресом учнів та аналітикою по пристроях.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-primary/20 bg-primary/5 shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Майбутнє оновлення
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Після підключення Supabase тут з&apos;являться реальні дані учнів:</p>
                <ul className="space-y-1.5 ml-1">
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Реальні результати навчання</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Автоматичні звіти по класах</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Експорт в Excel/PDF</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}