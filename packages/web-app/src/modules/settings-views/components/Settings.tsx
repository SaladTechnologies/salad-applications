import React, { Component } from 'react'

// Styles
import { styles } from './Settings.styles'

// UI
import { 
  MenuTitle,
  LinkListUnstyled
} from '../../../ui'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { Route } from 'react-router'

// Components
import { Overlay } from '../../../components'
import { SmartStartContainer } from '../../smart-start-views'
import { WindowsSettingsContainer } from '../../windows-settings-views'

interface Props extends WithStyles<typeof styles> {
  // onCloseClicked?: () => void
  onSendBug?: () => void
  onListItemClick?: (url: string) => any
}

class _Settings extends Component<Props> {
  handleBugClicked = () => {
    const { onSendBug } = this.props

    if (onSendBug) onSendBug()
  }

  handleListItemClick = (url: string) => {
    const { onListItemClick } = this.props

    console.log('[Settings] handleListItemClick')

    if (onListItemClick) onListItemClick(url)
  }

  render() {
    type LinkList = { url: string, text: string }

    const { classes } = this.props

    const menuList: LinkList[] = [
      { url: '/settings/smart-start', text: 'Smart Start' },
      { url: '/settings/coming-soon', text: 'Battery Saver' },
      { url: '/settings/coming-soon', text: 'Desktop Notification (Couldn\'t this go under Windows Settings?)' },
    ]
    const menuWindowsList: LinkList[] = [
      { url: '/settings/windows-settings', text: 'Windows Settings' },
    ]

    return (
      <Overlay>
        <aside className={classnames(classes.menu, classes.menuItems)}>
          <nav>
            <MenuTitle value="App Settings" />
            <LinkListUnstyled list={menuList} onListItemClick={this.handleListItemClick} />
            <hr />
            <LinkListUnstyled list={menuWindowsList} onListItemClick={this.handleListItemClick} />
          </nav>
          <div className={classnames('')}>
            <div className={classes.bugButton} onClick={this.handleBugClicked}>
              Send Bug
            </div>
          </div>
        </aside>
        <section className={classnames(classes.settings)}>
          <Route path="/settings/smart-start" component={SmartStartContainer} />
          <Route path="/settings/windows-settings" component={WindowsSettingsContainer} />
        </section>
      </Overlay>
    )
  }
}

export const Settings = withStyles(styles)(_Settings)
