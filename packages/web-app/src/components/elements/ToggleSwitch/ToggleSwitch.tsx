import React, { Component } from 'react'

// Styles
import { styles } from './ToggleSwitch.styles'
// import css from './ToggleSwitch.module.scss'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {
  toggleLeft?: string | 'Off'
  toggleRight?: string | 'On'
  toggleOn?: boolean
  toggleClick?: () => void
}

class _ToggleSwitch extends Component<Props> {
  state = {
    toggled: this.props.toggleOn,
  }

  render() {
    const { classes, toggleLeft, toggleRight, toggleClick } = this.props

    return (
      <>
        <input
          id="toggle-on"
          className={classnames(classes.toggle, 'toggle-left')}
          name="toggle"
          value="false"
          type="radio"
          defaultChecked={!this.state.toggled}
          onClick={toggleClick}
        />
        <label htmlFor="toggle-on" className={classnames(classes.btn)}>
          {toggleLeft}
        </label>
        <input
          id="toggle-off"
          className={classnames(classes.toggle, 'toggle-right')}
          name="toggle"
          value="true"
          type="radio"
          defaultChecked={this.state.toggled}
          onClick={toggleClick}
        />
        <label htmlFor="toggle-off" className={classnames(classes.btn)}>
          {toggleRight}
        </label>
      </>
    )
  }
}

export const ToggleSwitch = withStyles(styles)(_ToggleSwitch)
