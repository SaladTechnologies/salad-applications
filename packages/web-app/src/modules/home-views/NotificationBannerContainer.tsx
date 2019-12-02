import { connect } from '../../connect'
import { NotificationBanner } from './components/NotificationBanner'

// These values wont change when time updates, they will only be used when the component loads. In the future we could update these dynamically.
const mapStoreToProps = (): any => ({
  now: new Date(),
  startDate: new Date('December 2, 2019 16:00:00 GMT-06:00'),
  endDate: new Date('December 4, 2019 16:00:00 GMT-06:00'),
  text: '1.5X Earnings until 12/4',
})

export const NotificationBannerContainer = connect(
  mapStoreToProps,
  NotificationBanner,
)
