import { connect } from '../../connect'
import { NotificationBanner } from './components/NotificationBanner'

// These values wont change when time updates, they will only be used when the component loads. In the future we could update these dynamically.
const mapStoreToProps = () => ({
  now: new Date(),
  startDate: new Date('July 24, 2019 16:00:00 GMT-06:00'),
  endDate: new Date('August 25, 2019 23:59:00 GMT-06:00'),
  text: 'Back to school sale July 24 - August 25',
})

export const NotificationBannerContainer = connect(
  mapStoreToProps,
  NotificationBanner,
)
