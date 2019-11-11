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
    nvidiaLink: 'https://salad.zendesk.com/hc/en-us/articles/360035995751-How-to-update-my-Nvidia-Drivers',
    amdLink: 'https://salad.zendesk.com/hc/en-us/articles/360035633852-How-to-update-my-AMD-Drivers',
  }

  render() {
    const { classes } = this.props

    return (
      <>
        <H4>Looks like your drivers are incompatible with Salad, update them using these guides:</H4>
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
