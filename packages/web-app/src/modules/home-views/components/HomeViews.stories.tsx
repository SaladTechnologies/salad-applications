import { storiesOf } from '@storybook/react'
import type { BannerInfo } from '../../home/models/BannerInfo'
import { NotificationBanner } from './NotificationBanner'

storiesOf('Modules/Home', module).add('Notification Banner', () => {
  let afterBannerInfo: BannerInfo = {
    // puts the start date 20 minutes in the past
    startDate: `${new Date(new Date().getTime() - 20 * 60000)}`,
    // 2 minutes after startDate
    endDate: `${new Date(new Date().getTime() - 18 * 60000)}`,
    text: '2X Earnings Week: May 16 - May 22',
  }
  let duringBannerInfo: BannerInfo = {
    startDate: `${new Date()}`,
    // 20 minutes after startDate
    endDate: `${new Date(new Date().getTime() + 20 * 60000)}`,
    text: '2X Earnings Week: May 16 - May 22',
  }
  let beforeBannerInfo: BannerInfo = {
    //puts the start date into the future
    startDate: `${new Date(new Date().getTime() + 20 * 60000)}`,
    // 20 minutes after startDate
    endDate: `${new Date(new Date().getTime() + 20 * 60000)}`,
    text: '2X Earnings Week: May 16 - May 22',
  }
  return (
    <>
      <div>
        Before time
        <NotificationBanner bannerInfo={beforeBannerInfo} />
      </div>
      <div>
        During
        <NotificationBanner bannerInfo={duringBannerInfo} />
      </div>
      <div>
        After
        <NotificationBanner bannerInfo={afterBannerInfo} />
      </div>
    </>
  )
})
