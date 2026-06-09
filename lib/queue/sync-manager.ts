import { createClient } from '@/lib/supabase/client'
import { eventQueue, type QueuedEvent } from './event-queue'

type SyncHandler = (event: QueuedEvent) => Promise<void>
type NetworkStatus = 'online' | 'offline'

export class SyncManager {
  private isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
  private isSyncing = false
  private syncHandlers = new Map<string, SyncHandler>()
  private listeners: Array<(status: NetworkStatus) => void> = []

  constructor() {
    this.setupNetworkListeners()
    this.registerDefaultHandlers()
  }

  private setupNetworkListeners(): void {
    if (typeof window === 'undefined') return

    window.addEventListener('online', () => this.handleOnline())
    window.addEventListener('offline', () => this.handleOffline())

    setInterval(() => this.checkConnection(), 30_000)
  }

  private handleOnline(): void {
    this.isOnline = true
    this.notifyListeners('online')
    void this.sync()
  }

  private handleOffline(): void {
    this.isOnline = false
    this.notifyListeners('offline')
  }

  private checkConnection(): void {
    if (typeof navigator === 'undefined') return

    const wasOnline = this.isOnline
    this.isOnline = navigator.onLine

    if (!wasOnline && this.isOnline) {
      this.handleOnline()
    } else if (wasOnline && !this.isOnline) {
      this.handleOffline()
    }
  }

  registerHandler(eventType: string, handler: SyncHandler): void {
    this.syncHandlers.set(eventType, handler)
  }

  private registerDefaultHandlers(): void {
    this.registerHandler('profile_update', async (event) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update(event.payload)
        .eq('id', event.payload.id)

      if (error) throw new Error(error.message)
    })

    this.registerHandler('progress_save', async (event) => {
      const supabase = createClient()
      const { error } = await supabase.from('user_progress').upsert(event.payload)

      if (error) throw new Error(error.message)
    })

    this.registerHandler('achievement_unlock', async (event) => {
      const supabase = createClient()
      const { error } = await supabase.from('achievements').insert([event.payload])

      if (error) throw new Error(error.message)
    })

    this.registerHandler('code_save', async (event) => {
      const supabase = createClient()
      const { error } = await supabase.from('user_code').upsert(event.payload)

      if (error) throw new Error(error.message)
    })
  }

  async sync(): Promise<void> {
    if (this.isSyncing || !this.isOnline) return

    this.isSyncing = true

    try {
      const events = eventQueue.getAll()

      for (const event of events) {
        const handler = this.syncHandlers.get(event.type)
        if (!handler) {
          eventQueue.remove(event.id)
          continue
        }

        try {
          await handler(event)
          eventQueue.remove(event.id)
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          const exceeded = eventQueue.incrementRetry(event.id, message)

          if (exceeded) {
            console.error(`[SyncManager] Max retries exceeded for event: ${event.id}`)
            eventQueue.remove(event.id)
          }
        }
      }
    } finally {
      this.isSyncing = false
    }
  }

  onStatusChange(callback: (status: NetworkStatus) => void): () => void {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback)
    }
  }

  getStatus(): NetworkStatus {
    return this.isOnline ? 'online' : 'offline'
  }

  private notifyListeners(status: NetworkStatus): void {
    this.listeners.forEach((listener) => listener(status))
  }
}

export const syncManager = new SyncManager()
