import classnames from 'classnames'
import { Component, ReactNode } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'

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
  render() {
    const { children, classes } = this.props

    return <h1 className={classnames(classes.condensedHeader)}>{children}</h1>
  }
}

export const CondensedHeader = withStyles(styles)(_CondensedHeader)
