import { connect } from '../../connect'
import { CurrentReferralPanel } from './components/CurrentReferralPanel'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore) => ({
  // referral?: Referral
  // submitting?: boolean
  // onSubmitCode?: (code: string) => void
  // errorMessage?: string
})

export const CurrentReferralPanelContainer = connect(
  mapStoreToProps,
  CurrentReferralPanel,
)
