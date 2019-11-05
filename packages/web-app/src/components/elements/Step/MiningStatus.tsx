import React, { Component } from 'react'

// Components
import { H4 } from '../../'

// Styles
import { styles } from './MiningStatus.styles'

// Assets
import checkmark from '../../assets/checkmark.png'
import logo from '../../assets/animated-logo-lg.gif'

// Packages
import withStyles, { WithStyles } from 'react-jss'

interface Props extends WithStyles<typeof styles> {
  completed?: boolean | false
  label: string
}

class _MiningStatus extends Component<Props> {
  render() {
    const { completed, label, classes } = this.props

    let Element = (
      <div className={classes.miningStatus}>
        <div className={classes.indicator}>
          {completed && (
            <div className={classes.checkmark}>
              <img src={checkmark} />
            </div>
          )}
          {!completed && (
            <div className={classes.checkmark}>
              <img src={logo} className={classes.logo} style={{ width: '100%', top: '5px', left: 0 }} />
            </div>
          )}
        </div>
        <H4 className={classes.text}>{label}</H4>
      </div>
    )

    return Element
  }
}

export const MiningStatus = withStyles(styles)(_MiningStatus)
