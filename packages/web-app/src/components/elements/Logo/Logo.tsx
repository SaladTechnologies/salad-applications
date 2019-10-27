import React, { Component } from 'react'

// Styles
import { styles } from './Logo.styles'

// Assets
import logo from '../../assets/animated-logo-lg.gif'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {
  className?: string
}

class _Logo extends Component<Props> {
  render() {
    const { className, classes } = this.props

    return (
      <>
        <img src={logo} className={classnames(className || classes.logo)} />
      </>
    )
  }
}

export const Logo = withStyles(styles)(_Logo)
