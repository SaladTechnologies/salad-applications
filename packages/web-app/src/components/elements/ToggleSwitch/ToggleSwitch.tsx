import React, { Component } from 'react'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  btn: {
    border: '1px solid ' + theme.lightGreen,
    color: theme.lightGreen,
    display: 'inline-block',
    padding: '6px 2px',
    position: 'relative',
    textAlign: 'center',
    transition: 'background 600ms ease, color 600ms ease',
    userSelect: 'none',
    fontFamily: theme.fontGroteskLight25,
    fontSize: theme.small,
    textTransform: 'uppercase',
    minWidth: 50,
    lineHeight: '20px',
  },
  active: {
    backgroundColor: theme.mediumGreen,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    cursor: 'default',
    transition: 'color 200ms',
  },
  inactive: {
    cursor: 'pointer',
  },
  disabled: {
    boxShadow: 'none',
    backgroundColor: 'initial',
    color: theme.lightGreen,
    cursor: 'not-allowed',
  },
})

interface Props extends WithStyles<typeof styles> {
  toggleLeft?: string
  toggleRight?: string
  toggleOn?: boolean
  toggleClick?: () => void
  disabled?: boolean
}

class _ToggleSwitch extends Component<Props> {
  onToggle = () => {
    const { toggleClick } = this.props

    if (toggleClick) {
      toggleClick()
    }
  }
  render() {
    const { toggleOn, classes, toggleLeft, toggleRight, disabled } = this.props
    return (
      <>
        <label
          className={classnames(classes.btn, {
            [classes.active]: !toggleOn,
            [classes.inactive]: toggleOn,
            [classes.disabled]: disabled,
          })}
          onClick={this.onToggle}
        >
          {toggleLeft || 'Off'}
        </label>
        <label
          className={classnames(classes.btn, {
            [classes.active]: toggleOn,
            [classes.inactive]: !toggleOn,
            [classes.disabled]: disabled,
          })}
          onClick={this.onToggle}
        >
          {toggleRight || 'On'}
        </label>
      </>
    )
  }
}

export const ToggleSwitch = withStyles(styles)(_ToggleSwitch)
