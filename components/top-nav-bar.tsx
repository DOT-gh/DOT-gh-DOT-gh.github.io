"use client"

import { Menu, Settings, User, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SettingsModal } from "@/components/settings-modal"
import { ProfileModal } from "@/components/profile-modal"
import { useState } from "react"
import { useApp } from "@/lib/store"

export function TopNavBar() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { setSelectedTask, setSelectedCourse, userProfile } = useApp()

  return (
    <>
      <nav className="h-16 border-b bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedTask(null)
              setSelectedCourse(null)
            }}
          >
            <Home className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Edu Survival Kit</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 mr-4">
            <span className="text-sm text-muted-foreground">
              {userProfile.name}
            </span>
            <span className="text-sm font-semibold">
              {userProfile.points} pts
            </span>
          </div>
          
          <Button variant="ghost" size="icon" onClick={() => setProfileOpen(true)}>
            <User className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  )
}
