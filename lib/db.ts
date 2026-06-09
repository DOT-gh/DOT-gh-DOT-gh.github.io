import Dexie, { type Table } from 'dexie'

export type SupabaseTable = 'profiles' | 'user_progress' | 'achievements' | 'user_code'
export type SyncOperation = 'insert' | 'update' | 'upsert'

export interface DbCourse {
  id: string
  user_id: string
  title: string
  description: string
  icon: string
  progress: number
  completed_tasks: number
  total_tasks: number
  updated_at: number
  pending_sync: boolean
}

export interface DbProgress {
  id: string
  user_id: string
  course_id: string
  task_id: string
  completed: boolean
  xp_earned: number
  completed_at: number | null
  pending_sync: boolean
}

export interface DbUserCode {
  id: string
  user_id: string
  course_id: string
  task_id: string
  code: string
  updated_at: number
  pending_sync: boolean
}

export interface DbAchievement {
  id: string
  user_id: string
  achievement_id: string
  title: string
  unlocked_at: number
  pending_sync: boolean
}

export interface DbProfile {
  id: string
  user_id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  updated_at: number
  pending_sync: boolean
}

export interface DbSyncQueueItem {
  id: string
  table_name: SupabaseTable
  operation: SyncOperation
  payload: Record<string, unknown>
  created_at: number
  retries: number
  last_error?: string
}

export function progressId(userId: string, courseId: string, taskId: string) {
  return `${userId}:${courseId}:${taskId}`
}

export function codeId(userId: string, courseId: string, taskId: string) {
  return `${userId}:${courseId}:${taskId}`
}

export function achievementId(userId: string, achievementId: string) {
  return `${userId}:${achievementId}`
}

class EduSurvivalDatabase extends Dexie {
  courses!: Table<DbCourse, string>
  progress!: Table<DbProgress, string>
  user_code!: Table<DbUserCode, string>
  achievements!: Table<DbAchievement, string>
  profiles!: Table<DbProfile, string>
  sync_queue!: Table<DbSyncQueueItem, string>

  constructor() {
    super('EduSurvivalKit')

    this.version(1).stores({
      courses: 'id, user_id, pending_sync, updated_at',
      progress: 'id, user_id, course_id, task_id, pending_sync',
      user_code: 'id, user_id, course_id, task_id, pending_sync',
      achievements: 'id, user_id, achievement_id, pending_sync',
      profiles: 'id, user_id, pending_sync',
      sync_queue: 'id, table_name, created_at, retries',
    })
  }
}

export const db = new EduSurvivalDatabase()

export async function getPendingSyncCount(): Promise<number> {
  const [queueCount, progress, code, achievements, profiles] = await Promise.all([
    db.sync_queue.count(),
    db.progress.filter((row) => row.pending_sync).count(),
    db.user_code.filter((row) => row.pending_sync).count(),
    db.achievements.filter((row) => row.pending_sync).count(),
    db.profiles.filter((row) => row.pending_sync).count(),
  ])

  return queueCount + progress + code + achievements + profiles
}
