import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import type { BannerInfo } from '../../home/models/BannerInfo'

const styles = (theme: SaladTheme) => ({
  container: {
    fontFamily: theme.fontGroteskLight09,
    fontSize: 48,
    paddingTop: 18,
    lineHeight: '48px',
    color: theme.orange,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'center',
  },
})

interface Props extends WithStyles<typeof styles> {
  bannerInfo?: BannerInfo
}

class _NotificationBanner extends Component<Props> {
  public override render(): ReactNode {
    const { bannerInfo, classes } = this.props
    let now = new Date()

    if (
      !bannerInfo ||
      !bannerInfo.startDate ||
      !bannerInfo.endDate ||
      now.toISOString() < bannerInfo.startDate ||
      now.toISOString() > bannerInfo.endDate
    )
      return null

    return <div className={classes.container}>{bannerInfo.text}</div>
  }
}

export const NotificationBanner = withStyles(styles)(_NotificationBanner)
