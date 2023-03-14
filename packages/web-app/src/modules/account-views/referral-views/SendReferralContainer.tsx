import { connect } from '../../../connect'
import type { RootStore } from '../../../Store'
import { SendReferral } from './components/SendReferral'

const mapStoreToProps = (store: RootStore): any => ({
  sending: store.referral.isSendingReferral,
  onSend: store.referral.sendReferral,
})

export const SendReferralContainer = connect(mapStoreToProps, SendReferral)
