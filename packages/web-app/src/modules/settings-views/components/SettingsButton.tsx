import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { SmartLink } from '../../../components'
import Img from 'react-image'
import GearIcon from '../assets/GearIcon.svg'

const styles = (theme: SaladTheme) => ({
  container: {
    position: 'relative',
  },
  settingsButton: {
    display: 'flex',
    alignItems: 'center',
  },
  menuItemNotification: {
    background: theme.darkRed,
    boxShadow: '0 0 11px #F13834, 0 0 4px #F13834',
    width: 8,
    height: 8,
    borderRadius: '50%',
    position: 'absolute',
    top: 0,
    left: 12,
  },
})

interface Props extends WithStyles<typeof styles> {
  onLatestDesktop?: boolean
}

class _SettingsButton extends Component<Props> {
  render() {
    const { onLatestDesktop, classes } = this.props
    return (
      <div className={classes.container}>
        <SmartLink className={classes.settingsButton} to={'/settings/windows-settings'}>
          <Img height={16} src={GearIcon} />
          {!onLatestDesktop && <div className={classes.menuItemNotification}></div>}
        </SmartLink>
      </div>
    )
  }
}

export const SettingsButton = withStyles(styles)(_SettingsButton)
