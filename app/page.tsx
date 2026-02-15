"use client"

import { useState, useEffect } from "react"
import { useAppState } from "@/lib/store"
import { TopNavBar } from "@/components/top-nav-bar"
import { TaskSidebar } from "@/components/task-sidebar"
import { CodeEditor } from "@/components/code-editor-enhanced"
import AITutorEnhanced from "@/components/ai-tutor-enhanced"
import { Dashboard } from "@/components/dashboard"
import { SettingsModal } from "@/components/settings-modal"
import { ProfileModal } from "@/components/profile-modal"
import OnboardingTour from "@/components/onboarding-tour"
import KeyboardShortcuts from "@/components/keyboard-shortcuts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function HomePage() {
  const {
    currentView,
    showSettings,
    showProfile,
    selectedCourse,
    selectedTask,
    code,
    setCode,
    messages,
    addMessage,
    clearMessages,
  } = useAppState()
  const [isLoading, setIsLoading] = useState(true)
  const [showGrade8Login, setShowGrade8Login] = useState(false)
  const [studentName, setStudentName] = useState("")
  const [studentSurname, setStudentSurname] = useState("")
  const [studentClass, setStudentClass] = useState("")

  useEffect(() => {
    // Check if student needs to login for grade 8
    const grade8Name = localStorage.getItem("grade8_student_name")
    if (!grade8Name) {
      setShowGrade8Login(false) // Показуємо форму тільки якщо клікнуть на курс 8 класу
    }
    
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleGrade8Login = () => {
    if (studentName && studentSurname && studentClass) {
      localStorage.setItem("grade8_student_name", studentName)
      localStorage.setItem("grade8_student_surname", studentSurname)
      localStorage.setItem("grade8_student_class", studentClass)
      window.location.href = "/grade8"
    }
  }

  const handleSearch = (query: string) => {
    console.log("[v0] Search query:", query)
    // TODO: Implement search functionality
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Завантаження...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <TopNavBar />

      {/* Grade 8 Login Modal */}
      {showGrade8Login && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Вхід до завдання 8 класу</CardTitle>
              <CardDescription>Введи своє ім'я, прізвище та клас для початку</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ім'я</Label>
                <Input
                  id="name"
                  placeholder="Іван"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname">Прізвище</Label>
                <Input
                  id="surname"
                  placeholder="Коваленко"
                  value={studentSurname}
                  onChange={(e) => setStudentSurname(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Клас</Label>
                <Input
                  id="class"
                  placeholder="8-А"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowGrade8Login(false)}>
                  Скасувати
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleGrade8Login}
                  disabled={!studentName || !studentSurname || !studentClass}
                >
                  Почати
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentView === "dashboard" && (
        <div data-tour="dashboard" className="flex-1 overflow-auto">
          <Dashboard onGrade8Click={() => setShowGrade8Login(true)} />
        </div>
      )}

      {currentView === "learning" && (
        <div className="flex flex-1 overflow-hidden">
          <TaskSidebar />
          <div className="flex flex-1 overflow-hidden" data-tour="code-editor">
            <CodeEditor />
          </div>
          <div data-tour="ai-tutor">
            <AITutorEnhanced
              currentExercise={selectedTask}
              code={code}
              messages={messages}
              addMessage={addMessage}
              clearMessages={clearMessages}
            />
          </div>
        </div>
      )}

      {showSettings && <SettingsModal />}
      {showProfile && <ProfileModal />}

      <KeyboardShortcuts onSearch={handleSearch} />

      <OnboardingTour />
    </div>
  )
}
