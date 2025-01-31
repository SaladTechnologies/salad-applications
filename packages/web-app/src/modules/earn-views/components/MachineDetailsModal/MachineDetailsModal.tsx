import { Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { DateTime } from 'luxon'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../SaladTheme'
import { ModalWithOverlay } from '../../../../components/ModalWithOverlay'
import type { RunningStatus } from '../AllMachines/mocks'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  modalWrapper: {
    color: theme.green,
    width: '420px',
    maxHeight: '450px',
    overflowY: 'auto',
    background: theme.darkBlue,
    border: `1px solid ${theme.lightGreen}`,
    padding: '20px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
    position: 'relative',
    boxSizing: 'border-box',
    borderRadius: '8px',
  },
  warningsWrapper: {
    color: theme.lightGreen,
  },
  warningPills: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: '6px',
    marginTop: '8px',
  },
  warningPill: {
    padding: '5px 8px',
    borderRadius: '16px',
    backgroundColor: '#F6931D',
    color: theme.darkBlue,
    textDecoration: 'underline',
  },
  detailsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: '20px',
  },
  detailsBlock: {
    display: 'flex',
    flexDirection: 'column',
    color: theme.green,
    gap: '8px',
  },
  detailsBlockTitle: {
    color: theme.lightGreen,
    fontWeight: 'bold',
  },
})

interface Props extends WithStyles<typeof styles> {
  id: string
  lastSeen: Date
  status: RunningStatus
  currentEarningRate: number
  warnings: string[]
  onCloseClick: () => void
}

const _MachineDetailsModal = ({ classes, id, lastSeen, status, currentEarningRate, warnings, onCloseClick }: Props) => {
  return (
    <ModalWithOverlay onCloseClick={onCloseClick}>
      <div className={classes.modalWrapper}>
        <Text variant="baseXL">Summary - {id}</Text>
        <div className={classes.detailsWrapper}>
          <div className={classes.detailsBlock}>
            <div className={classes.detailsBlockTitle}>
              <Text variant="baseXS">Last Seen</Text>
            </div>
            <Text variant="baseL">{DateTime.fromJSDate(lastSeen).toFormat('MMM d, yyyy')}</Text>
          </div>
          <div className={classes.detailsBlock}>
            <div className={classes.detailsBlockTitle}>
              <Text variant="baseXS">Running Status</Text>
            </div>
            <Text variant="baseL">{status}</Text>
          </div>
          <div className={classes.detailsBlock}>
            <div className={classes.detailsBlockTitle}>
              <Text variant="baseXS">Current Earning Rate</Text>
            </div>
            <Text variant="baseL">{currentEarningRate}</Text>
          </div>
        </div>
        <div className={classes.warningsWrapper}>
          <Text variant="baseXS">Warnings</Text>
          <div className={classes.warningPills}>
            {warnings.map((warningText) => (
              <div key={warningText} className={classes.warningPill}>
                <Text variant="baseM">{warningText}</Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModalWithOverlay>
  )
}

export const MachineDetailsModal = withStyles(styles)(_MachineDetailsModal)
