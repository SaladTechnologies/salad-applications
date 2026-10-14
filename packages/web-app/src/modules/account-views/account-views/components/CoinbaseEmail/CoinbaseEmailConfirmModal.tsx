import { Button, Checkbox, Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { useState, type FC } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../../SaladTheme'
import { ModalWithOverlay } from '../../../../../components/ModalWithOverlay'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
    width: '560px',
    maxWidth: '100vw',
    padding: '32px 48px 32px 24px',
    color: theme.white,
    '@media (max-width: 812px)': {
      width: '100vw',
      padding: '24px 40px 24px 16px',
    },
  },
  title: {
    color: theme.green,
    fontWeight: 700,
    fontSize: '28px',
    margin: '0px',
    '@media (max-width: 812px)': {
      fontSize: '20px',
    },
  },
  instructions: {
    marginTop: '16px',
  },
  email: {
    marginTop: '12px',
    padding: '12px 16px',
    width: '100%',
    boxSizing: 'border-box',
    border: `1px solid ${theme.green}`,
    color: theme.green,
    fontSize: '22px',
    fontWeight: 700,
    overflowWrap: 'anywhere',
  },
  warning: {
    marginTop: '24px',
    padding: '16px',
    width: '100%',
    boxSizing: 'border-box',
    border: `2px solid ${theme.red}`,
    backgroundColor: `${theme.red}26`,
  },
  warningTitle: {
    color: theme.red,
    fontWeight: 700,
    fontSize: '18px',
    margin: '0px 0px 8px 0px',
  },
  acknowledgement: {
    marginTop: '24px',
  },
  buttonRow: {
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'row',
    gap: '12px',
  },
})

interface Props extends WithStyles<typeof styles> {
  /** The email exactly as the Chef entered it (trimmed). */
  email: string
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Shown every time a Chef adds or changes their Coinbase email, before anything is sent to the API. The Chef must
 * tick the acknowledgement before the save button is enabled; cancelling (or clicking outside) sends nothing.
 */
const _CoinbaseEmailConfirmModal: FC<Props> = ({ classes, email, onConfirm, onCancel }) => {
  const [isAcknowledged, setIsAcknowledged] = useState(false)

  return (
    <ModalWithOverlay onCloseClick={onCancel}>
      <div className={classes.modalContent} role="dialog" aria-modal="true" aria-labelledby="coinbase-email-confirm">
        <h1 id="coinbase-email-confirm" className={classes.title}>
          Confirm your Coinbase email
        </h1>
        <div className={classes.instructions}>
          <Text variant="baseM">
            Please double-check the email address below. It must be the email of your own Coinbase account.
          </Text>
        </div>
        <div className={classes.email}>{email}</div>
        <div className={classes.warning}>
          <h2 className={classes.warningTitle}>Check carefully. Mistakes cannot be undone.</h2>
          <Text variant="baseS">
            Salad does not check whether a Coinbase account exists for this email or who it belongs to. If this email is
            wrong or belongs to someone else, rewards sent to it cannot be recovered, reversed or refunded by Salad, and
            Salad cannot help you get them back.
          </Text>
        </div>
        <div className={classes.acknowledgement}>
          <Checkbox checked={isAcknowledged} onChange={setIsAcknowledged}>
            <Text variant="baseS">
              This is the email of my own Coinbase account, and I understand Salad cannot recover, reverse or refund
              rewards sent to a wrong email.
            </Text>
          </Checkbox>
        </div>
        <div className={classes.buttonRow}>
          <Button
            variant="secondary"
            label="Save Coinbase Email"
            disabled={!isAcknowledged}
            onClick={() => isAcknowledged && onConfirm()}
          />
          <Button variant="outlined" label="Cancel" onClick={onCancel} />
        </div>
      </div>
    </ModalWithOverlay>
  )
}

export const CoinbaseEmailConfirmModal = withStyles(styles)(_CoinbaseEmailConfirmModal)
