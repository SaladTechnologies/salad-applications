import { faCopy, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Text, TextField } from '@saladtechnologies/garden-components'
import { useEffect, useState, type FC } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { ErrorText } from '../../../../../components'
import { SuccessText } from '../../../../../components/primitives/content/SuccessText'
import type { SolanaWalletSubmitStatus } from '../../../../solana-wallet'
import type { FormValues } from '../Account'
import { styles } from './SolanaWallet.styles'

interface Props extends WithStyles<typeof styles> {
  walletAddress?: string
  isLoading: boolean
  isLoadError: boolean
  submitStatus: SolanaWalletSubmitStatus
  loadWallet: () => void
  setWallet: (walletAddress: string) => void
  clearWallet: () => void
  setSubmitStatus: (submitStatus: SolanaWalletSubmitStatus) => void
}

const _SolanaWallet: FC<Props> = ({
  classes,
  walletAddress,
  isLoading,
  isLoadError,
  submitStatus,
  loadWallet,
  setWallet,
  clearWallet,
  setSubmitStatus,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isConfirmingRemoval, setIsConfirmingRemoval] = useState(false)

  const isSubmitting = submitStatus === 'loading'
  const isSubmitSuccess = submitStatus === 'success'
  const isSubmitFailure = submitStatus === 'failure'

  useEffect(() => {
    loadWallet()
    return () => setSubmitStatus('unknown')
  }, [loadWallet, setSubmitStatus])

  // Once a save/clear succeeds, drop out of the edit/confirm states.
  useEffect(() => {
    if (isSubmitSuccess) {
      setIsEditing(false)
      setIsConfirmingRemoval(false)
    }
  }, [isSubmitSuccess])

  const handleSubmit = (data: FormValues) => {
    if (data.input) {
      setWallet(data.input.trim())
    }
  }

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard?.writeText(walletAddress)
    }
  }

  const showForm = isEditing || !walletAddress

  return (
    <div className={classes.solanaWalletWrapper}>
      <Text variant="baseXL">Solana Wallet</Text>
      <div className={classes.description}>
        <Text variant="baseS">
          Add the Solana wallet address where you’d like to receive RENDER token rewards. Make sure this address is
          correct — token rewards sent to the wrong address cannot be recovered.
        </Text>
      </div>

      <div className={classes.content}>
        {isLoading ? (
          <Text variant="baseS">Loading your wallet…</Text>
        ) : (
          <>
            {showForm ? (
              <div className={classes.fieldContainer}>
                <TextField
                  isSubmitting={isSubmitting}
                  isSubmitSuccess={isSubmitSuccess}
                  label="Solana Wallet Address"
                  onSubmit={handleSubmit}
                  validationRegex={/^[1-9A-HJ-NP-Za-km-z]{32,44}$/}
                  validationRegexErrorMessage="Enter a valid Solana wallet address (32-44 base58 characters)."
                  onFocus={() => isSubmitFailure && setSubmitStatus('unknown')}
                  defaultValue={walletAddress}
                />
                {isEditing && walletAddress && (
                  <div className={classes.buttonRow}>
                    <Button
                      variant="secondary"
                      size="small"
                      label="Cancel"
                      onClick={() => {
                        setIsEditing(false)
                        setSubmitStatus('unknown')
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className={classes.savedAddressLabel}>
                  <Text variant="baseS">Your Solana Wallet Address</Text>
                </div>
                <div className={classes.savedAddressRow}>
                  <Text variant="baseM" className={classes.savedAddress}>
                    {walletAddress}
                  </Text>
                  <FontAwesomeIcon
                    icon={faCopy}
                    className={classes.copyIcon}
                    title="Copy address"
                    onClick={handleCopy}
                  />
                </div>
                {!isConfirmingRemoval ? (
                  <div className={classes.buttonRow}>
                    <Button
                      variant="primary"
                      size="small"
                      label="Edit"
                      leadingIcon={<FontAwesomeIcon icon={faPenToSquare} />}
                      onClick={() => {
                        setSubmitStatus('unknown')
                        setIsEditing(true)
                      }}
                    />
                    <Button
                      variant="secondary"
                      size="small"
                      label="Remove"
                      leadingIcon={<FontAwesomeIcon icon={faTrashCan} />}
                      onClick={() => setIsConfirmingRemoval(true)}
                    />
                  </div>
                ) : (
                  <div className={classes.confirmWrapper}>
                    <div className={classes.confirmText}>
                      <Text variant="baseS">
                        Are you sure you want to remove this wallet address? You will no longer receive RENDER token
                        rewards until you add a new one.
                      </Text>
                    </div>
                    <div className={classes.buttonRow}>
                      <Button
                        variant="primary"
                        size="small"
                        label="Yes, remove"
                        isLoading={isSubmitting}
                        onClick={() => clearWallet()}
                      />
                      <Button
                        variant="secondary"
                        size="small"
                        label="Cancel"
                        onClick={() => setIsConfirmingRemoval(false)}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div className={classes.messageWrapper}>
              {isSubmitSuccess && <SuccessText>Success! Your Solana wallet has been updated.</SuccessText>}
              {isSubmitFailure && (
                <ErrorText>There was an error updating your Solana wallet. Please try again.</ErrorText>
              )}
              {isLoadError && !isSubmitFailure && (
                <ErrorText>Unable to load your Solana wallet. Please refresh the page.</ErrorText>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export const SolanaWallet = withStyles(styles)(_SolanaWallet)
