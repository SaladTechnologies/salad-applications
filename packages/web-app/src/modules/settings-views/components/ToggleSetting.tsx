import React, { Component } from 'react'

// UI

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { ToggleSwitch, Username, P } from '../../../components'

export const styles = ({
  container: {
    display: 'flex',
    marginBottom: '20px',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  toggler: {
    flex: '0 0 auto',
    margin: '0 1.5rem 0 0',
  },
  description: {},
  extrasContainer: {
    paddingLeft: 30,
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
    const { title, description, toggled, onToggle, classes, children } = this.props

    return (
      <div className={classnames(classes.container)}>
        <div className={classnames(classes.toggler)}>
          <ToggleSwitch toggleOn={toggled} toggleClick={onToggle} />
        </div>
        <div className={classnames(classes.description)}>
          <Username blue>{title}</Username>
          <P>{description}</P>
        </div>
        <div className={classes.extrasContainer}>{children}</div>
      </div>
    )
  }
}

export const ToggleSetting = withStyles(styles)(_ToggleSetting)
