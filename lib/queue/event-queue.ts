export type QueuedEventType =
  | 'profile_update'
  | 'progress_save'
  | 'achievement_unlock'
  | 'code_save'

export type QueuedEvent = {
  id: string
  type: QueuedEventType
  payload: Record<string, unknown>
  timestamp: number
  retries: number
  lastError?: string
}

const STORAGE_KEY = 'dot-kit-event-queue'
const MAX_RETRIES = 3

export class EventQueue {
  private queue: QueuedEvent[] = []

  constructor() {
    this.loadFromStorage()
  }

  add(type: QueuedEventType, payload: Record<string, unknown>): string {
    const event: QueuedEvent = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type,
      payload,
      timestamp: Date.now(),
      retries: 0,
    }

    this.queue.push(event)
    this.saveToStorage()
    return event.id
  }

  getAll(): QueuedEvent[] {
    return [...this.queue]
  }

  getPendingCount(): number {
    return this.queue.length
  }

  remove(id: string): void {
    this.queue = this.queue.filter((e) => e.id !== id)
    this.saveToStorage()
  }

  incrementRetry(id: string, error?: string): boolean {
    const event = this.queue.find((e) => e.id === id)
    if (!event) return false

    event.retries++
    event.lastError = error
    this.saveToStorage()
    return event.retries >= MAX_RETRIES
  }

  clear(): void {
    this.queue = []
    this.saveToStorage()
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue))
    } catch (e) {
      console.error('[EventQueue] Failed to save:', e)
    }
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        this.queue = JSON.parse(stored) as QueuedEvent[]
      }
    } catch (e) {
      console.error('[EventQueue] Failed to load:', e)
      this.queue = []
    }
  }
}

export const eventQueue = new EventQueue()
