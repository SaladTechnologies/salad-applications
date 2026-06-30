import { AvatarSelectionForm, Layout, Text, TextField } from '@saladtechnologies/garden-components'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { useLocation } from 'react-router'
import type { SaladTheme } from '../../../../SaladTheme'
import { Head } from '../../../../components'
import { withLogin } from '../../../auth-views'
import { type Passkey } from '../../../passkey-setup'
import type { Avatar, Profile } from '../../../profile/models'
import { renderRewardsEnabled } from '../../../render'
import { solanaWalletAnchorId } from '../../../solana-wallet'
import { AccountSecurityContainer } from './AccountSecurity/AccountSecurityContainer'
import { AccountTermsAndConditionsUpdate } from './AccountTermsAndConditionsUpdate'
import { GoogleSignInForm } from './GoogleSignInForm'
import { SolanaWalletContainer } from './SolanaWallet'

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
  connectedGoogleAccountEmail?: string
  isLoadConnectedGoogleAccountEmailError: boolean
  loadGoogleAccountConnection: () => void
  isSubmitting: boolean
  isTermsAndConditionsAccepted: boolean
  passkeys: Passkey[]
  onToggleAcceptTermsAndConditions: (accepted: boolean) => void
  onSubmitTermsAndConditions: () => void
  fetchPasskeys: () => void
  onAddPasskeyClick: () => void
  onDeletePasskeyClick: (passkeyId: string) => void
  signInWithGoogleChallengeSudoMode: (signInWithGoogle: () => void) => void
}

export type FormValues = {
  input?: string
}

const _Account: FC<Props> = ({
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
  connectedGoogleAccountEmail,
  isLoadConnectedGoogleAccountEmailError,
  isSubmitting,
  isTermsAndConditionsAccepted,
  onSubmitTermsAndConditions,
  onToggleAcceptTermsAndConditions,
  signInWithGoogleChallengeSudoMode,
}) => {
  const location = useLocation<{ isGoogleSignInFormTriggered: string }>()
  const isGoogleSignInFormTriggered = !!location.state?.isGoogleSignInFormTriggered
  const scrollbarsRef = useRef<Scrollbars>(null)

  useEffect(() => {
    loadGoogleAccountConnection()
  }, [loadGoogleAccountConnection])

  // The account page scrolls inside a `react-custom-scrollbars-2` container whose outer element has `overflow: hidden`,
  // so the browser's native `#hash` anchoring (and a plain `element.scrollIntoView()`) never moves it. When deep-linked
  // to the Solana wallet section (e.g. from the detail page / checkout "Add Solana Wallet Address" link), scroll the
  // custom scroll view to that section explicitly. The wallet panel mounts after its data loads, so poll briefly for
  // the element before giving up.
  useEffect(() => {
    if (!renderRewardsEnabled || location.hash !== `#${solanaWalletAnchorId}`) {
      return
    }

    let attempts = 0
    let timeout: ReturnType<typeof setTimeout>

    const tryScroll = () => {
      const scrollbars = scrollbarsRef.current
      const element = document.getElementById(solanaWalletAnchorId)
      if (scrollbars && element) {
        // `view` is the inner element that actually scrolls; scroll it (not the page) to the wallet section.
        const view = (scrollbars as unknown as { view?: HTMLElement }).view
        if (view) {
          const top = element.getBoundingClientRect().top - view.getBoundingClientRect().top + view.scrollTop
          view.scrollTo({ top, behavior: 'smooth' })
        } else {
          scrollbars.scrollTop(element.offsetTop)
        }
        return
      }

      if (attempts < 20) {
        attempts += 1
        timeout = setTimeout(tryScroll, 100)
      }
    }

    timeout = setTimeout(tryScroll, 100)
    return () => clearTimeout(timeout)
  }, [location.hash])

  const shouldShowUpdateAccountTermsAndConditions = !!profile?.pendingTermsVersion
  const handleSubmitButtonReset = () => {
    isUserNameSubmitSuccess && onResetUsernameSuccess()
    isMinecraftUserNameSubmitSuccess && onResetMinecraftUsernameSuccess()
  }

  return (
    <div className={classes.container}>
      <Scrollbars ref={scrollbarsRef}>
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
          {renderRewardsEnabled && <SolanaWalletContainer />}
        </Layout>
      </Scrollbars>
    </div>
  )
}

export const Account = withLogin(withStyles(styles)(_Account))
