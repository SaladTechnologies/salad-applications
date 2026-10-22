import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Text, TextField } from '@saladtechnologies/garden-components'
import { useEffect, useState, type FC } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { ErrorText } from '../../../../../components'
import { SuccessText } from '../../../../../components/primitives/content/SuccessText'
import {
  coinbaseEmailAnchorId,
  type CoinbaseEmailSubmitError,
  type CoinbaseEmailSubmitStatus,
} from '../../../../coinbase'
import type { FormValues } from '../Account'
import { styles } from './CoinbaseEmail.styles'
import { CoinbaseEmailConfirmModal } from './CoinbaseEmailConfirmModal'

interface Props extends WithStyles<typeof styles> {
  /** Whether Coinbase cash-out is available to this Chef. The section renders nothing until the server says it is. */
  isEnabled: boolean
  email?: string
  isLoading: boolean
  isLoadError: boolean
  submitStatus: CoinbaseEmailSubmitStatus
  submitError?: CoinbaseEmailSubmitError
  loadEmail: () => void
  setEmail: (email: string) => void
  clearEmail: () => void
  setSubmitStatus: (submitStatus: CoinbaseEmailSubmitStatus) => void
}

const submitErrorMessages: Record<CoinbaseEmailSubmitError, string> = {
  disabled: 'Coinbase email settings are not available yet. Your email was not saved.',
  invalid: 'That email address is not in a valid format. Please check it and try again.',
  unknown: 'There was an error updating your Coinbase email. Please try again.',
}

const _CoinbaseEmail: FC<Props> = ({
  classes,
  isEnabled,
  email,
  isLoading,
  isLoadError,
  submitStatus,
  submitError,
  loadEmail,
  setEmail,
  clearEmail,
  setSubmitStatus,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isConfirmingRemoval, setIsConfirmingRemoval] = useState(false)
  // The email waiting for the Chef to confirm it in the modal. Nothing is sent to the API until they do.
  const [pendingEmail, setPendingEmail] = useState<string>()

  const isSubmitting = submitStatus === 'loading'
  const isSubmitSuccess = submitStatus === 'success'
  const isSubmitFailure = submitStatus === 'failure'

  useEffect(() => {
    loadEmail()
    return () => setSubmitStatus('unknown')
  }, [loadEmail, setSubmitStatus])

  // Once a save/clear succeeds, drop out of the edit/confirm states.
  useEffect(() => {
    if (isSubmitSuccess) {
      setIsEditing(false)
      setIsConfirmingRemoval(false)
    }
  }, [isSubmitSuccess])

  const handleSubmit = (data: FormValues) => {
    if (data.input) {
      setPendingEmail(data.input.trim())
    }
  }

  const handleConfirm = () => {
    if (pendingEmail) {
      setEmail(pendingEmail)
    }
    setPendingEmail(undefined)
  }

  // Loading on mount (above) is what tells us whether to show anything at all.
  if (!isEnabled) {
    return null
  }

  const showForm = isEditing || !email

  return (
    <div id={coinbaseEmailAnchorId} className={classes.coinbaseEmailWrapper}>
      <Text variant="baseXL">Coinbase Email</Text>
      <div className={classes.description}>
        <Text variant="baseS">
          Enter the email address of your own Coinbase account. Salad does not check whether a Coinbase account exists
          for this email or who it belongs to, so make sure it is correct. Rewards sent to the wrong email cannot be
          recovered, reversed or refunded by Salad.
        </Text>
      </div>

      <div className={classes.content}>
        {isLoading ? (
          <Text variant="baseS">Loading your Coinbase email…</Text>
        ) : (
          <>
            {showForm ? (
              <div className={classes.fieldContainer}>
                <TextField
                  isSubmitting={isSubmitting}
                  isSubmitSuccess={isSubmitSuccess}
                  label="Coinbase Account Email"
                  onSubmit={handleSubmit}
                  validationRegex={/^\S+@\S+\.\S+$/}
                  validationRegexErrorMessage="Enter a valid email address."
                  // Reset any settled submit status (success *or* failure) when the field is refocused so a freshly
                  // shown add form is never left locked in the previous mutation's state (e.g. right after a removal).
                  onFocus={() => (isSubmitSuccess || isSubmitFailure) && setSubmitStatus('unknown')}
                  defaultValue={email}
                />
                {isEditing && email && (
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
                <div className={classes.savedEmailLabel}>
                  <Text variant="baseS">Your Coinbase Account Email</Text>
                </div>
                <Text variant="baseM" className={classes.savedEmail}>
                  {email}
                </Text>
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
                        Are you sure you want to remove this Coinbase email? Salad will not have a Coinbase email on
                        file for you until you add one again.
                      </Text>
                    </div>
                    <div className={classes.buttonRow}>
                      <Button
                        variant="primary"
                        size="small"
                        label="Yes, remove"
                        isLoading={isSubmitting}
                        onClick={() => clearEmail()}
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
              {isSubmitSuccess && <SuccessText>Success! Your Coinbase email has been updated.</SuccessText>}
              {isSubmitFailure && <ErrorText>{submitErrorMessages[submitError ?? 'unknown']}</ErrorText>}
              {isLoadError && !isSubmitFailure && (
                <ErrorText>Unable to load your Coinbase email. Please refresh the page.</ErrorText>
              )}
            </div>
          </>
        )}
      </div>

      {pendingEmail && (
        <CoinbaseEmailConfirmModal
          email={pendingEmail}
          onConfirm={handleConfirm}
          onCancel={() => setPendingEmail(undefined)}
        />
      )}
    </div>
  )
}

export const CoinbaseEmail = withStyles(styles)(_CoinbaseEmail)
