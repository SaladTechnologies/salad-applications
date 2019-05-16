import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'

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
  now?: Date
  startDate?: Date
  endDate?: Date
  text?: string
}

class _NotificationBanner extends Component<Props> {
  render() {
    const { now, startDate, endDate, text, classes } = this.props

    if (now === undefined || startDate === undefined || endDate === undefined || now < startDate || now > endDate)
      return null

    return <div className={classes.container}>{text}</div>
  }
}

export const NotificationBanner = withStyles(styles)(_NotificationBanner)
