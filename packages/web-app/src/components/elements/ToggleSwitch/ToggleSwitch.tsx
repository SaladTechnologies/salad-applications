import React, { Component } from 'react'

// Styles
import { styles } from './ToggleSwitch.styles'
// import css from './ToggleSwitch.module.scss'

// Packages
import withStyles, { WithStyles } from 'react-jss'

interface Props extends WithStyles<typeof styles> {

}

class _ToggleSwitch extends Component<Props> {
  render() {
    const {
      classes
    } = this.props

    return (
      <label className={classes.switch}>
        <input className={classes.input} type="checkbox" />
        <span className={classes.slider}></span>
      </label>
    )
  }
}

export const ToggleSwitch = withStyles(styles)(_ToggleSwitch)
