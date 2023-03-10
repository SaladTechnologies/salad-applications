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
    paddingBottom: 6,
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

class _Li extends Component<Props> {
  public override render(): ReactNode {
    const { className, bold, children, classes } = this.props

    return <li className={classnames(classes.appBody, className, { [classes.bold]: bold })}>{children}</li>
  }
}

export const Li = withStyles(styles)(_Li)
