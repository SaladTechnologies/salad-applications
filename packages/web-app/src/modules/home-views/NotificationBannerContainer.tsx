import { connect } from '../../connect'
import { NotificationBanner } from './components/NotificationBanner'

// These values wont change when time updates, they will only be used when the component loads. In the future we could update these dynamically.
const mapStoreToProps = (): any => ({
  now: new Date(),
  startDate: new Date('July 24, 2018 16:00:00 GMT-06:00'),
  endDate: new Date('October 11, 2019 12:00:00 GMT-06:00'),
  text: '2X Earnings Until 10/11!',
})

export const NotificationBannerContainer = connect(
  mapStoreToProps,
  NotificationBanner,
)
