import type { RootStore } from '../../Store'
import { connect } from '../../connect'
import { PasskeySuccessPage } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  onDoneClick: () => store.routing.push(`/account/summary`),
})

export const PasskeySuccessPageContainer = connect(mapStoreToProps, PasskeySuccessPage)
