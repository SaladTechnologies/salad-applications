import classnames from 'classnames'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  appBody: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: theme.small,
    lineHeight: theme.medium,
  },
  bold: {
    fontWeight: 'bold',
  },
})

interface Props extends WithStyles<typeof styles> {
  className?: string
  bold?: boolean
  children?: ReactNode
}

class _P extends Component<Props> {
  public override render(): ReactNode {
    const { className, bold, children, classes } = this.props

    return <p className={classnames(classes.appBody, className, { [classes.bold]: bold })}>{children}</p>
  }
}

export const P = withStyles(styles)(_P)
