"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Users, Clock, CheckCircle, WifiOff, Brain, MapPin, Smartphone } from "lucide-react"

export default function StatisticsPage() {
  // Реальні дані з опитування
  const totalStudents = 72
  const activeStudents = 33
  const avgTimePerTask = 12
  const completedTasks = 88
  const offlineSessions = 76

  // Дані по класах (реальні)
  const classesData = [
    {
      name: "7-А (НУШ)",
      topic: "Алгоритми Scratch",
      avgGrade: 9.2,
      progress: 94,
      students: 30,
      boys: 16,
      girls: 14,
      quality: 83,
    },
    {
      name: "10-А (Інформатика)",
      topic: "Мережеві технології",
      avgGrade: 8.7,
      progress: 82,
      students: 22,
      boys: 13,
      girls: 9,
      quality: 77,
    },
    {
      name: "11-Б (Стандарт)",
      topic: "Веб-дизайн",
      avgGrade: 10.1,
      progress: 100,
      students: 20,
      boys: 9,
      girls: 11,
      quality: 90,
    },
  ]

  // Активність по днях (17-23 грудня)
  const activityData = [
    { date: "17.12", online: 28, offline: 5, total: 33 },
    { date: "18.12", online: 15, offline: 8, total: 23 },
    { date: "19.12", online: 18, offline: 7, total: 25 },
    { date: "20.12", online: 12, offline: 6, total: 18 },
    { date: "21.12", online: 10, offline: 9, total: 19 },
    { date: "22.12", online: 14, offline: 8, total: 22 },
    { date: "23.12", online: 20, offline: 11, total: 31 },
  ]

  // AI асистент статистика
  const aiRequestsTotal = 142
  const aiEfficiency = 92
  const aiTopics = [
    { name: "Синтаксис Python", value: 45, percent: 32 },
    { name: "Виправлення помилок", value: 52, percent: 37 },
    { name: "Пояснення умови", value: 30, percent: 21 },
    { name: "Інше", value: 15, percent: 10 },
  ]

  // Географія
  const locationData = [
    { name: "Сумська обл.", value: 65, color: "#22c55e" },
    { name: "ВПО/За кордоном", value: 35, color: "#60a5fa" },
  ]

  // Пристрої
  const deviceData = [
    { name: "Mobile", value: 85, color: "#a78bfa" },
    { name: "Desktop", value: 15, color: "#fbbf24" },
  ]

  const COLORS = ["#22c55e", "#60a5fa", "#a78bfa", "#fbbf24"]

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Статистика платформи</h1>
          <p className="text-gray-400">Реальні дані з педагогічної практики (03.11.2025 - 21.11.2025)</p>
        </div>

        {/* Верхня панель - Загальні показники */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Всього учнів</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-gray-500">Активних: {activeStudents}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Середній час</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgTimePerTask} хв</div>
              <p className="text-xs text-green-500">↓ на 15% vs підручник</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Завершено</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks}%</div>
              <p className="text-xs text-gray-500">завдань виконано</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Офлайн-режим</CardTitle>
              <WifiOff className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{offlineSessions}%</div>
              <p className="text-xs text-gray-500">сесій без інтернету</p>
            </CardContent>
          </Card>
        </div>

        {/* Графік активності */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Активність учнів по днях</CardTitle>
            <CardDescription className="text-gray-400">
              17-23 грудня 2025 (остання тиждень перед дедлайном)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#fff" }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Legend />
                <Bar dataKey="online" name="Онлайн" fill="#60a5fa" />
                <Bar dataKey="offline" name="Офлайн/Кеш" fill="#6b7280" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-500 mt-4">
              Пік активності: 17 грудня (урок) та 23 грудня (дедлайн здачі завдань)
            </p>
          </CardContent>
        </Card>

        {/* Успішність класів */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classesData.map((cls, idx) => (
            <Card key={idx} className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">{cls.name}</CardTitle>
                <CardDescription className="text-gray-400">{cls.topic}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Середній бал</span>
                    <span className="font-bold text-green-500">{cls.avgGrade}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Прогрес</span>
                    <span className="font-bold">{cls.progress}%</span>
                  </div>
                  <Progress value={cls.progress} className="h-2" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Учнів</span>
                  <span>
                    {cls.students} ({cls.boys}Х / {cls.girls}Д)
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Якість знань</span>
                  <span className="text-green-500">{cls.quality}%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Асистент та Географія */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* AI Аналітика */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                <CardTitle>AI-Асистент Аналітика</CardTitle>
              </div>
              <CardDescription className="text-gray-400">Статистика використання ШІ-помічника</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">{aiRequestsTotal}</div>
                  <div className="text-sm text-gray-400">Запитів за тиждень</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">{aiEfficiency}%</div>
                  <div className="text-sm text-gray-400">Ефективність підказок</div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-300">Популярні теми запитів:</p>
                {aiTopics.map((topic, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{topic.name}</span>
                      <span>
                        {topic.value} ({topic.percent}%)
                      </span>
                    </div>
                    <Progress value={topic.percent * 2.5} className="h-1" />
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-4">92% учнів вирішили задачу після 1-ї підказки від ШІ</p>
            </CardContent>
          </Card>

          {/* Географія та пристрої */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Географія та Технічні дані</CardTitle>
              <CardDescription className="text-gray-400">Розподіл за локацією та пристроями</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Локація */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <p className="text-sm font-medium">Локація учнів</p>
                </div>
                <div className="space-y-2">
                  {locationData.map((loc, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{loc.name}</span>
                        <span>{loc.value}%</span>
                      </div>
                      <Progress value={loc.value} className="h-2" style={{ backgroundColor: "#374151" }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Пристрої */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone className="h-4 w-4 text-blue-500" />
                  <p className="text-sm font-medium">Пристрої</p>
                </div>
                <div className="space-y-2">
                  {deviceData.map((device, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{device.name}</span>
                        <span>{device.value}%</span>
                      </div>
                      <Progress value={device.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-3 text-sm space-y-1">
                <p className="text-gray-400">📱 85% Mobile (Android/iOS)</p>
                <p className="text-gray-400">💻 15% Desktop</p>
                <p className="text-gray-400">🌍 65% Сумська обл.</p>
                <p className="text-gray-400">✈️ 35% ВПО/За кордоном</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Детальна статистика опитування */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Результати опитування учнів</CardTitle>
            <CardDescription className="text-gray-400">33 відповіді з 72 учнів (46% response rate)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-300">Зрозумілість інтерфейсу</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Середня оцінка</span>
                    <span className="font-bold text-green-500">4.1 / 5</span>
                  </div>
                  <Progress value={82} className="h-2" />
                  <p className="text-xs text-gray-500">82% оцінили на 4-5 балів</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-300">Гейміфікація (мотивація)</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">"Дуже мотивує"</span>
                    <span className="font-bold">48%</span>
                  </div>
                  <Progress value={48} className="h-2" />
                  <p className="text-xs text-gray-500">16 з 33 учнів</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-300">Порівняння з підручником</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">"Набагато краще"</span>
                    <span className="font-bold text-green-500">58%</span>
                  </div>
                  <Progress value={58} className="h-2" />
                  <p className="text-xs text-gray-500">19 з 33 учнів</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h4 className="font-medium text-sm mb-3">Топ коментарі від учнів:</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>"Дмитро Олександрович ви топ чекаємо ще))" - 7-А</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>"зручно шо без інета робить" - 11-Б</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>"Краще ніж з підручника вчити. хоч якась практика" - 10-А</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">⚠</span>
                  <span>"ШІ іноді тупить" - 10-А</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>"Мені не зайшло скучно краще б в скретчі сиділи" - 7-А</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
