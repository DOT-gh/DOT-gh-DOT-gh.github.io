"use client"

import { useEffect, useState } from "react"
import confetti from "canvas-confetti"
import { useToast } from "@/hooks/use-toast"

export default function EasterEggs() {
  const { toast } = useToast()
  const [konamiCode, setKonamiCode] = useState<string[]>([])
  const [dmytroCounter, setDmytroCounter] = useState(0)

  const konamiSequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ]

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Konami Code Easter Egg
      const newSequence = [...konamiCode, e.key].slice(-10)
      setKonamiCode(newSequence)

      if (JSON.stringify(newSequence) === JSON.stringify(konamiSequence)) {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
        })
        toast({
          variant: "success",
          title: "Konami Code Activated!",
          description: "Ви знайшли пасхалку! 30+ років традиції живе.",
        })
        setKonamiCode([])
      }

      // "dmytro" Easter Egg
      if (e.key === "d" && dmytroCounter === 0) setDmytroCounter(1)
      else if (e.key === "m" && dmytroCounter === 1) setDmytroCounter(2)
      else if (e.key === "y" && dmytroCounter === 2) setDmytroCounter(3)
      else if (e.key === "t" && dmytroCounter === 3) setDmytroCounter(4)
      else if (e.key === "r" && dmytroCounter === 4) setDmytroCounter(5)
      else if (e.key === "o" && dmytroCounter === 5) {
        toast({
          variant: "success",
          title: "Привіт, Дмитре Олександровичу!",
          description: "Дякуємо за використання Edu Survival Kit. Ви знайшли секретну пасхалку!",
        })
        setDmytroCounter(0)
      } else {
        setDmytroCounter(0)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [konamiCode, dmytroCounter, toast])

  return null
}
