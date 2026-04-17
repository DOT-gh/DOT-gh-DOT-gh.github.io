"use client"

import { useEffect, useState } from "react"
import { BatteryWarning, X, Zap } from "lucide-react"
import { useAppState } from "@/lib/store"

// Колекція дружніх повідомлень — щоразу інше. Формулювання гендерно-нейтральні.
const LOW_BATTERY_MESSAGES = [
  {
    title: "Агов, заряд тікає!",
    body: "У тебе менше 15% — постав на зарядку, поки є така можливість. Якщо світла нема — не парся, твій прогрес автосейвиться. ПЖ, подбай про батарею!",
  },
  {
    title: "Слухай, батарея на нулі скоро!",
    body: "Менше 15% залишилось — тікай до зарядки. Нема світла? Спок, все збережеться автоматом, тренуйся далі без стресу.",
  },
  {
    title: "Ей, справа серйозна",
    body: "Заряд критичний (<15%). Постав на зарядку якщо можеш. Якщо блекаут — то й нехай, твої задачі не загубляться, обіцяю. Дихай спокійно.",
  },
  {
    title: "Йо, зарядка нада!",
    body: "Батарейка ось-ось сяде. Шукай розетку, поки не пізно. А нема — то й нічо страшного, прогрес у надійному місці. Продовжуй коли буде змога, ок?",
  },
  {
    title: "Увага, 15% і падає",
    body: "Час подбати про зарядку. Нема світла чи розетки? Без паніки — ні одна буква коду не згубиться, все збереглось. Просто не забудь потім.",
  },
  {
    title: "Гей, батарея в зоні ризику",
    body: "Менше 15% — кинь на зарядку, якщо є така можливість. Якщо нема — то й нічо, твоя робота в безпеці, все автосейвиться на пристрої.",
  },
]

export function LowBatteryAlert() {
  const { batteryLevel } = useAppState()
  const [dismissed, setDismissed] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)

  // Скидаємо стан "закрито" коли батарея знову вище 15%
  useEffect(() => {
    if (batteryLevel > 15) {
      setDismissed(false)
    } else if (batteryLevel <= 15 && !dismissed) {
      // Вибираємо нове повідомлення кожен раз коли батарея падає
      setMessageIndex(Math.floor(Math.random() * LOW_BATTERY_MESSAGES.length))
    }
  }, [batteryLevel, dismissed])

  if (batteryLevel > 15 || dismissed) return null

  const message = LOW_BATTERY_MESSAGES[messageIndex]

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-[60] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="rounded-lg border-2 border-destructive/60 bg-card shadow-2xl overflow-hidden">
        {/* Шапка */}
        <div className="flex items-start gap-3 p-3 bg-destructive/10">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-destructive/20">
            <BatteryWarning className="h-5 w-5 text-destructive" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-destructive">{message.title}</p>
              <span className="rounded-full bg-destructive/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-destructive">
                {batteryLevel}%
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-foreground/90">{message.body}</p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Закрити"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Футер із порадою */}
        <div className="flex items-center gap-2 border-t border-border bg-secondary/40 px-3 py-2">
          <Zap className="h-3 w-3 shrink-0 text-amber-500" />
          <p className="text-[11px] text-muted-foreground">
            Tip: у <span className="font-semibold text-foreground">офлайн-режимі</span> заряд тримається довше — спробуй
            вимкнути Wi-Fi
          </p>
        </div>
      </div>
    </div>
  )
}
