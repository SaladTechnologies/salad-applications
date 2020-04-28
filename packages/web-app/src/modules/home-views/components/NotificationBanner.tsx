import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { BannerInfo } from '../../home/models/BannerInfo'
import { SaladTheme } from '../../../SaladTheme'

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
  render() {
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
