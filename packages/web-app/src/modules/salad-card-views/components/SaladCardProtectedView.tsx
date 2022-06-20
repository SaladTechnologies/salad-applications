import { Text } from '@saladtechnologies/garden-components'
import { FunctionComponent } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import image from '../assets/background.png'

const styles = (theme: SaladTheme) => ({
  parentContainer: {
    backgroundImage: `url(${image})`,
    width: 400,
    height: 250,
    display: 'block',
  },
  saladCardNumberContainer: {
    width: 200,
    height: 'fit-Content',
    paddingLeft: 30,
    paddingTop: 100,
  },
  expCvvContainer: {
    display: 'flex',
    paddingTop: 20,
  },
  expContainer: { height: 'fit-Content', width: 'fit-Content', paddingLeft: 30 },
  expLabel: { color: theme.lightGreen },
  cvvContainer: { height: 'fit-Content', width: 'fit-Content', paddingLeft: 30 },
  cvvLabel: { color: theme.lightGreen },
})

interface SaladCardProtectedViewProps extends WithStyles<typeof styles> {
  lastFourSaladCardDigits?: string
}

const _SaladCardProtectedView: FunctionComponent<SaladCardProtectedViewProps> = ({
  classes,
  lastFourSaladCardDigits,
}) => {
  return (
    <div className={classes.parentContainer}>
      <div className={classes.saladCardNumberContainer}>
        <Text variant="baseXXL">xxxx xxxx xxxx {lastFourSaladCardDigits}</Text>
      </div>
      <div className={classes.expCvvContainer}>
        <div className={classes.expContainer}>
          <Text variant="baseM">
            <div className={classes.expLabel}>EXP</div>
          </Text>
          <Text variant="baseS"> XX/XX</Text>
        </div>
        <div className={classes.cvvContainer}>
          <Text variant="baseM">
            <div className={classes.cvvLabel}>CVV</div>
          </Text>
          <Text variant="baseS"> XXX</Text>
        </div>
      </div>
    </div>
  )
}

export const SaladCardProtectedView = withStyles(styles)(_SaladCardProtectedView)
