import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { NavLink } from 'react-router-dom'
import { SaladTheme } from '../SaladTheme'

export class TabItem {
  constructor(public readonly name: string, public readonly linkUrl: string) {}
}

const styles = (theme: SaladTheme) => ({
  container: {
    padding: '20px 10px',
    display: 'flex',
    borderBottom: `1px solid ${theme.lightGreen}`,
    justifyContent: 'space-around',
  },
  item: {
    color: theme.green,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: theme.fontGroteskLight25,
    fontSize: 12,
    textDecoration: 'none',
  },
  activeItem: {
    color: theme.lightGreen,
  },
})

interface Props extends WithStyles<typeof styles> {
  tabs?: TabItem[]
}

class _TabControl extends Component<Props> {
  render() {
    const { tabs, classes } = this.props

    return (
      <div className={classes.container}>
        {tabs &&
          tabs.map((x) => (
            <NavLink key={x.name} to={x.linkUrl} className={classes.item} activeClassName={classes.activeItem}>
              <div>{x.name}</div>
            </NavLink>
          ))}
      </div>
    )
  }
}

export const TabControl = withStyles(styles)(_TabControl)
