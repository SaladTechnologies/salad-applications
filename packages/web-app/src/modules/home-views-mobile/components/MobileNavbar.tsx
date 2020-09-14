import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { NavLink } from 'react-router-dom'
import { SaladTheme } from '../../../SaladTheme'

export class MobileNavItem {
  constructor(
    public readonly name: string,
    public readonly icon: JSX.Element,
    public readonly linkUrl: string | undefined,
    public readonly callback: (() => void) | undefined = undefined,
  ) {}
}

const styles = (theme: SaladTheme) => ({
  container: {
    height: 64,
    display: 'flex',

    borderTop: `1px solid ${theme.green}`,
  },
  icon: { padding: 5 },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    fontFamily: theme.fontGroteskLight25,
    fontSize: 8,
    color: theme.green,
    textDecoration: 'none',
  },
  activeItem: {
    color: theme.lightGreen,
  },
})

interface Props extends WithStyles<typeof styles> {
  navItems?: MobileNavItem[]
}

class _MobileNavbar extends Component<Props> {
  render() {
    const { navItems, classes } = this.props

    return (
      <div className={classes.container}>
        {navItems &&
          navItems.map((x) => {
            if (x.linkUrl) {
              return (
                <NavLink key={x.name} to={x.linkUrl} className={classes.item} activeClassName={classes.activeItem}>
                  <div className={classes.icon}>{x.icon} </div>
                  {x.name}
                </NavLink>
              )
            } else {
              return (
                <div onClick={x.callback} className={classes.item}>
                  <div className={classes.icon}>{x.icon} </div>
                  {x.name}
                </div>
              )
            }
          })}
      </div>
    )
  }
}

export const MobileNavbar = withStyles(styles)(_MobileNavbar)
