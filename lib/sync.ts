import { createClient } from '@/lib/supabase/client'
import {
  db,
  getPendingSyncCount,
  type DbSyncQueueItem,
  type SupabaseTable,
  type SyncOperation,
} from '@/lib/db'

const MAX_RETRIES = 3
const POLL_INTERVAL_MS = 30_000

type NetworkListener = (online: boolean, pendingCount: number) => void
type SyncListener = (syncing: boolean) => void

class SyncEngine {
  private isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
  private isSyncing = false
  private pollTimer: ReturnType<typeof setInterval> | null = null
  private networkListeners = new Set<NetworkListener>()
  private syncListeners = new Set<SyncListener>()
  private started = false

  start() {
    if (this.started || typeof window === 'undefined') return
    this.started = true

    window.addEventListener('online', () => void this.handleOnline())
    window.addEventListener('offline', () => void this.handleOffline())

    this.pollTimer = setInterval(() => void this.checkConnection(), POLL_INTERVAL_MS)

    void this.notifyNetworkListeners()
    if (this.isOnline) void this.sync()
  }

  stop() {
    if (!this.started || typeof window === 'undefined') return
    this.started = false
    window.removeEventListener('online', () => void this.handleOnline())
    window.removeEventListener('offline', () => void this.handleOffline())
    if (this.pollTimer) clearInterval(this.pollTimer)
  }

  getOnline() {
    return this.isOnline
  }

  getSyncing() {
    return this.isSyncing
  }

  onNetworkChange(listener: NetworkListener) {
    this.networkListeners.add(listener)
    void this.notifyNetworkListeners().then(() => {
      void getPendingSyncCount().then((count) => listener(this.isOnline, count))
    })
    return () => this.networkListeners.delete(listener)
  }

  onSyncChange(listener: SyncListener) {
    this.syncListeners.add(listener)
    listener(this.isSyncing)
    return () => this.syncListeners.delete(listener)
  }

  async enqueue(
    table: SupabaseTable,
    operation: SyncOperation,
    payload: Record<string, unknown>,
  ) {
    const item: DbSyncQueueItem = {
      id: `${table}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      table_name: table,
      operation,
      payload,
      created_at: Date.now(),
      retries: 0,
    }

    await db.sync_queue.add(item)
    await this.notifyNetworkListeners()

    if (this.isOnline) {
      void this.sync()
    }
  }

  async sync() {
    if (this.isSyncing || !this.isOnline) return

    this.setSyncing(true)

    try {
      await this.flushQueue()
      await this.syncPendingRecords()
    } finally {
      this.setSyncing(false)
      await this.notifyNetworkListeners()
    }
  }

  private async handleOnline() {
    this.isOnline = true
    await this.notifyNetworkListeners()
    await this.sync()
  }

  private async handleOffline() {
    this.isOnline = false
    await this.notifyNetworkListeners()
  }

  private async checkConnection() {
    if (typeof navigator === 'undefined') return

    const wasOnline = this.isOnline
    this.isOnline = navigator.onLine

    if (!wasOnline && this.isOnline) {
      await this.handleOnline()
    } else if (wasOnline && !this.isOnline) {
      await this.handleOffline()
    }
  }

  private setSyncing(syncing: boolean) {
    this.isSyncing = syncing
    this.syncListeners.forEach((listener) => listener(syncing))
  }

  private async notifyNetworkListeners() {
    const pendingCount = await getPendingSyncCount()
    this.networkListeners.forEach((listener) => listener(this.isOnline, pendingCount))
  }

  private async flushQueue() {
    const items = await db.sync_queue.orderBy('created_at').toArray()

    for (const item of items) {
      try {
        await this.pushToSupabase(item.table_name, item.operation, item.payload)
        await db.sync_queue.delete(item.id)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        const retries = item.retries + 1

        if (retries >= MAX_RETRIES) {
          await db.sync_queue.delete(item.id)
          console.error('[Sync] Dropped queue item after max retries:', item.id, message)
          continue
        }

        await db.sync_queue.update(item.id, { retries, last_error: message })
      }
    }
  }

  private async syncPendingRecords() {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const pendingProgress = await db.progress.filter((row) => row.pending_sync).toArray()
    for (const record of pendingProgress) {
      try {
        await supabase.from('user_progress').upsert({
          user_id: record.user_id,
          course_id: record.course_id,
          task_id: record.task_id,
          completed: record.completed,
          xp_earned: record.xp_earned,
          completed_at: record.completed_at
            ? new Date(record.completed_at).toISOString()
            : null,
        })
        await db.progress.update(record.id, { pending_sync: false })
      } catch (error) {
        console.error('[Sync] progress sync failed:', error)
      }
    }

    const pendingCode = await db.user_code.filter((row) => row.pending_sync).toArray()
    for (const record of pendingCode) {
      try {
        await supabase.from('user_code').upsert({
          user_id: record.user_id,
          course_id: record.course_id,
          task_id: record.task_id,
          code: record.code,
          updated_at: new Date(record.updated_at).toISOString(),
        })
        await db.user_code.update(record.id, { pending_sync: false })
      } catch (error) {
        console.error('[Sync] code sync failed:', error)
      }
    }

    const pendingAchievements = await db.achievements.filter((row) => row.pending_sync).toArray()
    for (const record of pendingAchievements) {
      try {
        await supabase.from('achievements').insert({
          user_id: record.user_id,
          achievement_id: record.achievement_id,
          title: record.title,
          unlocked_at: new Date(record.unlocked_at).toISOString(),
        })
        await db.achievements.update(record.id, { pending_sync: false })
      } catch (error) {
        console.error('[Sync] achievement sync failed:', error)
      }
    }

    const pendingProfiles = await db.profiles.filter((row) => row.pending_sync).toArray()
    for (const record of pendingProfiles) {
      try {
        await supabase
          .from('profiles')
          .update({
            full_name: record.full_name,
            email: record.email,
            avatar_url: record.avatar_url,
            updated_at: new Date(record.updated_at).toISOString(),
          })
          .eq('id', record.user_id)
        await db.profiles.update(record.id, { pending_sync: false })
      } catch (error) {
        console.error('[Sync] profile sync failed:', error)
      }
    }
  }

  private async pushToSupabase(
    table: SupabaseTable,
    operation: SyncOperation,
    payload: Record<string, unknown>,
  ) {
    const supabase = createClient()

    switch (table) {
      case 'profiles': {
        const { error } = await supabase
          .from('profiles')
          .update(payload)
          .eq('id', payload.id as string)
        if (error) throw new Error(error.message)
        break
      }
      case 'user_progress': {
        const { error } = await supabase.from('user_progress').upsert(payload)
        if (error) throw new Error(error.message)
        break
      }
      case 'achievements': {
        const { error } = await supabase.from('achievements').insert([payload])
        if (error) throw new Error(error.message)
        break
      }
      case 'user_code': {
        const { error } = await supabase.from('user_code').upsert(payload)
        if (error) throw new Error(error.message)
        break
      }
      default:
        throw new Error(`Unknown table: ${table}`)
    }
  }
}

export const syncEngine = new SyncEngine()

export function startSyncEngine() {
  syncEngine.start()
}

export function isOnline() {
  return syncEngine.getOnline()
}
