"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw } from "lucide-react"
import { useApp } from "@/lib/store"
import { TestCodeModal } from "@/components/test-code-modal"

export function CodeEditor() {
  const { selectedTask } = useApp()
  const [code, setCode] = useState(`// Напишіть ваш код тут
function solution() {
  // TODO: реалізуйте рішення
}`)
  const [testModalOpen, setTestModalOpen] = useState(false)

  useEffect(() => {
    // Підсвітка синтаксису (базова)
    const textarea = document.getElementById('code-textarea') as HTMLTextAreaElement
    if (textarea) {
      textarea.style.fontFamily = 'monospace'
      textarea.style.fontSize = '14px'
      textarea.style.lineHeight = '1.5'
    }
  }, [])

  const handleRun = () => {
    setTestModalOpen(true)
  }

  const handleReset = () => {
    setCode(`// Напишіть ваш код тут
function solution() {
  // TODO: реалізуйте рішення
}`)
  }

  return (
    <>
      <div className="flex-1 flex flex-col bg-background">
        <div className="border-b p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{selectedTask?.title}</h3>
            <p className="text-sm text-muted-foreground">{selectedTask?.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Скинути
            </Button>
            <Button size="sm" onClick={handleRun}>
              <Play className="h-4 w-4 mr-2" />
              Запустити
            </Button>
          </div>
        </div>

        <Tabs defaultValue="code" className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-4 w-fit">
            <TabsTrigger value="code">Код</TabsTrigger>
            <TabsTrigger value="instructions">Інструкції</TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="flex-1 p-4 mt-0">
            <textarea
              id="code-textarea"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full resize-none bg-muted/50 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-ring"
              spellCheck={false}
            />
          </TabsContent>

          <TabsContent value="instructions" className="flex-1 p-4 mt-0 overflow-y-auto">
            <div className="prose dark:prose-invert max-w-none">
              <h4>Опис завдання</h4>
              <p>{selectedTask?.description}</p>
              
              <h4>Вимоги</h4>
              <ul>
                <li>Реалізуйте функцію відповідно до опису</li>
                <li>Переконайтеся, що всі тести проходять</li>
                <li>Використовуйте правильний синтаксис JavaScript</li>
              </ul>

              <h4>Приклад</h4>
              <pre className="bg-muted p-4 rounded-lg">
{`function example() {
  return "Hello, World!";
}`}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <TestCodeModal 
        open={testModalOpen} 
        onOpenChange={setTestModalOpen}
        code={code}
      />
    </>
  )
}
