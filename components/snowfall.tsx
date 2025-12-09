"use client"

import { useEffect, useState } from "react"

export function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([])

  useEffect(() => {
    // Генеруємо сніжинки тільки в грудні
    const currentMonth = new Date().getMonth()
    if (currentMonth === 11) { // 11 = грудень
      const flakes = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 10,
      }))
      setSnowflakes(flakes)
    }
  }, [])

  if (snowflakes.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute text-white opacity-70"
          style={{
            left: `${flake.left}%`,
            top: '-10px',
            animation: `snowfall ${flake.duration}s linear ${flake.delay}s infinite`,
            fontSize: '1rem',
          }}
        >
          ❄
        </div>
      ))}
    </div>
  )
}
