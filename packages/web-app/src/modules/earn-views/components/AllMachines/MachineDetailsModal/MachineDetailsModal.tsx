import { Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { DateTime } from 'luxon'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../../SaladTheme'
import { ModalWithOverlay } from '../../../../../components/ModalWithOverlay'
import type { MachineDetails } from '../utils'

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
  machineDetails: MachineDetails
  onCloseClick: () => void
}

const _MachineDetailsModal = ({ classes, machineDetails, onCloseClick }: Props) => {
  return (
    <ModalWithOverlay onCloseClick={onCloseClick}>
      <div className={classes.modalWrapper}>
        <Text variant="baseXL">Summary - {machineDetails.id.substring(0, 8)}</Text>
        <div className={classes.detailsWrapper}>
          <div className={classes.detailsBlock}>
            <div className={classes.detailsBlockTitle}>
              <Text variant="baseXS">Last Seen</Text>
            </div>
            <Text variant="baseL">
              {machineDetails.lastSeen ? DateTime.fromJSDate(machineDetails.lastSeen).toRelative() : 'N/A'}
            </Text>
          </div>
          <div className={classes.detailsBlock}>
            <div className={classes.detailsBlockTitle}>
              <Text variant="baseXS">Current Earning Rate</Text>
            </div>
            <Text variant="baseL">
              {machineDetails.currentHourlyEarningRate
                ? `$${machineDetails.currentHourlyEarningRate.toFixed(3)} / Hour`
                : 'N/A'}
            </Text>
          </div>
        </div>
      </div>
    </ModalWithOverlay>
  )
}

export const MachineDetailsModal = withStyles(styles)(_MachineDetailsModal)
