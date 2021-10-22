import { Button } from '@saladtechnologies/garden-components'
import withStyles, { WithStyles } from 'react-jss'

const styles = {
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  padding: {
    paddingBottom: '1rem',
  },
}

export interface SaladBowlConnectionFailureProps extends WithStyles<typeof styles> {
  onOpenSupportTicket: () => void
  onRetryConnection: () => void
}

const _SaladBowlConnectionFailure = ({
  onOpenSupportTicket,
  onRetryConnection,
  classes,
}: SaladBowlConnectionFailureProps) => {
  return (
    <div>
      <div className={classes.padding}>
        Salad was unable to connect to our other app that allows us to run workloads on your computer.
      </div>
      <div className={classes.padding}>
        You could either retry connecting to the other app or reach out to support. If attempting to retry connecting
        with our other app fails again, try restarting your computer.
      </div>
      <div className={classes.buttons}>
        <div style={{ marginRight: 15 }}>
          <Button variant="outlined" onClick={onRetryConnection} label="Retry Connecting" />
        </div>
        <Button variant="outlined" onClick={onOpenSupportTicket} label="Open Support Ticket" />
      </div>
    </div>
  )
}

export const SaladBowlConnectionFailure = withStyles(styles)(_SaladBowlConnectionFailure)
