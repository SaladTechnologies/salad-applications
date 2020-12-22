import { Component } from 'react'
import { Img } from 'react-image'
import withStyles, { WithStyles } from 'react-jss'
import { NavLink } from 'react-router-dom'
import { SaladTheme } from '../../../SaladTheme'

export class MobileNavItem {
  constructor(
    public readonly name: string,
    public readonly icon: string,
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
    // Generated filter to change svg colors here. : https://codepen.io/sosuke/pen/Pjoqqp
    // Since the base svg is not black, ensure brightness(0) saturate(100%) is at the start
    filter:
      'brightness(0) saturate(100%) invert(88%) sepia(6%) saturate(1063%) hue-rotate(48deg) brightness(110%) contrast(89%)',
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
                  <Img className={classes.icon} src={x.icon} />
                  {x.name}
                </NavLink>
              )
            } else {
              return (
                <div key={x.name} onClick={x.callback} className={classes.item}>
                  <Img className={classes.icon} src={x.icon} />
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
