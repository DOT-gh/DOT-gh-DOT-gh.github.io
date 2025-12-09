"use client"

import { TopNavBar } from "@/components/top-nav-bar"
import { TaskSidebar } from "@/components/task-sidebar"
import { CodeEditor } from "@/components/code-editor"
import { AiTutorChat } from "@/components/ai-tutor-chat"
import { Dashboard } from "@/components/dashboard"
import { Snowfall } from "@/components/snowfall"
import { DevToolsBlocker } from "@/components/dev-tools-blocker"
import { useApp } from "@/lib/store"

export default function Home() {
  const { selectedTask } = useApp()

  return (
    <main className="min-h-screen bg-background">
      <DevToolsBlocker />
      <Snowfall />
      <TopNavBar />
      
      <div className="flex h-[calc(100vh-64px)]">
        {selectedTask ? (
          <>
            <TaskSidebar />
            <div className="flex-1 flex flex-col lg:flex-row">
              <CodeEditor />
              <AiTutorChat />
            </div>
          </>
        ) : (
          <Dashboard />
        )}
      </div>
    </main>
  )
}
