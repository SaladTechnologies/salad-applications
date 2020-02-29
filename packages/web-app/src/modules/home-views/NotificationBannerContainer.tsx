import { connect } from '../../connect'
import { NotificationBanner } from './components/NotificationBanner'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore): any => ({
  bannerInfo: store.home.bannerInfo,
})

export const NotificationBannerContainer = connect(mapStoreToProps, NotificationBanner)