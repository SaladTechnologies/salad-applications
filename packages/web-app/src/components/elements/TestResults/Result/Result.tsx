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
  Success,
  Warning,
  Error,
} from '../../../index'

// Models
import { ErrorCategory, PluginStatus } from '../../../../modules/salad-bowl/models/index'

// Packages
import withStyles, { WithStyles } from 'react-jss'

interface Props extends WithStyles<typeof styles> {
  pluginName: string
  pluginStatus?: string
  errorCategory?: string
  errorMessage?: string
  installPath?: string
}

class _Result extends Component<Props> {
  render() {
    const { pluginName, pluginStatus, errorCategory, errorMessage, installPath, classes } = this.props

    let FailureComponent = null
    let NotificationIcon = null

    console.log('>> [[Result] FailureComponent] errorCategory: ', errorCategory)

    switch (errorCategory) {
      case ErrorCategory.AntiVirus:
        FailureComponent = <AntivirusFailure installPath={installPath} />
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
      case ErrorCategory.Unknown:
        FailureComponent = <UnknownFailure />
        break
    }

    switch (pluginStatus) {
      case PluginStatus.Unknown:
        NotificationIcon = <Error text={errorMessage} />
        break
      case PluginStatus.Installing:
        NotificationIcon = <Warning />
        break
      case PluginStatus.Initializing:
        NotificationIcon = <Warning />
        break
      case PluginStatus.Running:
        NotificationIcon = <Success text={'Success'} />
        break
      case PluginStatus.Stopped:
        NotificationIcon = <Error text={errorMessage} />
        break
    }

    return (
      <div className={classes.result}>
        <div className={classes.pluginName}>
          <RewardHeader>{pluginName}</RewardHeader>
        </div>
        <div className={classes.pluginStatus}>{NotificationIcon}</div>

        {errorCategory && <div className={classes.error}>{FailureComponent}</div>}
      </div>
    )
  }
}

export const Result = withStyles(styles)(_Result)
