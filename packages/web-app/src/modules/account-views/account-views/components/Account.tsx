import {
  AvatarSelectionForm,
  Layout,
  SvgIconButton,
  Text,
  TextField,
} from '@saladtechnologies/garden-components'
import { Component } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import withStyles, { WithStyles } from 'react-jss'
import { Head } from '../../../../components'
import { SaladTheme } from '../../../../SaladTheme'
import { withLogin } from '../../../auth-views'
import { Avatar, Profile } from '../../../profile/models'
import { Disconnect } from './assets/Disconnect'
import { PayPalLoginButton } from './PayPalLoginButton'

const styles = (theme: SaladTheme) => ({
  container: {
    flex: 1,
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
  },
  headingContainer: {
    color: theme.darkBlue,
    paddingBottom: '25px',
  },
  subheadingContainer: {
    color: theme.darkBlue,
    paddingBottom: '7px',
  },
  fieldContainer: {
    color: theme.darkBlue,
    maxWidth: '400px',
    paddingBottom: '36px',
  },
  avatarContainer: {
    paddingBottom: '58px',
  },
  titleContainer: {
    paddingBottom: '35px',
  },
  payPalAccountContainer: {
    color: theme.darkBlue,
    maxWidth: '400px',
    paddingBottom: '12px',
  },
  disconnectButton: {
    backgroundColor: theme.darkBlue,
    padding: '12px',
    display: 'inline-flex',
    position: 'relative',
  },
  paypalIdContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    overflowWrap: 'anywhere',
    alignItems: 'center',
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
  payPalId?: string
  loadPayPalId: () => void
  disconnectPayPalId: () => void
  isPayPalIdDisconnectLoading: boolean
  checkPayPalId: () => void
}

let intervalId: NodeJS.Timer
const maxPaypalLoadRetries = 60

export type FormValues = {
  input?: string
}

interface State {
  payPalLoadRetries: number
}

class _Account extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      payPalLoadRetries: 0,
    }
  }

  componentDidMount() {
    this.props.loadPayPalId()
  }

  componentWillUnmount() {
    clearInterval(intervalId)
  }

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
      payPalId,
      disconnectPayPalId,
      isPayPalIdDisconnectLoading,
    } = this.props

    const handleSubmitButtonReset = () => {
      isUserNameSubmitSuccess && onResetUsernameSuccess()
      isMinecraftUserNameSubmitSuccess && onResetMinecraftUsernameSuccess()
    }

    if (this.state.payPalLoadRetries === maxPaypalLoadRetries || payPalId) {
      clearInterval(intervalId)
    }

    const handleCheckPayPalId = () => {
      clearInterval(intervalId)
      this.setState({payPalLoadRetries: 0})
      intervalId = setInterval(() => {
        this.props.loadPayPalId()
        this.setState((previousCount) => ({
          payPalLoadRetries: previousCount.payPalLoadRetries + 1
        }))
      }, 5000)
    }

    return (
      <div className={classes.container}>
        <Scrollbars>
          <Layout title="Profile">
            <Head title="Profile" />
            <div className={classes.fieldContainer}>
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
                <div className={classes.headingContainer}>
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
            <div className={classes.headingContainer}>
              <Text variant="baseXL">Extras</Text>
            </div>
            <div className={classes.fieldContainer}>
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
            <div className={classes.fieldContainer}>
              <Text variant="baseS">
                Connect Salad to your Minecraft account. A Minecraft username is required to redeem many Minecraft
                rewards.
              </Text>
            </div>
            <div className={classes.subheadingContainer}>
              <Text variant="baseL">PayPal</Text>
            </div>
            <div className={classes.payPalAccountContainer}>
              <Text variant="baseS">
                Connect Salad to your PayPal account. A PayPal account is required to redeem all PayPal rewards. This
                enables transfering Salad Balance to your PayPal wallet.
              </Text>
            </div>
            <div className={classes.fieldContainer}>
              {payPalId ? (
                <Text variant="baseXL">
                  <div className={classes.paypalIdContainer}>
                    {payPalId}
                    <SvgIconButton
                      onClick={disconnectPayPalId}
                      isLoading={isPayPalIdDisconnectLoading}
                      icon={<Disconnect />}
                    />
                  </div>
                </Text>
              ) : (
                <PayPalLoginButton onClick={handleCheckPayPalId} />
              )}
            </div>
          </Layout>
        </Scrollbars>
      </div>
    )
  }
}

export const Account = withLogin(withStyles(styles)(_Account))
