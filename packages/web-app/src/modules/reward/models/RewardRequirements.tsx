import type { RewardSystemRequirements } from './RewardSystemRequirements'

export interface RewardRequirements {
  /** List of system requirements keyed by OS (Windows, OSX, Linux...) */
  systems?: Map<string, RewardSystemRequirements>
  //TODO: Add account requirements (Steam, battle.net...)???
  //TODO: Add region requirements (USA Only, EU...)???
}
