import classnames from 'classnames'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  username: {
    fontFamily: theme.fontGroteskLight25,
    fontSize: theme.mediumLarge,
    lineHeight: theme.mediumLarge,
  },
})

interface Props extends WithStyles<typeof styles> {}

class _Username extends Component<Props> {
  render() {
    const { children, classes } = this.props

    return <label className={classnames(classes.username)}>{children}</label>
  }
}

export const Username = withStyles(styles)(_Username)
