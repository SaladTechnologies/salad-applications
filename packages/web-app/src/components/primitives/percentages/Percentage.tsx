import classnames from 'classnames'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  percentage: {
    color: theme.orange,
    fontFamily: theme.fontGroteskLight05,
    fontSize: theme.xxLarge,
    lineHeight: theme.xxLarge,
  },
})

interface Props extends WithStyles<typeof styles> {}

class _Percentage extends Component<Props> {
  render() {
    const { children, classes } = this.props

    return <span className={classnames(classes.percentage)}>{children}</span>
  }
}

export const Percentage = withStyles(styles)(_Percentage)
