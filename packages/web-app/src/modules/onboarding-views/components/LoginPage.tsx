import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { LoadingPage, Button } from '../../../components'

const styles = (theme: SaladTheme) => ({
  container: {},
  detailText: {
    fontSize: 14,
  },
})

interface Props extends WithStyles<typeof styles> {
  onDidMount?: Promise<void>
  text?: string
  details?: string
  onRetry?: () => void
}

class _LoginPage extends Component<Props> {
  render() {
    const { onRetry, details, classes, ...rest } = this.props
    return (
      <LoadingPage {...rest}>
        {details && <p className={classes.detailText}>{details}</p>}
        {details && <Button onClick={onRetry}>Try Again</Button>}
      </LoadingPage>
    )
  }
}

export const LoginPage = withStyles(styles)(_LoginPage)
