import { createClient } from '@/lib/supabase/client'
import {
  achievementId,
  codeId,
  db,
  progressId,
  type DbAchievement,
  type DbProfile,
  type DbProgress,
  type DbUserCode,
} from '@/lib/db'
import { isOnline, syncEngine } from '@/lib/sync'

const GUEST_USER_ID = 'guest'

async function resolveUserId(): Promise<string> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? GUEST_USER_ID
}

function shouldSyncToCloud(userId: string) {
  return userId !== GUEST_USER_ID && isOnline()
}

export const dataLayer = {
  async saveProgress(input: {
    courseId: string
    taskId: string
    completed?: boolean
    xpEarned?: number
  }) {
    const userId = await resolveUserId()
    const now = Date.now()
    const id = progressId(userId, input.courseId, input.taskId)
    const pending = !shouldSyncToCloud(userId)

    const record: DbProgress = {
      id,
      user_id: userId,
      course_id: input.courseId,
      task_id: input.taskId,
      completed: input.completed ?? true,
      xp_earned: input.xpEarned ?? 100,
      completed_at: input.completed === false ? null : now,
      pending_sync: pending,
    }

    await db.progress.put(record)

    if (shouldSyncToCloud(userId)) {
      await syncEngine.enqueue('user_progress', 'upsert', {
        user_id: userId,
        course_id: input.courseId,
        task_id: input.taskId,
        completed: record.completed,
        xp_earned: record.xp_earned,
        completed_at: record.completed_at
          ? new Date(record.completed_at).toISOString()
          : null,
      })
      await db.progress.update(id, { pending_sync: false })
    }

    return { id, pending_sync: pending }
  },

  async saveCode(input: { courseId: string; taskId: string; code: string }) {
    const userId = await resolveUserId()
    const now = Date.now()
    const id = codeId(userId, input.courseId, input.taskId)
    const pending = !shouldSyncToCloud(userId)

    const record: DbUserCode = {
      id,
      user_id: userId,
      course_id: input.courseId,
      task_id: input.taskId,
      code: input.code,
      updated_at: now,
      pending_sync: pending,
    }

    await db.user_code.put(record)

    if (shouldSyncToCloud(userId)) {
      await syncEngine.enqueue('user_code', 'upsert', {
        user_id: userId,
        course_id: input.courseId,
        task_id: input.taskId,
        code: input.code,
        updated_at: new Date(now).toISOString(),
      })
      await db.user_code.update(id, { pending_sync: false })
    }

    return { id, pending_sync: pending }
  },

  async saveProfile(input: { fullName?: string; email?: string; avatarUrl?: string }) {
    const userId = await resolveUserId()
    const now = Date.now()
    const pending = !shouldSyncToCloud(userId)

    const record: DbProfile = {
      id: userId,
      user_id: userId,
      full_name: input.fullName ?? null,
      email: input.email ?? null,
      avatar_url: input.avatarUrl ?? null,
      updated_at: now,
      pending_sync: pending,
    }

    await db.profiles.put(record)

    if (shouldSyncToCloud(userId)) {
      await syncEngine.enqueue('profiles', 'update', {
        id: userId,
        full_name: record.full_name,
        email: record.email,
        avatar_url: record.avatar_url,
        updated_at: new Date(now).toISOString(),
      })
      await db.profiles.update(userId, { pending_sync: false })
    }

    return { id: userId, pending_sync: pending }
  },

  async unlockAchievement(input: { achievementId: string; title: string }) {
    const userId = await resolveUserId()
    const now = Date.now()
    const id = achievementId(userId, input.achievementId)
    const pending = !shouldSyncToCloud(userId)

    const record: DbAchievement = {
      id,
      user_id: userId,
      achievement_id: input.achievementId,
      title: input.title,
      unlocked_at: now,
      pending_sync: pending,
    }

    await db.achievements.put(record)

    if (shouldSyncToCloud(userId)) {
      await syncEngine.enqueue('achievements', 'insert', {
        user_id: userId,
        achievement_id: input.achievementId,
        title: input.title,
        unlocked_at: new Date(now).toISOString(),
      })
      await db.achievements.update(id, { pending_sync: false })
    }

    return { id, pending_sync: pending }
  },

  async getLocalCode(courseId: string, taskId: string) {
    const userId = await resolveUserId()
    const id = codeId(userId, courseId, taskId)
    return db.user_code.get(id)
  },

  async getPendingCount() {
    const { getPendingSyncCount } = await import('@/lib/db')
    return getPendingSyncCount()
  },
}
