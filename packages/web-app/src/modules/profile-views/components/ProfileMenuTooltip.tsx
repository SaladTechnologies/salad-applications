import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Profile } from '../../profile/models'
import classnames from 'classnames'
import { ProfileSummaryTitle } from './ProfileSummaryTitle'

const styles = (theme: SaladTheme) => ({
  container: {
    backgroundColor: theme.lightGreen,
    color: theme.blueFont,
    width: '25rem',
    paddingTop: '5px',
    pointerEvents: 'none',
  },
  contentContiner: {
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
        <div className={classnames(classes.contentContiner, 'content')}>
          <p>
            Earning XP unlocks tiers of veggie badges and eventually earns you new referrals. Each successful referral
            will contribute Salad Bucks to your balance!
          </p>
          Earn XP By:
          <ul>
            <li>Spending time chopping Salad (+1 XP/Min)</li>
            <li>Referring Friends (+500XP)</li>
            <li>Adding Another Salad-Chopping Machine (+500XP)</li>
            <li>Saving Salad Balance (+1% speed bonus per $1.00 in Balance) [Coming Soon!] </li>
          </ul>
        </div>
      </div>
    )
  }
}

export const ProfileMenuTooltip = withStyles(styles)(_ProfileMenuTooltip)
