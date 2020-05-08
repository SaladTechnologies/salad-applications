import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { EditUsername } from './EditUsername'
import { Profile } from '../../../profile/models'
import { Head } from '../../../../components'
import { withLogin } from '../../../auth-views'

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
        <Head title="Account" />
        <div className={classnames(classes.container)}>
          <EditUsername profile={profile} onSend={onSend} sending={sending} />
        </div>
      </div>
    )
  }
}

export const Account = withLogin(withStyles(styles)(_Account))
