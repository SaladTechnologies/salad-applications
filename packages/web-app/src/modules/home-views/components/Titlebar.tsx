import { faClone, faMinus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import React, { Component } from 'react'
import { Img } from 'react-image'
import withStyles, { WithStyles } from 'react-jss'
import { SmartLink } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { AccountMenuContainer } from '../../account-views/account-menu'
import { TitleStartButtonContainer } from '../../machine-views'
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
    marginTop: 2,
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
})

interface Props extends WithStyles<typeof styles> {
  isDesktop?: boolean
  bottomBorder?: boolean
  onMinimize?: () => void
  onMaximize?: () => void
  onClose?: () => void
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

  render() {
    const { isDesktop, menuItems, bottomBorder, classes } = this.props

    return (
      <div className={classnames(classes.container, { [classes.bottomBorder]: bottomBorder })}>
        <div className={classes.leftItems}>
          <div className={classes.icon}>
            <SmartLink to="/">
              <Img height={24} src={icon} />
            </SmartLink>
          </div>
          {isDesktop && menuItems && <TitleStartButtonContainer />}
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
