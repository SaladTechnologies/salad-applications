import { AvatarSelectionForm, Button, Layout, Text, TextField } from '@saladtechnologies/garden-components'
import type { FC } from 'react'
import { useEffect } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { useLocation } from 'react-router'
import type { SaladTheme } from '../../../../SaladTheme'
import { DefaultTheme } from '../../../../SaladTheme'
import { Head } from '../../../../components'
import { withLogin } from '../../../auth-views'
import { type Passkey } from '../../../passkey-setup'
import type { Avatar, Profile } from '../../../profile/models'
import { AccountSecurityContainer } from './AccountSecurity/AccountSecurityContainer'
import { AccountTermsAndConditionsUpdate } from './AccountTermsAndConditionsUpdate'
import { GoogleSignInForm } from './GoogleSignInForm'
import { PayPalLoginButton } from './PayPalLoginButton'

const styles = (theme: SaladTheme) => ({
  container: {
    flex: 1,
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
    color: theme.darkBlue,
  },
  headingContainer: {
    paddingBottom: 32,
  },
  subheadingContainer: {
    paddingBottom: 40,
  },
  fieldContainer: {
    maxWidth: 400,
  },
  titleContainer: {
    paddingBottom: 35,
  },
  avatarContainer: {
    paddingTop: 66,
  },
  accountConnectionsContainer: {
    paddingTop: 56,
  },
  connectAccountDescription: {
    maxWidth: 400,
    paddingTop: 15,
  },
  accountConnectionItem: {
    paddingTop: 56,
  },
  connectAccountButtonContainer: {
    maxWidth: 400,
  },
  disconnectButtonContainer: {
    marginTop: 12,
  },
  paypalIdContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    overflowWrap: 'anywhere',
    alignItems: 'center',
  },
  connectedGoogleAccountEmail: {
    maxWidth: 400,
    paddingTop: 5,
    wordWrap: 'break-word',
  },
  minecraftConnectText: {
    maxWidth: 400,
    paddingTop: 20,
  },
  connectAccountError: {
    paddingTop: 10,
    color: '#811417',
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
  connectedGoogleAccountEmail?: string
  isLoadConnectedGoogleAccountEmailError: boolean
  loadGoogleAccountConnection: () => void
  disconnectPayPalId: () => void
  isPayPalIdDisconnectLoading: boolean
  checkPayPalId: () => void
  isSubmitting: boolean
  isTermsAndConditionsAccepted: boolean
  passkeys: Passkey[]
  onToggleAcceptTermsAndConditions: (accepted: boolean) => void
  onSubmitTermsAndConditions: () => void
  fetchPasskeys: () => void
  onAddPasskeyClick: () => void
  onDeletePasskeyClick: (passkeyId: string) => void
  checkPayPalIdWithInterval: () => void
  logInWithPayPalChallengeSudoMode: () => void
  signInWithGoogleChallengeSudoMode: (signInWithGoogle: () => void) => void
}

export type FormValues = {
  input?: string
}

const _Account: FC<Props> = ({
  loadPayPalId,
  loadGoogleAccountConnection,
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
  connectedGoogleAccountEmail,
  isLoadConnectedGoogleAccountEmailError,
  isPayPalIdDisconnectLoading,
  isSubmitting,
  isTermsAndConditionsAccepted,
  onSubmitTermsAndConditions,
  onToggleAcceptTermsAndConditions,
  checkPayPalIdWithInterval,
  logInWithPayPalChallengeSudoMode,
  signInWithGoogleChallengeSudoMode,
}) => {
  const location = useLocation<{ isGoogleSignInFormTriggered: string; isPayPalLogInTriggered: string }>()
  const isGoogleSignInFormTriggered = !!location.state?.isGoogleSignInFormTriggered
  const isPayPalLogInTriggered = !!location.state?.isPayPalLogInTriggered

  useEffect(() => {
    loadPayPalId()
    loadGoogleAccountConnection()
  }, [loadGoogleAccountConnection, loadPayPalId])

  useEffect(() => {
    if (isPayPalLogInTriggered) {
      checkPayPalIdWithInterval()
    }
  }, [isPayPalLogInTriggered, checkPayPalIdWithInterval])

  const shouldShowUpdateAccountTermsAndConditions = !!profile?.pendingTermsVersion
  const handleSubmitButtonReset = () => {
    isUserNameSubmitSuccess && onResetUsernameSuccess()
    isMinecraftUserNameSubmitSuccess && onResetMinecraftUsernameSuccess()
  }

  return (
    <div className={classes.container}>
      <Scrollbars>
        <Layout title="Profile">
          <Head title="Profile" />
          {shouldShowUpdateAccountTermsAndConditions && (
            <AccountTermsAndConditionsUpdate
              isSubmitting={isSubmitting}
              isTermsAndConditionsAccepted={isTermsAndConditionsAccepted}
              onSubmitTermsAndConditions={onSubmitTermsAndConditions}
              onToggleAcceptTermsAndConditions={onToggleAcceptTermsAndConditions}
            />
          )}
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
          <div className={classes.accountConnectionsContainer}>
            <Text variant="baseXL">Account Connections</Text>
            <div className={classes.accountConnectionItem}>
              <div className={classes.subheadingContainer}>
                <Text variant="baseL">PayPal</Text>
              </div>
              <div className={classes.connectAccountButtonContainer}>
                {payPalId ? (
                  <Text variant="baseXL">
                    <div className={classes.paypalIdContainer}>{payPalId}</div>
                    <div className={classes.disconnectButtonContainer}>
                      <Button
                        onClick={disconnectPayPalId}
                        isLoading={isPayPalIdDisconnectLoading}
                        label={'Unlink PayPal Account'}
                        outlineColor={DefaultTheme.darkBlue}
                        variant={'outlined'}
                      />
                    </div>
                  </Text>
                ) : (
                  <>
                    <PayPalLoginButton logInWithPayPalChallengeSudoMode={logInWithPayPalChallengeSudoMode} />
                    <div className={classes.connectAccountDescription}>
                      <Text variant="baseS">
                        Connect Salad to your PayPal account. A PayPal account is required to redeem all PayPal rewards.
                        This enables transferring Salad Balance to your PayPal wallet.
                      </Text>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className={classes.accountConnectionItem}>
              <div className={classes.subheadingContainer}>
                <Text variant="baseL">Google</Text>
              </div>
              <div className={classes.connectAccountButtonContainer}>
                {connectedGoogleAccountEmail ? (
                  <>
                    <Text variant="baseS">Google Email Address</Text>
                    <Text variant="baseL">
                      <div className={classes.connectedGoogleAccountEmail}>{connectedGoogleAccountEmail}</div>
                    </Text>
                  </>
                ) : (
                  <>
                    <GoogleSignInForm
                      isTermsAndConditionsAccepted={isTermsAndConditionsAccepted}
                      isTermsAndConditionsRequired={shouldShowUpdateAccountTermsAndConditions}
                      isGoogleSignInFormTriggered={isGoogleSignInFormTriggered}
                      signInWithGoogleChallengeSudoMode={signInWithGoogleChallengeSudoMode}
                    />
                    {isLoadConnectedGoogleAccountEmailError && (
                      <div className={classes.connectAccountError}>
                        <Text variant="baseS">
                          Unable to fetch connected Google Account. Please try to refresh the page.
                        </Text>
                      </div>
                    )}
                    <div className={classes.connectAccountDescription}>
                      <Text variant="baseS">
                        Connect Salad to your Google account. A Google account allows you to sign in easily to Salad
                        using Google SSO.
                      </Text>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className={classes.accountConnectionItem}>
              <div className={classes.subheadingContainer}>
                <Text variant="baseL">Minecraft</Text>
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
              <div className={classes.minecraftConnectText}>
                <Text variant="baseS">
                  Connect Salad to your Minecraft account. A Minecraft username is required to redeem many Minecraft
                  rewards.
                </Text>
              </div>
            </div>
          </div>
          <AccountSecurityContainer />
        </Layout>
      </Scrollbars>
    </div>
  )
}

export const Account = withLogin(withStyles(styles)(_Account))
