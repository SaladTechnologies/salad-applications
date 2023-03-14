import classnames from 'classnames'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  condensedHeader: {
    fontFamily: theme.fontGroteskLight09,
    fontSize: theme.xLarge,
    lineHeight: theme.xLarge,
    fontWeight: 'normal',
    margin: 0,
    padding: 0,
  },
})

interface Props extends WithStyles<typeof styles> {
  children?: ReactNode
}

class _CondensedHeader extends Component<Props> {
  public override render(): ReactNode {
    const { children, classes } = this.props

    return <h1 className={classnames(classes.condensedHeader)}>{children}</h1>
  }
}

export const CondensedHeader = withStyles(styles)(_CondensedHeader)
