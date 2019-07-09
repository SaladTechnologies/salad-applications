import { connect } from '../../connect'
import { NotificationBanner } from './components/NotificationBanner'

// These values wont change when time updates, they will only be used when the component loads. In the future we could update these dynamically.
const mapStoreToProps = () => ({
  now: new Date(),
  startDate: new Date('June 26, 2019 12:00:00 GMT-06:00'),
  endDate: new Date('June 30, 2019 23:59:00 GMT-06:00'),
  text: '$100 Prize Referral Contest! See Discord for Deets.',
})

export const NotificationBannerContainer = connect(
  mapStoreToProps,
  NotificationBanner,
)
