import React, { Component } from 'react'

// Styles
import { styles } from './DesktopNotifications.styles'

// UI
import {
  VeggieName,
  CondensedHeader,
  P,
} from '../../../../components'

// Packages
import withStyles, { WithStyles } from 'react-jss'
// import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {}

class _DesktopNotifications extends Component<Props> {
  render() {
    return (
      <>
        <div className="header">
          <VeggieName>Coming Soon</VeggieName>
          <CondensedHeader>Desktop Notifications</CondensedHeader>
        </div>
        <div className="main">
          <P>In case there’s some Salad Fixins’ we’ve got to tell you about.</P>
        </div>
      </>
    )
  }
}

export const DesktopNotifications = withStyles(styles)(_DesktopNotifications)
