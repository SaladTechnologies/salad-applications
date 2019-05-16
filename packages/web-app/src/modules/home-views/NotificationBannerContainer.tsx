import { connect } from '../../connect'
import { NotificationBanner } from './components/NotificationBanner'

// These values wont change when time updates, they will only be used when the component loads. In the future we could update these dynamically.
const mapStoreToProps = () => ({
  now: new Date(),
  startDate: new Date('May 16, 2019 12:00:00 GMT-06:00'),
  endDate: new Date('May 22, 2019 12:00:00 GMT-06:00'),
  text: '2X Earnings Week: May 16 - May 22',
})

export const NotificationBannerContainer = connect(
  mapStoreToProps,
  NotificationBanner,
)
