import React, { Component } from 'react'

// Styles
import { styles } from './Body.styles'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {
  
}

class _Body extends Component<Props> {
  render() {
    const { children, classes } = this.props

    return (
      <p className={classnames(classes.body)}>
        {children}
      </p>
    )
  }
}

export const Body = withStyles(styles)(_Body)
