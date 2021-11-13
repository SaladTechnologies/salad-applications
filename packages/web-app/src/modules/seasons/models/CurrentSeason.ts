import type { DateTime } from 'luxon'

export interface Level {
  bonusImageUrl: string
  earnedAt?: string
  id: number
  xpRequired: number
}

export interface CurrentSeason {
  currentLevelId: number
  endAbsolute?: DateTime
  levels: Level[]
  levelXp: number
  name: string
  nextLevelId: number
  startAbsolute?: DateTime
  totalXp: number
}
