import React, { Component } from 'react'

// Styles
import { styles } from './MenuTitle.styles'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import { NavLink } from 'react-router-dom'

interface Props extends WithStyles<typeof styles> {
  path?: string
}

class _MenuTitle extends Component<Props> {
  state = {
    toggle: false,
  }

  toggleActive = () => {
    this.setState({
      toggle: !this.state.toggle,
    })
  }

  render() {
    const { path, children, classes } = this.props

    const elements = path ? (
      <label className={`menuTitle ${classes.menuTitle}`}>
        <NavLink to={path} activeClassName="active">
          {children}
        </NavLink>
      </label>
    ) : (
      <label className={`menuTitle ${classes.menuTitle}`}>{children}</label>
    )

    return <>{elements}</>
  }
}

export const MenuTitle = withStyles(styles)(_MenuTitle)
