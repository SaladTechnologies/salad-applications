import React, { Component } from 'react'
import { CondensedHeader, Divider } from '../../../../components'
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { EditUsername } from './EditUsername'
import { Profile } from '../../../profile/models'

const styles = {
  container: {
    padding: 20,
  },
}

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
      <div className={classes.container}>
        <div className="header">
          <CondensedHeader>Account</CondensedHeader>
        </div>
        <Divider />
        <div className={classnames(classes.container)}>
          <EditUsername profile={profile} onSend={onSend} sending={sending} />
        </div>
      </div>
    )
  }
}

export const Account = withStyles(styles)(_Account)
