import classnames from 'classnames'
import { Component, ReactNode } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'

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
  render() {
    const { className, bold, children, classes } = this.props

    return <li className={classnames(classes.appBody, className, { [classes.bold]: bold })}>{children}</li>
  }
}

export const Li = withStyles(styles)(_Li)
