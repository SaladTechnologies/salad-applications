import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { BannerInfo } from '../../home/models/BannerInfo'

const styles = (theme: SaladTheme) => ({
  container: {
    userSelect: 'none',
    fontFamily: 'sharpGroteskLight09',
    fontSize: '48px',
    paddingTop: '18px',
    lineHeight: '48px',
    color: '#F6931D',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
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
      (bannerInfo === undefined) ||
      (bannerInfo && bannerInfo.startDate === undefined) ||
      (bannerInfo && bannerInfo.endDate === undefined) ||
      (bannerInfo && now.toISOString() < bannerInfo.startDate) ||
      (bannerInfo && now.toISOString() > bannerInfo.endDate)
    )
      return null

    return <div className={classes.container}>{bannerInfo && bannerInfo.text}</div>
  }
}

export const NotificationBanner = withStyles(styles)(_NotificationBanner)
