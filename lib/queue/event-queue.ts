// lib/queue/event-queue.ts
export type QueuedEvent = {
  id: string
  type: 'profile_update' | 'progress_save' | 'achievement_unlock' | 'code_save'
  payload: any
  timestamp: number
  retries: number
  lastError?: string
}

export class EventQueue {
  private queue: QueuedEvent[] = []
  private readonly STORAGE_KEY = 'dot-kit-event-queue'
  private readonly MAX_RETRIES = 3

  constructor() {
    this.loadFromStorage()
  }

  // Добавить событие в очередь
  add(type: QueuedEvent['type'], payload: any): string {
    const event: QueuedEvent = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      payload,
      timestamp: Date.now(),
      retries: 0,
    }

    this.queue.push(event)
    this.saveToStorage()
    console.log(`[Queue] Added: ${event.id}`, { type, payload })
    return event.id
  }

  // Получить всю очередь
  getAll(): QueuedEvent[] {
    return [...this.queue]
  }

  // Удалить событие из очереди (после успешной отправки)
  remove(id: string): void {
    this.queue = this.queue.filter((e) => e.id !== id)
    this.saveToStorage()
    console.log(`[Queue] Removed: ${id}`)
  }

  // Увеличить счетчик попыток
  incrementRetry(id: string, error?: string): void {
    const event = this.queue.find((e) => e.id === id)
    if (event) {
      event.retries++
      event.lastError = error
      this.saveToStorage()
      console.log(`[Queue] Retry ${event.retries}/${this.MAX_RETRIES}: ${id}`, error)
    }
  }

  // Очистить очередь
  clear(): void {
    this.queue = []
    this.saveToStorage()
    console.log('[Queue] Cleared')
  }

  // Сохранить в localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue))
    } catch (e) {
      console.error('[Queue] Failed to save:', e)
    }
  }

  // Загрузить из localStorage
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        this.queue = JSON.parse(stored)
        console.log(`[Queue] Loaded ${this.queue.length} events from storage`)
      }
    } catch (e) {
      console.error('[Queue] Failed to load:', e)
      this.queue = []
    }
  }
}

// Singleton
export const eventQueue = new EventQueue()
