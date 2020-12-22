import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { NotificationBanner } from './components/NotificationBanner'

const mapStoreToProps = (store: RootStore): any => ({
  bannerInfo: store.home.bannerInfo,
})

export const NotificationBannerContainer = connect(mapStoreToProps, NotificationBanner)
