import React, { Component } from 'react'

// UI

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { SaladTheme } from '../../../SaladTheme'
import { ToggleSwitch, Username, P } from '../../../components'

export const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    marginBottom: '20px',
  },

  toggler: {
    flex: '0 0 auto',
    margin: '0 1.5rem 0 0',
  },

  description: {
    order: 1,
  },
})

interface Props extends WithStyles<typeof styles> {
  toggled?: boolean
  onToggle?: () => void
  title?: string
  description?: string
}

class _ToggleSetting extends Component<Props> {
  render() {
    const { title, description, toggled, onToggle, classes } = this.props

    return (
      <div className={classnames(classes.container)}>
        <div className={classnames(classes.toggler)}>
          <ToggleSwitch toggleOn={toggled} toggleClick={onToggle} />
        </div>
        <div className={classnames(classes.description)}>
          <Username blue>{title}</Username>
          <P>{description}</P>
        </div>
      </div>
    )
  }
}

export const ToggleSetting = withStyles(styles)(_ToggleSetting)
