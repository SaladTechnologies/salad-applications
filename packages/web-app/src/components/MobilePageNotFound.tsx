import React from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'

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
    fontFamily: theme.fontGroteskBook19
  }
})

interface Props extends WithStyles<typeof styles> { }


const _MobilePageNotFound = ({ classes }: Props) => {
  return (
    <div className={classes.container}>
      <p className={classes.text}>Sorry, the page you were looking for may not exist on the mobile app.</p>
    </div>
  )
}

export const MobilePageNotFound = withStyles(styles)(_MobilePageNotFound)

