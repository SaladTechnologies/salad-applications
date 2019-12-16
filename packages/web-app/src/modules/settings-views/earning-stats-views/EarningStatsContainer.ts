import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { EarningStatsPage } from './components'

const mapStoreToProps = (store: RootStore): any => ({})

export const EarningStatsContainer = connect(mapStoreToProps, EarningStatsPage)
