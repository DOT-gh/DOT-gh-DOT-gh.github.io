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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

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

      {currentView === "dashboard" && (
        <div data-tour="dashboard" className="flex-1 overflow-auto">
          <Dashboard />
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
