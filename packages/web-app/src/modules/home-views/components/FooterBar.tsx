import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { SmartLink } from '../../../components'

export class MenuItem {
  constructor(public readonly name: string, public readonly url: string, public readonly showNotification?: boolean) {}
}

const styles = (theme: SaladTheme) => ({
  container: {
    color: theme.green,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'stretch',
    paddingLeft: 10,
    margin: 0,
    fontFamily: theme.fontGroteskBook19,
    fontSize: 12,
    borderTop: `1px solid ${theme.green}`,
  },
  statusText: {
    textTransform: 'uppercase',
  },
})

interface Props extends WithStyles<typeof styles> {
  status?: string
}

class _FooterBar extends Component<Props> {
  render() {
    const { status, classes } = this.props
    return (
      <div className={classes.container}>
        <div className={classes.statusText}>
          <SmartLink to="/earn/mine">{status}</SmartLink>
        </div>
      </div>
    )
  }
}

export const FooterBar = withStyles(styles)(_FooterBar)
