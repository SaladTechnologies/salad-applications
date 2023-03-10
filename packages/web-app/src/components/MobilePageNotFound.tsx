import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    color: theme.lightGreen,
    textAlign: 'center',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 300,
  },
  text: {
    fontSize: theme.medium,
    fontFamily: theme.fontGroteskBook19,
  },
})

interface Props extends WithStyles<typeof styles> {}

const _MobilePageNotFound = ({ classes }: Props) => {
  return (
    <div className={classes.container}>
      <p className={classes.text}>Sorry, Chef! Couldn't serve up that page. Some fare is desktop only.</p>
    </div>
  )
}

export const MobilePageNotFound = withStyles(styles)(_MobilePageNotFound)
