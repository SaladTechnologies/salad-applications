import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Profile } from '../../profile/models'
import { ProfileSummaryTitle } from './ProfileSummaryTitle'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'inline-flex',
    flexDirection: 'row',
    userSelect: 'none',
    paddingLeft: 22,
    color: theme.green,
  },
})

interface Props extends WithStyles<typeof styles> {
  profile?: Profile
  xp?: number
}

class _ProfileMenuItem extends Component<Props> {
  render() {
    const { profile, xp, classes } = this.props
    return (
      <div className={classes.container}>
        <ProfileSummaryTitle xp={xp} profile={profile} />
      </div>
    )
  }
}

export const ProfileMenuItem = withStyles(styles)(_ProfileMenuItem)
