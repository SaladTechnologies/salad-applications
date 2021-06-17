import { Layout, Text, TextField } from '@saladtechnologies/garden-components'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Head } from '../../../../components'
import { SaladTheme } from '../../../../SaladTheme'
import { withLogin } from '../../../auth-views'
import { Avatar, Profile } from '../../../profile/models'
import { AvatarSelect } from './AvatarSelect'

const styles = (theme: SaladTheme) => ({
  container: {
    flex: 1,
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
  },
  textContainer: {
    color: theme.darkBlue,
    paddingBottom: '25px',
  },
  textFieldContainer: {
    color: theme.darkBlue,
    width: '400px',
    paddingBottom: '36px',
  },
  minecraftInfoContainer: {
    color: theme.darkBlue,
    width: '400px',
  },
  avatarContainer: {
    paddingBottom: '58px',
  },
  titleContainer: {
    paddingBottom: '35px',
  },
})

interface Props extends WithStyles<typeof styles> {
  avatarError?: {
    avatarId: string
    message: string
  }
  avatars?: Avatar[]
  isAvatarSubmitting: boolean
  onClearAvatarError: () => void
  onSelectAvatar: (id: string) => void
  onUpdateMinecraftUsername: (data: FormValues) => void
  onUpdateUsername: (data: FormValues) => void
  profile?: Profile
  selectedAvatar?: Avatar
}

export type FormValues = {
  input: string
}
class _Account extends Component<Props> {
  render() {
    const {
      profile,
      onUpdateUsername,
      avatarError,
      isAvatarSubmitting,
      onClearAvatarError,
      onUpdateMinecraftUsername,
      onSelectAvatar,
      classes,
      avatars,
      selectedAvatar,
    } = this.props

    return (
      <div className={classes.container}>
        <Layout>
          <div className={classes.titleContainer}>
            <Text variant="baseXXL"> Profile </Text>
          </div>
          <Head title="Profile" />
          <div className={classes.textFieldContainer}>
            <TextField
              placeholder={profile?.username}
              errorMessage="Username must be between 2 - 32 characters and can not contain spaces!"
              label="Username"
              onSubmit={onUpdateUsername}
              validationRegex={/^\w{2,32}$/}
              width={396}
            />
          </div>

          {avatars && (
            <div className={classes.avatarContainer}>
              <div className={classes.textContainer}>
                <Text variant="baseM"> Avatar </Text>
              </div>
              <AvatarSelect
                avatars={avatars}
                error={avatarError}
                isSubmitting={isAvatarSubmitting}
                onClearError={onClearAvatarError}
                onSelectAvatar={onSelectAvatar}
                selectedAvatar={selectedAvatar}
              />
            </div>
          )}

          <div className={classes.textContainer}>
            <Text variant="baseXXL"> Extras</Text>
          </div>
          <div className={classes.textFieldContainer}>
            <TextField
              placeholder={profile?.extensions?.minecraftUsername}
              errorMessage="Not a valid Minecraft username!"
              label="Minecraft Username"
              onSubmit={onUpdateMinecraftUsername}
              validationRegex={/^\w{3,16}$/}
              width={396}
            />
          </div>
          <div className={classes.minecraftInfoContainer}>
            <Text variant="baseS">
              Connect Salad to your Minecraft account. A Minecraft username is required to purchase many Minecraft items
            </Text>
          </div>
        </Layout>
      </div>
    )
  }
}

export const Account = withLogin(withStyles(styles)(_Account))
