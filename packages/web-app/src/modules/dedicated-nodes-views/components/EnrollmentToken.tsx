import { faCopy, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { useEffect, useState, type FC } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { ErrorText } from '../../../components'
import type { SaladTheme } from '../../../SaladTheme'
import { isEnrollmentExpired } from '../../dedicated-nodes'
import type { DedicatedNodeEnrollment } from '../../dedicated-nodes/models'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '20px',
    border: `3px solid ${theme.lightGreen}`,
    borderRadius: '5px',
  },
  token: {
    fontFamily: 'monospace',
    fontSize: '16px',
    overflowWrap: 'anywhere',
    padding: '10px 12px',
    background: 'rgba(10, 33, 51, 0.1)',
    borderRadius: '5px',
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '12px',
  },
})

interface Props extends WithStyles<typeof styles> {
  enrollment: DedicatedNodeEnrollment
}

/** How long "Copied" shows after the token is copied. */
const copiedFeedbackMs = 2000

/**
 * The account's enrollment token, masked until the user reveals it, with a button that copies it. The token is a
 * secret: it is never logged or tracked.
 */
const _EnrollmentToken: FC<Props> = ({ classes, enrollment }) => {
  const [isRevealed, setIsRevealed] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isCopyError, setIsCopyError] = useState(false)

  useEffect(() => {
    if (!isCopied) {
      return
    }
    const timeout = setTimeout(() => setIsCopied(false), copiedFeedbackMs)
    return () => clearTimeout(timeout)
  }, [isCopied])

  const handleCopy = async () => {
    try {
      await window.navigator.clipboard.writeText(enrollment.token)
      setIsCopyError(false)
      setIsCopied(true)
    } catch {
      setIsCopyError(true)
    }
  }

  const expiresAt = enrollment.expires_at ? new Date(enrollment.expires_at) : undefined
  const isExpired = isEnrollmentExpired(enrollment.expires_at, new Date())

  return (
    <div className={classes.container}>
      <Text variant="baseXL">Enrollment token</Text>
      <Text variant="baseS">
        Install your dedicated machines with this token. Anyone who has it can enroll machines into your account, so
        keep it private. Each machine still needs your approval below.
      </Text>
      <div className={classes.token}>{isRevealed ? enrollment.token : '•'.repeat(24)}</div>
      <div className={classes.buttonRow}>
        <Button
          variant="primary"
          size="small"
          label={isRevealed ? 'Hide' : 'Reveal'}
          leadingIcon={<FontAwesomeIcon icon={isRevealed ? faEyeSlash : faEye} />}
          onClick={() => setIsRevealed(!isRevealed)}
        />
        <Button
          variant="secondary"
          size="small"
          label={isCopied ? 'Copied' : 'Copy'}
          leadingIcon={<FontAwesomeIcon icon={faCopy} />}
          onClick={handleCopy}
        />
      </div>
      {isCopyError && <ErrorText>Unable to copy the token. Reveal it and copy it by hand.</ErrorText>}
      {expiresAt &&
        (isExpired ? (
          <ErrorText>
            This token expired on {expiresAt.toLocaleString()} and can no longer enroll new machines. Contact Salad
            support for a new one. Machines already enrolled are not affected.
          </ErrorText>
        ) : (
          <Text variant="baseS">New machines can enroll with this token until {expiresAt.toLocaleString()}.</Text>
        ))}
    </div>
  )
}

export const EnrollmentToken = withStyles(styles)(_EnrollmentToken)
