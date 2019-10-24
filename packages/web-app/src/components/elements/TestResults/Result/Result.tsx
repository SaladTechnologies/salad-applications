import React, { Component } from 'react'

// Styles
import { styles } from './Result.styles'

// Components
import {
  RewardHeader,
  AntivirusFailure,
  // DeviceFailure,
  DriverFailure,
  NetworkFailure,
  UnknownFailure,
} from '../../../index'

// Models
import { ErrorCategory, MachineStatus } from '../../../../modules/salad-bowl/models/index'

// Packages
import withStyles, { WithStyles } from 'react-jss'

interface Props extends WithStyles<typeof styles> {
  plugin: string
  machineStatus?: MachineStatus
  errorCategory?: ErrorCategory
}

class _Result extends Component<Props> {
  render() {
    const { plugin, machineStatus, errorCategory, classes } = this.props

    let FailureComponent = null

    switch (errorCategory) {
      case ErrorCategory.AntiVirus:
        FailureComponent = <AntivirusFailure />
        break
      // case ErrorCategory.Device:
      //   FailureComponent = <DeviceFailure />
      //   break
      case ErrorCategory.Driver:
        FailureComponent = <DriverFailure />
        break
      case ErrorCategory.Network:
        FailureComponent = <NetworkFailure />
        break
      default:
        FailureComponent = <UnknownFailure />
        break
    }

    return (
      <div className={classes.result}>
        <div>
          <RewardHeader>{plugin}</RewardHeader>
        </div>
        <div>{machineStatus}</div>
        <div>{FailureComponent}</div>
      </div>
    )
  }
}

export const Result = withStyles(styles)(_Result)
