import classnames from 'classnames'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Divider, Head } from '../../../../components'
import { withLogin } from '../../../auth-views'
import { Profile } from '../../../profile/models'
import { EditUsername } from './EditUsername'
import { MinecraftUsername } from './MinecraftUsername'

const styles = {
  container: {
    padding: 20,
  },
}

interface Props extends WithStyles<typeof styles> {
  profile?: Profile
  isUpdating?: boolean
  onUpdateUsername: (username: string) => void
  onUpdateMinecraftUsername: (username: string) => void
}

class _Account extends Component<Props> {
  render() {
    const { profile, onUpdateUsername, onUpdateMinecraftUsername, isUpdating, classes } = this.props

    return (
      <div className={classes.container}>
        <Head title="Account" />
        <div className={classnames(classes.container)}>
          <EditUsername profile={profile} onUpdate={onUpdateUsername} isUpdating={isUpdating} />
          <Divider />
          <MinecraftUsername
            username={profile?.extensions?.minecraftUsername}
            onUpdate={onUpdateMinecraftUsername}
            isUpdating={isUpdating}
          />
        </div>
      </div>
    )
  }
}

export const Account = withLogin(withStyles(styles)(_Account))
