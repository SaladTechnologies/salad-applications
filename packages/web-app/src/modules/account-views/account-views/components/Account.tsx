import { AvatarSelectionForm, Layout, Text, TextField } from '@saladtechnologies/garden-components'
import { Component } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import withStyles, { WithStyles } from 'react-jss'
import { Head } from '../../../../components'
import { SaladTheme } from '../../../../SaladTheme'
import { withLogin } from '../../../auth-views'
import { Avatar, Profile } from '../../../profile/models'

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
    avatar: string
    message: string
  }
  avatars?: Avatar[]
  submittingAvatar?: string
  onClearAvatarError: () => void
  onSelectAvatar: (id?: string) => void
  onUpdateMinecraftUsername: (data: FormValues) => void
  onUpdateUsername: (data: FormValues) => void
  onResetMinecraftUsernameSuccess: () => void
  onResetUsernameSuccess: () => void
  profile?: Profile
  selectedAvatar?: string
  isUserNameSubmitting: boolean
  isUserNameSubmitSuccess: boolean
  isMinecraftUserNameSubmitting: boolean
  isMinecraftUserNameSubmitSuccess: boolean
}

export type FormValues = {
  input?: string
}

class _Account extends Component<Props> {
  render() {
    const {
      profile,
      onUpdateUsername,
      avatarError,
      submittingAvatar,
      onClearAvatarError,
      onUpdateMinecraftUsername,
      onSelectAvatar,
      onResetUsernameSuccess,
      onResetMinecraftUsernameSuccess,
      classes,
      avatars,
      selectedAvatar,
      isUserNameSubmitting,
      isUserNameSubmitSuccess,
      isMinecraftUserNameSubmitting,
      isMinecraftUserNameSubmitSuccess,
    } = this.props
    const handleSubmitButtonReset = () => {
      isUserNameSubmitSuccess && onResetUsernameSuccess()
      isMinecraftUserNameSubmitSuccess && onResetMinecraftUsernameSuccess()
    }
    return (
      <div className={classes.container}>
        <Scrollbars>
          <Layout title="Profile">
            <Head title="Profile" />
            <div className={classes.textFieldContainer}>
              <TextField
                isSubmitting={isUserNameSubmitting}
                isSubmitSuccess={isUserNameSubmitSuccess}
                validationRegexErrorMessage="Username must be between 2 - 32 characters and can not contain spaces!"
                label="Username"
                onSubmit={onUpdateUsername}
                validationRegex={/^\w{2,32}$/}
                onFocus={handleSubmitButtonReset}
                defaultValue={profile?.username}
              />
            </div>

            {avatars && (
              <div className={classes.avatarContainer}>
                <div className={classes.textContainer}>
                  <Text variant="baseXL"> Avatar </Text>
                </div>
                <AvatarSelectionForm
                  avatars={avatars}
                  error={avatarError}
                  submittingAvatar={submittingAvatar}
                  onResetError={onClearAvatarError}
                  onSelectAvatar={onSelectAvatar}
                  selectedAvatar={selectedAvatar}
                />
              </div>
            )}
            <div className={classes.textContainer}>
              <Text variant="baseXL"> Extras</Text>
            </div>
            <div className={classes.textFieldContainer}>
              <TextField
                isSubmitting={isMinecraftUserNameSubmitting}
                isSubmitSuccess={isMinecraftUserNameSubmitSuccess}
                validationRegexErrorMessage="Not a valid Minecraft username!"
                label="Minecraft Username"
                onSubmit={onUpdateMinecraftUsername}
                validationRegex={/^\w{3,16}$/}
                onFocus={handleSubmitButtonReset}
                defaultValue={profile?.extensions?.minecraftUsername}
              />
            </div>
            <div className={classes.minecraftInfoContainer}>
              <Text variant="baseS">
                Connect Salad to your Minecraft account. A Minecraft username is required to purchase many Minecraft
                items
              </Text>
            </div>
          </Layout>
        </Scrollbars>
      </div>
    )
  }
}

export const Account = withLogin(withStyles(styles)(_Account))
