import classnames from 'classnames'
import React, { Component } from 'react'
// UI
// Packages
import withStyles, { WithStyles } from 'react-jss'
import { P, ToggleSwitch, Username } from '.'

export const styles = {
  container: {
    display: 'flex',
    marginBottom: '20px',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingTop: 10,
  },
  toggler: {
    flex: '0 0 auto',
    margin: '0 1.5rem 0 0',
  },
  description: {},
  extrasContainer: {
    paddingLeft: 30,
  },
}

interface Props extends WithStyles<typeof styles> {
  toggled?: boolean
  disabled?: boolean
  onToggle?: () => void
  title?: string
  description?: string | JSX.Element
  toggleLeft?: string
  toggleRight?: string
}

class _ToggleSetting extends Component<Props> {
  render() {
    const { title, description, disabled, toggled, onToggle, classes, children, toggleLeft, toggleRight } = this.props

    return (
      <div className={classnames(classes.container)}>
        <div className={classnames(classes.toggler)}>
          <ToggleSwitch
            disabled={disabled}
            toggleOn={toggled}
            toggleClick={onToggle}
            toggleLeft={toggleLeft}
            toggleRight={toggleRight}
          />
        </div>
        <div className={classnames(classes.description)}>
          <Username>{title}</Username>
          <P>{description}</P>
        </div>
        <div className={classes.extrasContainer}>{children}</div>
      </div>
    )
  }
}

export const ToggleSetting = withStyles(styles)(_ToggleSetting)
