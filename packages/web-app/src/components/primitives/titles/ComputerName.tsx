import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  username: {
    fontFamily: theme.fontGroteskLight25,
    fontSize: theme.medium,
    lineHeight: theme.medium,
  },
})

interface Props extends WithStyles<typeof styles> {
  children?: ReactNode
}

class _ComputerName extends Component<Props> {
  public override render(): ReactNode {
    const { children, classes } = this.props

    return <label className={classes.username}>{children}</label>
  }
}

export const ComputerName = withStyles(styles)(_ComputerName)
