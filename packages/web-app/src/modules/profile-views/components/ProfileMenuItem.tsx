import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Profile } from '../../profile/models'
import { ProfileImage } from '../../../components'
import { ProfileSummaryTitle } from './ProfileSummaryTitle'
import { TooltipAnchor } from '../../../ToolTipManager'
import { ProfileMenuTooltip } from './ProfileMenuTooltip'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'inline-flex',
    flexDirection: 'row',
    userSelect: 'none',
  },
  title: {
    width: '275px',
    paddingLeft: '21px',
    color: theme.lightGreen,
  },
  xp: {
    color: theme.neonGreen,
  },
  tooltip: {
    top: `-${107 / 2}px`,
    position: 'absolute',
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
        <TooltipAnchor
          position="right"
          events
          onRenderContent={() => (
            <div className={classes.tooltip}>
              <ProfileMenuTooltip profile={profile} xp={xp} />
            </div>
          )}
        />
        <ProfileImage src={undefined} />
        <ProfileSummaryTitle className={classes.title} xpClassName={classes.xp} xp={xp} profile={profile} />
      </div>
    )
  }
}

export const ProfileMenuItem = withStyles(styles)(_ProfileMenuItem)
