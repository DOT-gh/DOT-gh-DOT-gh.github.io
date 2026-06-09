// lib/queue/sync-manager.ts
import { eventQueue, QueuedEvent } from './event-queue'
import { supabaseClient } from '@/lib/supabase/client'

type SyncHandler = (event: QueuedEvent) => Promise<void>

export class SyncManager {
  private isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
  private isSyncing = false
  private syncHandlers: Map<string, SyncHandler> = new Map()
  private listeners: ((status: 'online' | 'offline') => void)[] = []

  constructor() {
    this.setupNetworkListeners()
    this.registerDefaultHandlers()
  }

  // Слушатели сети
  private setupNetworkListeners(): void {
    if (typeof window === 'undefined') return

    window.addEventListener('online', () => this.handleOnline())
    window.addEventListener('offline', () => this.handleOffline())

    // Периодическая проверка (на случай если событие не сработало)
    setInterval(() => this.checkConnection(), 30000)
  }

  private handleOnline(): void {
    console.log('[Sync] Network restored! 🌐')
    this.isOnline = true
    this.notifyListeners('online')
    this.sync()
  }

  private handleOffline(): void {
    console.log('[Sync] Network lost 📡')
    this.isOnline = false
    this.notifyListeners('offline')
  }

  private checkConnection(): void {
    const wasOnline = this.isOnline
    this.isOnline = navigator.onLine

    if (!wasOnline && this.isOnline) {
      this.handleOnline()
    } else if (wasOnline && !this.isOnline) {
      this.handleOffline()
    }
  }

  // Регистрация обработчиков
  registerHandler(eventType: string, handler: SyncHandler): void {
    this.syncHandlers.set(eventType, handler)
    console.log(`[Sync] Handler registered: ${eventType}`)
  }

  // Регистрация обработчиков по умолчанию
  private registerDefaultHandlers(): void {
    // Profile update
    this.registerHandler('profile_update', async (event) => {
      const supabase = await supabaseClient()
      const { data, error } = await supabase
        .from('profiles')
        .update(event.payload)
        .eq('id', event.payload.id)

      if (error) throw new Error(error.message)
      console.log('[Sync] Profile updated:', data)
    })

    // Progress save
    this.registerHandler('progress_save', async (event) => {
      const supabase = await supabaseClient()
      const { data, error } = await supabase
        .from('user_progress')
        .upsert(event.payload)

      if (error) throw new Error(error.message)
      console.log('[Sync] Progress saved:', data)
    })

    // Achievement unlock
    this.registerHandler('achievement_unlock', async (event) => {
      const supabase = await supabaseClient()
      const { data, error } = await supabase
        .from('achievements')
        .insert([event.payload])

      if (error) throw new Error(error.message)
      console.log('[Sync] Achievement unlocked:', data)
    })

    // Code save
    this.registerHandler('code_save', async (event) => {
      const supabase = await supabaseClient()
      const { data, error } = await supabase
        .from('user_code')
        .upsert(event.payload)

      if (error) throw new Error(error.message)
      console.log('[Sync] Code saved:', data)
    })
  }

  // ГЛАВНАЯ ФУНКЦИЯ: Синхронизация очереди
  async sync(): Promise<void> {
    if (this.isSyncing || !this.isOnline) {
      console.log('[Sync] Skipping: isSyncing=', this.isSyncing, 'isOnline=', this.isOnline)
      return
    }

    this.isSyncing = true
    const events = eventQueue.getAll()

    console.log(`[Sync] Starting sync of ${events.length} events...`)

    for (const event of events) {
      try {
        const handler = this.syncHandlers.get(event.type)
        if (!handler) {
          console.warn(`[Sync] No handler for: ${event.type}`)
          eventQueue.remove(event.id)
          continue
        }

        await handler(event)
        eventQueue.remove(event.id)
        console.log(`[Sync] ✅ Synced: ${event.id}`)
      } catch (error) {
        const err = error instanceof Error ? error.message : String(error)
        eventQueue.incrementRetry(event.id, err)

        if (event.retries >= 3) {
          console.error(`[Sync] ❌ Max retries exceeded: ${event.id}`)
          eventQueue.remove(event.id) // Удалить неудачное событие
        }
      }
    }

    this.isSyncing = false
    console.log('[Sync] Completed')
  }

  // Подписка на изменения статуса
  onStatusChange(callback: (status: 'online' | 'offline') => void): () => void {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback)
    }
  }

  private notifyListeners(status: 'online' | 'offline'): void {
    this.listeners.forEach((l) => l(status))
  }

  getStatus(): 'online' | 'offline' {
    return this.isOnline ? 'online' : 'offline'
  }
}

// Singleton
export const syncManager = new SyncManager()
