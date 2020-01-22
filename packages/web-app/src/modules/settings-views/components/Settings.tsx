import React, { Component } from 'react'

// Styles
import { styles } from './Settings.styles'

// UI
import { LinkListUnstyled, MenuTitle, Button, Divider } from '../../../components'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { Route } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

// Components
import { Overlay } from '../../../components'
import { SmartStartContainer } from '../smart-start-views'
import { WindowsSettingsContainer } from '../windows-settings-views'
import { DesktopNotificationsContainer } from '../desktop-notifications-views'
import { ReferralSettingsContainer } from '../referral-views'
import { AccountContainer } from '../account-views'
import { VaultListContainer } from '../../vault-views'

export class MenuItem {
  constructor(public readonly url: string, public readonly text: string) {}
}

interface Props extends WithStyles<typeof styles> {
  onCloseClicked?: () => void
  onCloseKeyPress?: () => void
  onSendBug?: () => void
  onListItemClick?: (url: string) => any
  menuItems?: MenuItem[]
  appVersion?: string
  appBuild?: string
  onSendLog?: () => void
  latestDesktop?: boolean
  onDownloadLatestDesktop?: () => void
}

class _Settings extends Component<Props> {
  state = {
    buttonToggle: false,
  }

  componentDidMount() {
    document.addEventListener('keyup', this.handleCloseKeyPress)
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleCloseKeyPress)
  }

  handleBugClicked = () => {
    const { onSendBug } = this.props

    if (onSendBug) onSendBug()
  }

  handleLogClicked = () => {
    const { onSendLog } = this.props

    this.setState({
      buttonToggle: !this.state.buttonToggle,
    })

    if (onSendLog) onSendLog()
  }

  handleCloseClicked = () => {
    const { onCloseClicked } = this.props

    if (onCloseClicked) onCloseClicked()
  }

  handleCloseKeyPress = (e: any) => {
    if (e.key === 'Escape') {
      const { onCloseKeyPress } = this.props
      if (onCloseKeyPress) onCloseKeyPress()
    }
  }

  handleListItemClick = (url: string) => {
    const { onListItemClick } = this.props

    if (onListItemClick) onListItemClick(url)
  }

  handleDownloadLatest = () => {
    const { onDownloadLatestDesktop } = this.props

    if (onDownloadLatestDesktop) onDownloadLatestDesktop()
  }

  render() {
    const { appVersion, appBuild, classes, menuItems, latestDesktop } = this.props

    return (
      <Overlay>
        <div className={classnames(classes.menu, classes.menuItems)}>
          {menuItems && <LinkListUnstyled list={menuItems} onListItemClick={this.handleListItemClick} />}

          <div className={classes.buttonContainer}>
            <Button onClick={this.handleBugClicked}>Submit Bug</Button>
            <Button onClick={this.handleLogClicked}>{this.state.buttonToggle ? 'Logs sent' : 'Send logs'}</Button>
          </div>
          <div className={classes.versionContainer}>
            <MenuTitle className={classnames({ [classes.outOfDateLabel]: !latestDesktop })}>
              Version: {appVersion ? appVersion : '-'}
            </MenuTitle>
            <MenuTitle>Build: {appBuild ? appBuild.slice(0, 7) : '-'}</MenuTitle>
          </div>
          {!latestDesktop && (
            <div className={classes.updateSalad}>
              <Divider />
              <Button onClick={this.handleDownloadLatest}>Download Latest Version</Button>
            </div>
          )}
        </div>
        <div className={classnames(classes.settings)}>
          <Route path="/settings/smart-start" component={SmartStartContainer} />
          <Route path="/settings/desktop-notifications" component={DesktopNotificationsContainer} />
          <Route path="/settings/windows-settings" component={WindowsSettingsContainer} />
          <Route path="/settings/referrals" component={ReferralSettingsContainer} />
          <Route path="/settings/account" component={AccountContainer} />
          <Route path="/settings/reward-vault" component={VaultListContainer} />

          <div onClick={this.handleCloseClicked}>
            <FontAwesomeIcon className={classes.closeButton} icon={faTimes} />
          </div>
        </div>
      </Overlay>
    )
  }
}

export const Settings = withStyles(styles)(_Settings)
