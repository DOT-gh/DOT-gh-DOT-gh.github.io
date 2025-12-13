"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FloatingAIButtonProps {
  onClick: () => void
  isOpen: boolean
}

export function FloatingAIButton({ onClick, isOpen }: FloatingAIButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      className={cn("fab ripple", isOpen && "bg-destructive")}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={isOpen ? "Закрити ШІ-чат" : "Відкрити ШІ-чат"}
    >
      {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className={cn("h-6 w-6", isHovered && "icon-breathe")} />}

      {/* Tooltip */}
      {isHovered && !isOpen && (
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded whitespace-nowrap">
          Запитати ШІ-тьютора
        </span>
      )}
    </button>
  )
}
