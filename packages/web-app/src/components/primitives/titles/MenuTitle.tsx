import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  menuTitle: {
    fontFamily: theme.fontGroteskBook25,
    fontSize: theme.small,
    lineHeight: theme.small,
    letterSpacing: '0.01rem',
    fontWeight: 'normal',
    color: theme.green,

    '& a': {
      color: 'inherit',
      textDecoration: 'none',

      '&:hover, &:active, &.active': {
        color: `${theme.lightGreen}`,
      },
    },
  },
  disabledItem: {
    '& a, & p': {
      paddingBottom: 12,
      opacity: '0.5 !important',
      cursor: 'not-allowed !important',
      '&:hover, &:active, &.active': {
        // color: 'blue !important',
        opacity: '0.2 !important',
      },
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  path?: string
  className?: string
  enabled?: boolean
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
    const { path, children, className, classes, enabled } = this.props

    const elements = path ? (
      <label
        className={classNames(`menuTitle ${classes.menuTitle}`, className, {
          [classes.disabledItem]: enabled === false,
        })}
      >
        {enabled !== false ? (
          <NavLink to={path} activeClassName="active">
            {children}
          </NavLink>
        ) : (
          <p>{children}</p>
        )}
      </label>
    ) : (
      <label className={classNames(`menuTitle ${classes.menuTitle}`, className)}>{children}</label>
    )

    return <>{elements}</>
  }
}

export const MenuTitle = withStyles(styles)(_MenuTitle)
