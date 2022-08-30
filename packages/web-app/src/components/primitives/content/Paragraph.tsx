import classnames from 'classnames'
import { Component, ReactNode } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'

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
  render() {
    const { className, bold, children, classes } = this.props

    return <p className={classnames(classes.appBody, className, { [classes.bold]: bold })}>{children}</p>
  }
}

export const P = withStyles(styles)(_P)
