import React, { Component } from 'react'

// Styles
import { styles } from './DesktopNotifications.styles'

// UI
import {
  VeggieName,
  CondensedHeader,
  Body,
} from '../../../../ui'

// Packages
import withStyles, { WithStyles } from 'react-jss'
// import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {

}

class _DesktopNotifications extends Component<Props> {
  render() {
    return (
      <>
        <header>
          <VeggieName value="Coming Soon" />
          <CondensedHeader value="Desktop Notifications" />
        </header>
        <main>
          <Body>
            In case there’s some Salad Fixins’ we’ve got to tell you about.
          </Body>
        </main>
      </>
    )
  }
}

export const DesktopNotifications = withStyles(styles)(_DesktopNotifications)
