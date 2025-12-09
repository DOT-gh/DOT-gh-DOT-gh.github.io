"use client"

import { useAppState } from "@/lib/store"
import { TopNavBar } from "@/components/top-nav-bar"
import { TaskSidebar } from "@/components/task-sidebar"
import { CodeEditor } from "@/components/code-editor"
import { AiTutorChat } from "@/components/ai-tutor-chat"
import { Dashboard } from "@/components/dashboard"
import { SettingsModal } from "@/components/settings-modal"
import { ProfileModal } from "@/components/profile-modal"

export default function HomePage() {
  const { currentView, showSettings, showProfile } = useAppState()

  return (
    <div className="flex h-screen flex-col bg-background">
      <TopNavBar />

      {currentView === "dashboard" && <Dashboard />}

      {currentView === "learning" && (
        <div className="flex flex-1 overflow-hidden">
          <TaskSidebar />
          <CodeEditor />
          <AiTutorChat />
        </div>
      )}

      {/* Modals */}
      {showSettings && <SettingsModal />}
      {showProfile && <ProfileModal />}
    </div>
  )
}
