import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Layout, Text, TextField } from '@saladtechnologies/garden-components'
import { useEffect, type FC } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../SaladTheme'
import { ErrorText, Head } from '../../../../components'
import { SuccessText } from '../../../../components/primitives/content/SuccessText'
import { withLogin } from '../../../auth-views'
import type { SolanaWalletSubmitStatus } from '../../../solana-wallet'

const styles = (theme: SaladTheme) => ({
  container: {
    flex: 1,
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
    color: theme.darkBlue,
  },
  description: {
    maxWidth: 400,
    paddingTop: 16,
  },
  fieldContainer: {
    maxWidth: 400,
    paddingTop: 32,
  },
  currentWalletContainer: {
    maxWidth: 400,
    paddingTop: 24,
  },
  walletAddress: {
    maxWidth: 400,
    paddingTop: 5,
    wordWrap: 'break-word',
  },
  removeButtonContainer: {
    maxWidth: 220,
    marginTop: 16,
  },
  messageContainer: {
    minHeight: 24,
    paddingTop: 12,
  },
})

// Solana addresses are base58-encoded public keys, typically 32-44 characters.
const SOLANA_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/

export type SolanaWalletFormValues = {
  input?: string
}

interface Props extends WithStyles<typeof styles> {
  walletAddress?: string
  isWalletLoadError: boolean
  submitStatus: SolanaWalletSubmitStatus
  loadWallet: () => void
  onSetWalletAddress: (data: SolanaWalletFormValues) => void
  onClearWalletAddress: () => void
  resetSubmitStatus: () => void
}

const _SolanaWallet: FC<Props> = ({
  classes,
  walletAddress,
  isWalletLoadError,
  submitStatus,
  loadWallet,
  onSetWalletAddress,
  onClearWalletAddress,
  resetSubmitStatus,
}) => {
  useEffect(() => {
    loadWallet()
    return () => resetSubmitStatus()
  }, [loadWallet, resetSubmitStatus])

  const isSubmitting = submitStatus === 'submitting'
  const isSubmitSuccess = submitStatus === 'success'
  const isSubmitFailure = submitStatus === 'failure'

  return (
    <div className={classes.container}>
      <Scrollbars>
        <Layout title="Solana Wallet">
          <Head title="Solana Wallet" />
          <div className={classes.description}>
            <Text variant="baseS">
              Add a Solana wallet address to receive RENDER token rewards. Make sure the address is correct — tokens
              sent to an incorrect address cannot be recovered.
            </Text>
          </div>
          {walletAddress && (
            <div className={classes.currentWalletContainer}>
              <Text variant="baseS">Current Wallet Address</Text>
              <div className={classes.walletAddress}>
                <Text variant="baseL">{walletAddress}</Text>
              </div>
              <div className={classes.removeButtonContainer}>
                <Button
                  variant="secondary"
                  size="small"
                  label="Remove Wallet"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  onClick={onClearWalletAddress}
                  leadingIcon={<FontAwesomeIcon icon={faTrashCan} />}
                />
              </div>
            </div>
          )}
          <div className={classes.fieldContainer}>
            <TextField
              isSubmitting={isSubmitting}
              isSubmitSuccess={isSubmitSuccess}
              validationRegex={SOLANA_ADDRESS_REGEX}
              validationRegexErrorMessage="Enter a valid Solana wallet address (32-44 base58 characters)."
              label={walletAddress ? 'Update Wallet Address' : 'Wallet Address'}
              onSubmit={onSetWalletAddress}
              onFocus={() => {
                if (isSubmitSuccess || isSubmitFailure) {
                  resetSubmitStatus()
                }
              }}
              defaultValue={walletAddress}
            />
          </div>
          <div className={classes.messageContainer}>
            {isSubmitSuccess && <SuccessText>Your Solana wallet address has been saved.</SuccessText>}
            {isWalletLoadError && (
              <ErrorText>Unable to load your Solana wallet address. Please refresh the page.</ErrorText>
            )}
          </div>
        </Layout>
      </Scrollbars>
    </div>
  )
}

export const SolanaWallet = withLogin(withStyles(styles)(_SolanaWallet))
