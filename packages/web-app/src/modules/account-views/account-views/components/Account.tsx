import { Layout, Text, TextField } from '@saladtechnologies/garden-components'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Divider, Head } from '../../../../components'
import { withLogin } from '../../../auth-views'
import { Avatar, Profile } from '../../../profile/models'
import {AvatarSelect} from './AvatarSelect'

const styles = {
  container: {
    padding: 20,
    height: '100vh',
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
  },
}

interface Props extends WithStyles<typeof styles> {
  profile?: Profile
  avatars?: Avatar[]
  isUpdating?: boolean
  onUpdateUsername: (data : FormValues) => void
  onUpdateMinecraftUsername: (data : FormValues) => void
}

export type FormValues = {
  input: string
}
class _Account extends Component<Props> {
  render() {

    const {  profile, onUpdateUsername, onUpdateMinecraftUsername, classes, avatars } = this.props

    return (
      <div className={classes.container}>
        <Layout title="Profile">
          <TextField placeholder={profile?.username} errorMessage="Username must be between 2 - 32 characters and can not contain spaces!" label="Username" onSubmit={onUpdateUsername} validationRegex={/^\w{2,32}$/} />
          <Divider />
          {avatars && (
            <>
          <AvatarSelect avatars={avatars}/>
          <Divider />
          </>
          )}


          <Text as="h1"> Extras</Text>
          <TextField
            placeholder={profile?.extensions?.minecraftUsername}
            errorMessage="Not a valid Minecraft username!"
            label="Minecraft Username"
            onSubmit={onUpdateMinecraftUsername}
            validationRegex={/^\w{3,16}$/}
          />
          <Text as="h4">
            Connect Salad to your Minecraft account. A Minecraft username is required to purchase many Minecraft items
          </Text>

          <Head title="Account" />

        </Layout>
      </div>
    )
  }
}

export const Account = withLogin(withStyles(styles)(_Account))
