import { faClone, faMinus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import React, { Component } from 'react'
import Img from 'react-image'
import withStyles, { WithStyles } from 'react-jss'
import { SmartLink } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { AccountMenuContainer } from '../../account-views/account-menu'
import { MiningStatus } from '../../machine/models'
import { SettingsButtonContainer } from '../../settings-views'
import icon from '../assets/favicon-32x32.png'

export class MenuItem {
  constructor(public readonly name: string, public readonly url: string, public readonly showNotification?: boolean) {}
}

const styles = (theme: SaladTheme) => ({
  container: {
    color: theme.green,
    height: '2rem',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'stretch',
    paddingLeft: 10,
    margin: 0,
    '-webkit-app-region': 'drag',
    zIndex: 9999,
    position: 'relative',
    fontFamily: theme.fontGroteskLight25,
  },
  bottomBorder: {
    borderBottom: `1px solid ${theme.green}`,
  },
  leftItems: {
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    paddingRight: 5,
  },
  buttons: {
    padding: '0 .75rem',
    '-webkit-app-region': 'none',
    height: '2rem',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    },
  },
  menuItem: {
    '-webkit-app-region': 'none',
    padding: '.5rem .75rem',
    textDecoration: 'none',
    fontSize: 12,
    letterSpacing: '1.3px',
    cursor: 'pointer',
    position: 'relative',
    '&:hover': {
      color: theme.lightGreen,
    },
  },
  menuItemNotification: {
    background: theme.darkRed,
    boxShadow: '0 0 11px #F13834, 0 0 4px #F13834',
    width: 12,
    height: 12,
    borderRadius: '50%',
    position: 'absolute',
    top: 6,
    right: 8,
  },
  componentContainer: {
    display: 'flex',
    alignItems: 'center',
    '-webkit-app-region': 'none',
    paddingRight: 10,
  },
  closeButton: {
    '&:hover': {
      opacity: 1,
      backgroundColor: 'darkred',
    },
  },
  altMenuItemColor: {
    color: theme.green,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  hide: {
    display: 'none',
  },
  settingsButton: {
    display: 'flex',
    alignItems: 'center',
  },
  startButtonContainer: {
    position: 'relative',
    width: 102,
    height: '2rem',
  },
  startButton: {
    position: 'absolute',
    top: 0,
    height: 40,
    width: 90,
    transform: 'skew(-30deg)',
    background:
      'linear-gradient(104.2deg, rgba(201, 240, 55, 0) -28.93%, rgba(201, 240, 55, 0.5) 19.91%, rgba(201, 240, 55, 0.2) 49.73%, rgba(201, 240, 55, 0.3) 88.28%)',
    border: '1px solid rgba(201, 240, 55, 0.5)',
    color: '#fff',
    textShadow: '0px 0px 5px rgba(201, 240, 55, 0.9), -1px -1px 3px rgba(0, 0, 0, 0.25)',
    transition: 'box-shadow .1s cubic-bezier(0.47, 0, 0.75, 0.72)',
    backdropFilter: 'blur(4px)',
    backgroundColor: 'rgba(201, 240, 55, 0.5)',
    boxShadow: '5px 5px 10px rgba(10, 33, 51, 0.3), 8px 12px 30px rgba(201, 240, 55, 0.3)',
  },
  startButtonText: {
    color: theme.darkBlue,
    position: 'absolute',
    top: 1,
    height: 40,
    width: 90,
    fontFamily: theme.fontGroteskBook25,
    fontSize: 12,
    '-webkit-app-region': 'none',
    cursor: 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonTextEnabled: {
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  isDesktop?: boolean
  bottomBorder?: boolean
  onMinimize?: () => void
  onMaximize?: () => void
  onClose?: () => void
  onStart?: () => void
  status?: MiningStatus
  startEnabled?: boolean
  menuItems?: MenuItem[]
}

class _Titlebar extends Component<Props> {
  handleClose = () => {
    const { onClose } = this.props

    if (onClose) onClose()
  }

  handleMinimize = () => {
    const { onMinimize } = this.props

    if (onMinimize) onMinimize()
  }

  handleMaximize = () => {
    const { onMaximize } = this.props

    if (onMaximize) onMaximize()
  }

  handleStart = () => {
    const { startEnabled, onStart } = this.props

    if (!startEnabled) return

    onStart?.()
  }

  render() {
    const { startEnabled, isDesktop, status, menuItems, bottomBorder, classes } = this.props

    const isRunning =
      status === MiningStatus.Installing || status === MiningStatus.Initializing || status === MiningStatus.Running
    return (
      <div className={classnames(classes.container, { [classes.bottomBorder]: bottomBorder })}>
        <div className={classes.leftItems}>
          <div className={classes.icon}>
            <SmartLink to="/">
              <Img height={24} src={icon} />
            </SmartLink>
          </div>
          {isDesktop && menuItems && (
            <div className={classes.startButtonContainer}>
              <div className={classes.startButton} />
              <div
                className={classnames(classes.startButtonText, { [classes.startButtonTextEnabled]: startEnabled })}
                onClick={this.handleStart}
              >
                {isRunning ? 'STOP' : 'START'}
              </div>
            </div>
          )}
          {menuItems &&
            menuItems.map((x) => (
              <SmartLink key={x.name} className={classes.menuItem} to={x.url}>
                {x.showNotification && <div className={classes.menuItemNotification}></div>}
                {x.name}
              </SmartLink>
            ))}
        </div>

        {menuItems && (
          <div className={classes.componentContainer}>
            <AccountMenuContainer />
            {isDesktop && <SettingsButtonContainer />}
          </div>
        )}

        {isDesktop && (
          <>
            <div onClick={this.handleMinimize}>
              <FontAwesomeIcon size="xs" className={classes.buttons} icon={faMinus} />
            </div>
            <div onClick={this.handleMaximize}>
              <FontAwesomeIcon size="xs" className={classes.buttons} icon={faClone} />
            </div>
            <div onClick={this.handleClose}>
              <FontAwesomeIcon size="xs" className={classnames(classes.closeButton, classes.buttons)} icon={faTimes} />
            </div>
          </>
        )}
      </div>
    )
  }
}

export const Titlebar = withStyles(styles)(_Titlebar)
