import React, { Component } from 'react'

// Theme
import { SaladTheme } from '../../../SaladTheme'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  errorText: {
    margin: '.25rem',
    color: theme.red,
    fontFamily: 'sharpGroteskBook25',
    fontSize: theme.small,
  },
})

interface Props extends WithStyles<typeof styles> {}

class _ErrorText extends Component<Props> {
  render() {
    const { children, classes } = this.props

    return <div className={classnames(classes.errorText)}>{children}</div>
  }
}

export const ErrorText = withStyles(styles)(_ErrorText)
