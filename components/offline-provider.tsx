"use client"

import { useEffect } from "react"
import { useAppState } from "@/lib/store"
import { startSyncEngine, syncEngine } from "@/lib/sync"

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const { forceOffline, setNetworkStatus } = useAppState()

  useEffect(() => {
    startSyncEngine()

    const unsubscribeNetwork = syncEngine.onNetworkChange((online, pendingCount) => {
      const effectiveOffline = forceOffline || !online
      setNetworkStatus({
        isNetworkOnline: online,
        isOffline: effectiveOffline,
        pendingSyncCount: pendingCount,
        connectionStatus: effectiveOffline
          ? forceOffline && online
            ? "FORCE OFFLINE"
            : "OFFLINE"
          : pendingCount > 0
            ? `ONLINE · ${pendingCount} pending`
            : "ONLINE",
      })
    })

    const unsubscribeSync = syncEngine.onSyncChange((syncing) => {
      setNetworkStatus({
        isSyncing: syncing,
        connectionStatus: syncing ? "SYNCING..." : undefined,
      })
    })

    return () => {
      unsubscribeNetwork()
      unsubscribeSync()
    }
  }, [forceOffline, setNetworkStatus])

  return <>{children}</>
}
