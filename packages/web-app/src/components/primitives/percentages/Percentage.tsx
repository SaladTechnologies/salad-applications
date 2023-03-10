import classnames from 'classnames'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  percentage: {
    color: theme.orange,
    fontFamily: theme.fontGroteskLight05,
    fontSize: theme.xxLarge,
    lineHeight: theme.xxLarge,
  },
})

interface Props extends WithStyles<typeof styles> {
  children?: ReactNode
}

class _Percentage extends Component<Props> {
  public override render(): ReactNode {
    const { children, classes } = this.props

    return <span className={classnames(classes.percentage)}>{children}</span>
  }
}

export const Percentage = withStyles(styles)(_Percentage)
