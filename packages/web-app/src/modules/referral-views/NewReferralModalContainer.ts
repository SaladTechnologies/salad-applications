import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { NewReferralModal } from './components/NewReferralModal'

const mapStoreToProps = (store: RootStore) => ({
  onCloseClicked: store.ui.hideModal,
  onSend: store.referral.sendReferral,
  sending: store.referral.isSending,
})

export const NewReferralModalContainer = connect(
  mapStoreToProps,
  NewReferralModal,
)
