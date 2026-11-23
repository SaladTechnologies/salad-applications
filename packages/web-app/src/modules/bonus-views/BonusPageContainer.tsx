import { useBonusClaims, useUnclaimedBonuses } from '../../account/bonuses.ts'
import { useStore } from '../../Store'
import { BonusPage } from './components/BonusPage'

/** The bonuses page: the unclaimed bonuses, which the app-wide refresh loads, and their claims. */
export const BonusPageContainer = () => {
  const { bonuses } = useStore()
  const unclaimedBonuses = useUnclaimedBonuses()
  const { pending } = useBonusClaims(bonuses)
  return <BonusPage unclaimedBonuses={unclaimedBonuses} pendingBonuses={pending} claimBonus={bonuses.claim} />
}
