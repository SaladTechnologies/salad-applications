export interface Level {
  bonusImageUrl: string
  earnedAt?: string
  id: number
  xpRequired: number
}

export interface CurrentSeason {
  currentLevelId: number
  endAbsolute: string
  levels: Level[]
  levelXp: number
  name: string
  nextLevelId: number
  startAbsolute: string
  totalXp: number
}
