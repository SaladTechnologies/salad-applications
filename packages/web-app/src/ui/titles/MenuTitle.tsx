import React, { Component } from 'react'

// Styles
import { styles } from './MenuTitle.styles'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import { NavLink } from 'react-router-dom';

interface Props extends WithStyles<typeof styles> { 
  path?: string
}

class _MenuTitle extends Component<Props> {
  state = {
    toggle: false
  }

  toggleActive = () => {
    this.setState({
      toggle: !this.state.toggle
    })
  }

  render() {
    const {
      path,
      children,
      classes
    } = this.props

    const elements = path 
      ? (<h5 className={`menuTitle ${classes.menuTitle}`}>
          <NavLink to={path} activeClassName="active">
            {children}
          </NavLink>
        </h5>)
      : (<h5 className={`menuTitle ${classes.menuTitle}`}>
          {children}
        </h5>)

    return (
      <>
        {elements}
      </>
    )
  }
}

export const MenuTitle = withStyles(styles)(_MenuTitle)
