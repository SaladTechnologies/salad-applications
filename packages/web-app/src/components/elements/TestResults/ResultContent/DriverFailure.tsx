import React, { Component } from 'react'

// Styles
import { styles } from './DriverFailure.styles'

// Components
import { H4, ExternalLink } from '../../../index'

// Packages
import withStyles, { WithStyles } from 'react-jss'

interface Props extends WithStyles<typeof styles> {}

class _DriverFailure extends Component<Props> {
  state = {
    nvidiaLink: '',
    amdLink: '',
  }

  render() {
    const { classes } = this.props

    return (
      <>
        <H4>Looks like your drivers are incompatible with Salad, update them using these guides:</H4>
        {/* <Button uppercase>Nvidia</Button>
        <Button uppercase>AMD</Button> */}
        <div className={classes.buttonContainer}>
          <ExternalLink path={this.state.nvidiaLink} className={classes.supportButton}>
            Nvidia
          </ExternalLink>
          <ExternalLink path={this.state.amdLink} className={classes.supportButton}>
            AMD
          </ExternalLink>
        </div>
      </>
    )
  }
}

export const DriverFailure = withStyles(styles)(_DriverFailure)
