"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useApp } from "@/lib/store"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { darkMode, offlineMode, aiEnabled, toggleDarkMode, toggleOfflineMode, toggleAI } = useApp()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Налаштування</DialogTitle>
          <DialogDescription>
            Персоналізуйте ваш досвід навчання
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Темна тема (OLED)</Label>
              <p className="text-sm text-muted-foreground">
                Економить батарею на OLED екранах
              </p>
            </div>
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Офлайн режим</Label>
              <p className="text-sm text-muted-foreground">
                Кешування контенту для роботи без інтернету
              </p>
            </div>
            <Switch checked={offlineMode} onCheckedChange={toggleOfflineMode} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>AI асистент</Label>
              <p className="text-sm text-muted-foreground">
                Локальний AI для допомоги з кодом
              </p>
            </div>
            <Switch checked={aiEnabled} onCheckedChange={toggleAI} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
