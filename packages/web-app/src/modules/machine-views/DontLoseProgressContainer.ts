import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { StartActionType } from '../salad-bowl/models'
import { DontLoseProgressPage } from './components/DontLoseProgress'

const mapStoreToProps = (store: RootStore): any => ({
  onCloseClicked: () => store.ui.hideModal(true),
  onSubmitSupportTicket: () => store.zendesk.openSupportTicket(),
  onStopPrepping: () => store.saladBowl?.toggleRunning(StartActionType.StopPrepping),
  prepTime: store.saladBowl?.runningTime,
})

export const DontLoseProgressPageContainer = connect(mapStoreToProps, DontLoseProgressPage)
