"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/store"
import { useState } from "react"
import { Trophy, Star, UserCircle } from "lucide-react"

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { userProfile, updateUserProfile } = useApp()
  const [name, setName] = useState(userProfile.name)
  const [email, setEmail] = useState(userProfile.email)

  const handleSave = () => {
    updateUserProfile({ name, email })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Мій профіль</DialogTitle>
          <DialogDescription>
            Переглядайте та редагуйте вашу інформацію
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <UserCircle className="h-12 w-12 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-2xl font-bold">{userProfile.points}</span>
              </div>
              <p className="text-xs text-muted-foreground">Очки</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <Star className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold">{userProfile.level}</span>
              </div>
              <p className="text-xs text-muted-foreground">Рівень</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ім'я</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">
            Зберегти зміни
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
