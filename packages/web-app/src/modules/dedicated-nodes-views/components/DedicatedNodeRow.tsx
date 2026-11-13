import { Button, StatusPill, Text, TextField } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { useState, type FC } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { ErrorText } from '../../../components'
import type { SaladTheme } from '../../../SaladTheme'
import { DefaultTheme } from '../../../SaladTheme'
import { shortenHexId, type DedicatedNodeAction, type DedicatedNodeActionError } from '../../dedicated-nodes'
import type { DedicatedNode, DedicatedNodeStanding } from '../../dedicated-nodes/models'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = () => ({
  row: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px 0',
    borderBottom: '1px solid rgba(10, 33, 51, 0.2)',
  },
  summary: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    '@media (max-width: 670px)': {
      flexDirection: 'column',
      alignItems: 'baseline',
    },
  },
  identity: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: 0,
  },
  hash: {
    fontFamily: 'monospace',
    overflowWrap: 'anywhere',
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '12px',
  },
  fieldContainer: {
    maxWidth: '400px',
  },
})

const standingLabels: Record<DedicatedNodeStanding, { label: string; color: string }> = {
  pending: { label: 'Waiting for approval', color: DefaultTheme.lightGreen },
  approved: { label: 'Approved', color: DefaultTheme.green },
  refused: { label: 'Refused', color: '#F3C3B7' },
}

const actionErrorMessages: Record<DedicatedNodeActionError, string> = {
  'wrong-code': 'That code does not match. Check the code shown on the machine and try again.',
  conflict: 'This machine changed since the list loaded. The list has been refreshed.',
  'not-found': 'This machine is no longer enrolled with your account. The list has been refreshed.',
  unavailable: 'The node service is unavailable. Please try again in a few minutes.',
  timeout: 'The node service did not answer in time. The list has been refreshed, so check whether it worked.',
  unknown: 'Something went wrong. Please try again.',
}

type OpenForm = 'approve' | 'refuse' | 'revoke' | undefined

interface Props extends WithStyles<typeof styles> {
  node: DedicatedNode
  /** The action in flight for this node, if any. */
  pendingAction?: DedicatedNodeAction
  /** Whether an action for another node is in flight, which disables this node's actions. */
  isBusy: boolean
  actionError?: DedicatedNodeActionError
  onApprove: (nodeId: string, confirmationCode: string) => Promise<boolean>
  onRefuse: (nodeId: string) => Promise<boolean>
  onRevoke: (nodeId: string) => Promise<boolean>
  onClearError: () => void
}

/** One enrolled machine, with the actions its standing allows. */
const _DedicatedNodeRow: FC<Props> = ({
  classes,
  node,
  pendingAction,
  isBusy,
  actionError,
  onApprove,
  onRefuse,
  onRevoke,
  onClearError,
}) => {
  const [openForm, setOpenForm] = useState<OpenForm>()
  const standing = standingLabels[node.standing]

  const open = (form: OpenForm) => {
    onClearError()
    setOpenForm(form)
  }

  const run = async (action: () => Promise<boolean>) => {
    if (await action()) {
      setOpenForm(undefined)
    }
  }

  const canApprove = node.standing === 'pending' || node.standing === 'refused'
  const canRefuse = node.standing === 'pending'
  const canRevoke = node.standing === 'approved'

  return (
    <div className={classes.row}>
      <div className={classes.summary}>
        <div className={classes.identity}>
          <Text variant="baseS">Endorsement key (EK) hash</Text>
          <Text variant="baseM" className={classes.hash}>
            {node.ek_sha256}
          </Text>
          <Text variant="baseXS" className={classes.hash}>
            Node {shortenHexId(node.node_id)}
          </Text>
        </div>
        <StatusPill status={standing.label} backgroundColor={standing.color} />
      </div>

      {openForm === undefined && (
        <div className={classes.buttonRow}>
          {canApprove && (
            <Button variant="primary" size="small" label="Approve" disabled={isBusy} onClick={() => open('approve')} />
          )}
          {canRefuse && (
            <Button variant="secondary" size="small" label="Refuse" disabled={isBusy} onClick={() => open('refuse')} />
          )}
          {canRevoke && (
            <Button variant="secondary" size="small" label="Revoke" disabled={isBusy} onClick={() => open('revoke')} />
          )}
        </div>
      )}

      {openForm === 'approve' && canApprove && (
        <div className={classes.fieldContainer}>
          <Text variant="baseS">Enter the 6-character confirmation code shown on this machine's screen.</Text>
          <TextField
            autoFocus
            label="Confirmation code"
            isSubmitting={pendingAction === 'approve'}
            isSubmitSuccess={false}
            validationRegex={/^\s*[A-Za-z0-9]{6}\s*$/}
            validationRegexErrorMessage="The code is 6 letters and numbers."
            onFocus={onClearError}
            onSubmit={(data) => data.input && run(() => onApprove(node.node_id, data.input as string))}
          />
          <div className={classes.buttonRow}>
            <Button variant="secondary" size="small" label="Cancel" onClick={() => open(undefined)} />
          </div>
        </div>
      )}

      {openForm === 'refuse' && canRefuse && (
        <>
          <Text variant="baseS">
            Refuse this machine if you don't recognize it. It stays in the list, and you can still approve it later with
            its code.
          </Text>
          <div className={classes.buttonRow}>
            <Button
              variant="primary"
              size="small"
              label="Yes, refuse"
              isLoading={pendingAction === 'refuse'}
              onClick={() => run(() => onRefuse(node.node_id))}
            />
            <Button variant="secondary" size="small" label="Cancel" onClick={() => open(undefined)} />
          </div>
        </>
      )}

      {openForm === 'revoke' && canRevoke && (
        <>
          <Text variant="baseS">
            Revoking is permanent. This machine stops working for your account and can never be approved again.
          </Text>
          <div className={classes.buttonRow}>
            <Button
              variant="primary"
              size="small"
              label="Yes, revoke permanently"
              isLoading={pendingAction === 'revoke'}
              onClick={() => run(() => onRevoke(node.node_id))}
            />
            <Button variant="secondary" size="small" label="Cancel" onClick={() => open(undefined)} />
          </div>
        </>
      )}

      {actionError && <ErrorText>{actionErrorMessages[actionError]}</ErrorText>}
    </div>
  )
}

export const DedicatedNodeRow = withStyles(styles)(_DedicatedNodeRow)
