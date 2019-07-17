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
  disabled?: boolean
}

class _ToggleSwitch extends Component<Props> {
  state = {
    toggled: this.props.toggleOn,
  }

  render() {
    const { 
      classes, 
      toggleLeft, 
      toggleRight, 
      toggleClick, 
      disabled } = this.props

    return (
      <>
        <input
          id="toggle-on"
          className={classnames(classes.toggle, 'toggle-left', disabled && 'disabled')}
          name="toggle"
          value="false"
          type="radio"
          defaultChecked={!this.state.toggled}
          onClick={toggleClick}
          disabled={disabled}
        />
        <label htmlFor="toggle-on" className={classnames(classes.btn, disabled && 'disabled')}>
          {toggleLeft}
        </label>
        <input
          id="toggle-off"
          className={classnames(classes.toggle, 'toggle-right', disabled && 'disabled')}
          name="toggle"
          value="true"
          type="radio"
          defaultChecked={this.state.toggled}
          onClick={toggleClick}
          disabled={disabled}
        />
        <label htmlFor="toggle-off" className={classnames(classes.btn, disabled && 'disabled')}>
          {toggleRight}
        </label>
      </>
    )
  }
}

export const ToggleSwitch = withStyles(styles)(_ToggleSwitch)
