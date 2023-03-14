import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { ReferralCodeEntryComponent } from './referral-views/components/ReferralCodeEntryComponent'

const mapStoreToProps = (store: RootStore): any => ({
  onSubmitCode: store.referral.submitReferralCode,
})

export const ReferralCodeEntryContainer = connect(mapStoreToProps, ReferralCodeEntryComponent)
