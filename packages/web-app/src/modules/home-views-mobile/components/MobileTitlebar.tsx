import React, { Component } from 'react'
import Img from 'react-image'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import icon from '../assets/favicon-32x32.png'

export class MenuItem {
  constructor(public readonly name: string, public readonly url: string, public readonly showNotification?: boolean) {}
}

const styles = (theme: SaladTheme) => ({
  container: {
    color: theme.green,
    height: 42,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    fontFamily: theme.fontGroteskLight25,
    borderBottom: `1px solid ${theme.green}`,
  },
  icon: {},
})

interface Props extends WithStyles<typeof styles> {}

class _MobileTitlebar extends Component<Props> {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.container}>
        <div className={classes.icon}>
          <Img src={icon} />
        </div>
      </div>
    )
  }
}

export const MobileTitlebar = withStyles(styles)(_MobileTitlebar)
