"use client"

import { useAppState } from "@/lib/store"
import { Snowfall } from "./snowfall"

export function SnowfallWrapper() {
  const { snowAmount } = useAppState()
  return <Snowfall snowAmount={snowAmount} />
}
