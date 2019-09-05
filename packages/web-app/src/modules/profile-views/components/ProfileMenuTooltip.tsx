import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Profile } from '../../profile/models'
import classnames from 'classnames'
import { ProfileSummaryTitle } from './ProfileSummaryTitle'

const styles = (theme: SaladTheme) => ({
  container: {
    backgroundColor: theme.green,
    color: theme.darkBlue,
    width: '25rem',
    paddingTop: '5px',
    pointerEvents: 'none',
  },
  contentContainer: {
    padding: '0 1rem 1rem',
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

class _ProfileMenuTooltip extends Component<Props> {
  render() {
    const { profile, xp, classes, className } = this.props
    return (
      <div className={classnames(className, classes.container)}>
        <ProfileSummaryTitle profile={profile} xp={xp} />
        <div className={classnames(classes.contentContainer, 'content')}>
          <p>
            Earning XP unlocks tiers of veggie badges.
          </p>
          <p>
            Earn XP by running Salad. For every minute you run Salad, you earn 1 XP.
          </p>
        </div>
      </div>
    )
  }
}

export const ProfileMenuTooltip = withStyles(styles)(_ProfileMenuTooltip)
