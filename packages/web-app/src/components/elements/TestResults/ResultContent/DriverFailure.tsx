import React, { Component } from 'react'

// Styles
import { styles } from './DriverFailure.styles'

// Components
import { H4, Button } from '../../../index'

// Packages
import withStyles, { WithStyles } from 'react-jss'

interface Props extends WithStyles<typeof styles> {
  
}

class _DriverFailure extends Component<Props> {
  render() {
    return (
      <>
        <H4>Looks like your drivers are incompatible with Salad, update them using these guides:</H4>
        <Button uppercase>Nvidia</Button>
        <Button>AMD</Button>
      </>
    )
  }
}

export const DriverFailure = withStyles(styles)(_DriverFailure)
