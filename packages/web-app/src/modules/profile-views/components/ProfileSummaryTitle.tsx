import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Profile } from '../../profile/models'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  container: {
    padding: '1rem',
  },
  username: {
    fontFamily: 'sharpGroteskLight25',
    fontSize: theme.mediumLarge,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  xp: {
    fontFamily: 'sharpGroteskLight25',
    fontSize: theme.small,
  },
})

interface Props extends WithStyles<typeof styles> {
  profile?: Profile
  xp?: number
  className?: string
  xpClassName?: string
}

class _ProfileSummaryTitle extends Component<Props> {
  render() {
    const { profile, xp, classes, className, xpClassName } = this.props
    return (
      <div className={classnames(className, classes.container)}>
        <div className={classes.username}>{profile && profile.username}</div>
        <div className={classnames(classes.xp, xpClassName)}>{xp !== undefined ? xp : '-'} XP</div>
      </div>
    )
  }
}

export const ProfileSummaryTitle = withStyles(styles)(_ProfileSummaryTitle)
