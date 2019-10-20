import React, { Component } from 'react'

// Styles
import { styles } from './Logo.styles'

// Assets
import logo from '../../assets/animated-logo-lg.gif'

// Packages
import withStyles, { WithStyles } from 'react-jss'

interface Props extends WithStyles<typeof styles> {}

class _Logo extends Component<Props> {
  render() {
    const { classes } = this.props

    return (
      <>
        <img src={logo} className={classes.logo} />
      </>
    )
  }
}

export const Logo = withStyles(styles)(_Logo)
