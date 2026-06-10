"use client"

import { useState } from "react"
import { RotateCw } from "lucide-react"

const CARDS = [
  { term: "Змінна", def: "Іменована комірка памʼяті, що зберігає значення. Напр.: let age = 14" },
  { term: "Функція", def: "Блок коду, який можна викликати багато разів за іменем." },
  { term: "Масив", def: "Впорядкований список значень: [10, 20, 30]." },
  { term: "Цикл", def: "Конструкція, що повторює дії, поки виконується умова." },
  { term: "Умова (if)", def: "Виконує код лише тоді, коли вираз істинний (true)." },
  { term: "Обʼєкт", def: "Набір пар «ключ: значення», напр.: { name: 'Іван', age: 14 }." },
]

function FlipCard({ term, def }: { term: string; def: string }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      className="group relative h-32 w-full text-left [perspective:1000px]"
      aria-label={`Картка: ${term}`}
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Лицо */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-border bg-card p-3 [backface-visibility:hidden]">
          <span className="text-base font-semibold text-foreground">{term}</span>
          <span className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
            <RotateCw className="h-3 w-3" />
            натисни, щоб дізнатись
          </span>
        </div>
        {/* Оборот */}
        <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-primary/30 bg-primary/[0.06] p-3 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="text-xs leading-relaxed text-foreground">{def}</span>
        </div>
      </div>
    </button>
  )
}

export function DemoFlashcards() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {CARDS.map((c) => (
        <FlipCard key={c.term} {...c} />
      ))}
    </div>
  )
}
