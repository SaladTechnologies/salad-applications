import React, { Component } from 'react'

// Store
import { getStore } from '../../../Store'

// Styles
import { styles } from './Settings.styles'

// UI
import { LinkListUnstyled } from '../../../components'
import { Button } from '../../../components'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { Route } from 'react-router'

// Components
import { Overlay } from '../../../components'
import { SmartStartContainer } from '../smart-start-views'
import { WindowsSettingsContainer } from '../windows-settings-views'
import { ComingSoonContainer } from '../coming-soon-views'
import { BatterySaverContainer } from '../battery-saver-views'
import { DesktopNotificationsContainer } from '../desktop-notifications-views'

export class MenuItem {
  constructor(public readonly url: string, public readonly text: string) {}
}

interface Props extends WithStyles<typeof styles> {
  onCloseClicked?: () => void
  onSendBug?: () => void
  onListItemClick?: (url: string) => any
  menuItems?: MenuItem[]
}

class _Settings extends Component<Props> {
  store = getStore()

  handleBugClicked = () => {
    const { onSendBug } = this.props

    if (onSendBug) onSendBug()
  }

  handleCloseClicked = () => {
    const { onCloseClicked } = this.props

    if (onCloseClicked) onCloseClicked()
  }

  handleListItemClick = (url: string) => {
    const { onListItemClick } = this.props

    if (onListItemClick) onListItemClick(url)
  }

  render() {
    const { classes, menuItems } = this.props

    return (
      <Overlay>
        <div className={classnames(classes.menu, classes.menuItems)}>
          <div>{menuItems && <LinkListUnstyled list={menuItems} onListItemClick={this.handleListItemClick} />}</div>
          <div className={classes.buttonContainer}>
            <Button onClick={this.handleBugClicked}>Send bug</Button>
            <Button onClick={this.handleCloseClicked}>Close</Button>
          </div>
        </div>
        <div className={classnames(classes.settings)}>
          <Route path="/settings/smart-start" component={SmartStartContainer} />
          <Route path="/settings/battery-saver" component={BatterySaverContainer} />
          <Route path="/settings/desktop-notifications" component={DesktopNotificationsContainer} />
          <Route path="/settings/windows-settings" component={WindowsSettingsContainer} />
          <Route path="/settings/coming-soon" component={ComingSoonContainer} />
        </div>
      </Overlay>
    )
  }
}

export const Settings = withStyles(styles)(_Settings)
