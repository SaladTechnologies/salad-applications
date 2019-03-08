import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Profile } from '../../profile/models'
import { ProfileImage } from '../../../components'
import { ProfileSummaryTitle } from './ProfileSummaryTitle'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'inline-flex',
    flexDirection: 'row',
    backgroundColor: theme.appBackgroundColor,
  },
  title: {
    width: '275px',

    color: theme.lightGreen,
  },
  xp: {
    color: theme.neonGreen,
  },
})

interface Props extends WithStyles<typeof styles> {
  profile?: Profile
  xp?: number
}

class _ProfileMenuItem extends Component<Props> {
  render() {
    const { profile, xp, classes } = this.props
    console.log(profile)
    return (
      <div className={classes.container}>
        <ProfileImage />
        <ProfileSummaryTitle className={classes.title} xpClassName={classes.xp} xp={xp} profile={profile} />
      </div>
    )
  }
}

export const ProfileMenuItem = withStyles(styles)(_ProfileMenuItem)
