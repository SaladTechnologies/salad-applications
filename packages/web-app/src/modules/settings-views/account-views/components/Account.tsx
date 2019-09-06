import React, { Component } from 'react'

// Styles
import { styles } from './Account.styles'

// UI
import {
  CondensedHeader,
  // P,
  Divider,
  Button,
} from '../../../../components'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

// Components
import { EditUsername } from './EditUsername'
import { Profile } from '../../../profile/models'

interface Props extends WithStyles<typeof styles> {
  onLogout?: () => void
  profile?: Profile
  sending?: boolean
  onSend?: (username: string) => void
}

class _Account extends Component<Props> {
  handleLogout = () => {
    const { onLogout } = this.props

    if (onLogout) onLogout()
  }

  render() {
    const { profile, onSend, sending, classes } = this.props

    return (
      <>
        <div className="header">
          <CondensedHeader>Account</CondensedHeader>
        </div>
        <Divider />
        <div className={classnames(classes.container)}>
          <EditUsername profile={profile} onSend={onSend} sending={sending} />

          <Button className={classes.logoutButton} dark uppercase onClick={this.handleLogout}>Log out</Button>
        </div>
      </>
    )
  }
}

export const Account = withStyles(styles)(_Account)
