import { Button, Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import type { FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../SaladTheme'
import { DefaultTheme } from '../../../../SaladTheme'
import { mockedExistingAlertsList } from '../../utils'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  existingAlertsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '20px',
    border: `3px solid ${theme.lightGreen}`,
    borderRadius: '5px',
    marginTop: '20px',
  },
  alertContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

interface Props extends WithStyles<typeof styles> {}

const _DemandAlertsList: FunctionComponent<Props> = ({ classes }) => {
  return (
    <div className={classes.container}>
      <Text variant="baseXL">Manage your existing alerts</Text>
      <Text variant="baseS">You will get alerted on the following scenarios:</Text>
      <div className={classes.existingAlertsContainer}>
        {mockedExistingAlertsList.map((existingAlert) => (
          <div className={classes.alertContainer}>
            <Text variant="baseS">
              {existingAlert.gpu} @ {existingAlert.demandScenario}
            </Text>
            <Button
              onClick={() => {}}
              outlineColor={DefaultTheme.white}
              label="Unsubscribe"
              variant="primary"
              size="small"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export const DemandAlertsList = withStyles(styles)(_DemandAlertsList)
