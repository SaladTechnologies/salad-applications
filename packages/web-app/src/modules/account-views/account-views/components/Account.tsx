import classnames from 'classnames'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Head } from '../../../../components'
import { withLogin } from '../../../auth-views'
import { Profile } from '../../../profile/models'
import { EditUsername } from './EditUsername'

const styles = {
  container: {
    padding: 20,
  },
}

interface Props extends WithStyles<typeof styles> {
  profile?: Profile
  sending?: boolean
  onSend?: (username: string) => void
}

class _Account extends Component<Props> {
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
