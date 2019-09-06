import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { SendReferral } from './components/SendReferral'

const mapStoreToProps = (store: RootStore) => ({
  sending: store.referral.isSending,
  onSend: store.referral.sendReferral,
})

export const SendReferralContainer = connect(
  mapStoreToProps,
  SendReferral,
)
