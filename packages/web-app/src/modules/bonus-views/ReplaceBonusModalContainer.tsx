import { useEarningRateBonus } from '../../account/bonuses.ts'
import { useNavigation } from '../../routing/navigation-context.ts'
import { useStore } from '../../Store'
import { ReplaceBonusModal } from './components/ReplaceBonusModal'

/** The replace-bonus modal: it replaces the active earning rate bonus with the waiting one, or closes without. */
export const ReplaceBonusModalContainer = () => {
  const { bonuses } = useStore()
  const navigation = useNavigation()
  const currentEarningBonus = useEarningRateBonus()
  return (
    <ReplaceBonusModal
      currentEarningBonus={currentEarningBonus?.multiplier}
      onReplaceCurrentBonus={() => {
        void bonuses.replaceCurrentEarningRate()
        navigation.goBackOr('/account/bonuses')
      }}
      onCloseClicked={() => {
        bonuses.clearReplacementEarningRateBonusId()
        navigation.goBackOr('/account/bonuses')
      }}
    />
  )
}
