import classnames from 'classnames'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  username: {
    fontFamily: theme.fontGroteskLight25,
    fontSize: theme.mediumLarge,
    lineHeight: theme.mediumLarge,
  },
})

interface Props extends WithStyles<typeof styles> {
  children?: ReactNode
}

class _Username extends Component<Props> {
  public override render(): ReactNode {
    const { children, classes } = this.props

    return <label className={classnames(classes.username)}>{children}</label>
  }
}

export const Username = withStyles(styles)(_Username)
