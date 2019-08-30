import React, { Component } from 'react'

// Store
import { getStore } from '../../../Store'

// Styles
import { styles } from './Settings.styles'

// UI
import { LinkListUnstyled, MenuTitle } from '../../../components'
import { Button } from '../../../components'

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
import { ComingSoonContainer } from '../coming-soon-views'
import { BatterySaverContainer } from '../battery-saver-views'
import { DesktopNotificationsContainer } from '../desktop-notifications-views'
import { ReferralSettingsContainer } from '../../referral-views'
import { ProfileSettingsPageContainer } from '../../profile-views/ProfileSettingsPageContainer';

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
}

class _Settings extends Component<Props> {
  store = getStore()

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

  render() {
    const { appVersion, appBuild, classes, menuItems } = this.props

    return (
      <Overlay>
        <div className={classnames(classes.menu, classes.menuItems)}>
          <div>{menuItems && <LinkListUnstyled list={menuItems} onListItemClick={this.handleListItemClick} />}</div>
          <div className={classes.buttonContainer}>
            <Button onClick={this.handleBugClicked}>Send bug</Button>
          </div>
          <div className={classes.versionContainer}>
            <MenuTitle>Version: {appVersion ? appVersion : '-'}</MenuTitle>
            <MenuTitle>Build: {appBuild ? appBuild.slice(0, 7) : '-'}</MenuTitle>
          </div>
        </div>
        <div className={classnames(classes.settings)}>
          <Route path="/settings/smart-start" component={SmartStartContainer} />
          <Route path="/settings/battery-saver" component={BatterySaverContainer} />
          <Route path="/settings/desktop-notifications" component={DesktopNotificationsContainer} />
          <Route path="/settings/windows-settings" component={WindowsSettingsContainer} />
          <Route path="/settings/coming-soon" component={ComingSoonContainer} />
          <Route path="/settings/referrals" component={ReferralSettingsContainer} />
          <Route path="/settings/profile" component={ProfileSettingsPageContainer} />

          {/* <Button onClick={this.handleCloseClicked}>Close</Button> */}
          <div onClick={this.handleCloseClicked}>
            <FontAwesomeIcon className={classes.closeButton} icon={faTimes} />
          </div>
        </div>
      </Overlay>
    )
  }
}

export const Settings = withStyles(styles)(_Settings)
