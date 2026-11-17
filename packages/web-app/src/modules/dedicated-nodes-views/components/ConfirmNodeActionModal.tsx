import { Button, Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import type { FC } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { ModalWithOverlay } from '../../../components/ModalWithOverlay'
import type { SaladTheme } from '../../../SaladTheme'
import { DefaultTheme } from '../../../SaladTheme'

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
  body: {
    marginTop: '16px',
  },
  buttonRow: {
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'row',
    gap: '12px',
  },
})

interface Props extends WithStyles<typeof styles> {
  title: string
  body: string
  confirmLabel: string
  /** Whether the action is in flight. */
  isSubmitting: boolean
  onConfirm: () => void
  onCancel: () => void
}

/** Asked before refusing or revoking a machine. */
const _ConfirmNodeActionModal: FC<Props> = ({
  classes,
  title,
  body,
  confirmLabel,
  isSubmitting,
  onConfirm,
  onCancel,
}) => {
  // Once sent, the action can't be called back, so the dialog stays until it answers.
  const cancel = () => {
    if (!isSubmitting) {
      onCancel()
    }
  }

  return (
    <ModalWithOverlay onCloseClick={cancel}>
      <div className={classes.modalContent} role="dialog" aria-modal="true" aria-labelledby="confirm-node-action-title">
        <h1 id="confirm-node-action-title" className={classes.title}>
          {title}
        </h1>
        <div className={classes.body}>
          <Text variant="baseM">{body}</Text>
        </div>
        <div className={classes.buttonRow}>
          <Button
            variant="outlined"
            outlineColor={DefaultTheme.lightGreen}
            label="Cancel"
            disabled={isSubmitting}
            onClick={cancel}
          />
          <Button
            variant="secondary"
            label={confirmLabel}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            onClick={onConfirm}
          />
        </div>
      </div>
    </ModalWithOverlay>
  )
}

export const ConfirmNodeActionModal = withStyles(styles)(_ConfirmNodeActionModal)
