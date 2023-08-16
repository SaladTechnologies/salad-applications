import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  header: {
    fontFamily: theme.fontGroteskLight09,
    fontSize: 56,
    color: theme.green,
    textShadow: '0px 0px 24px rgba(178, 213, 48, 0.70)',
    fontWeight: 300,
    lineHeight: 1,
  },
})

interface Props extends WithStyles<typeof styles> {
  children?: ReactNode
}

class _SectionHeader extends Component<Props> {
  public override render(): ReactNode {
    const { children, classes } = this.props

    return <div className={classes.header}>{children}</div>
  }
}

export const SectionHeader = withStyles(styles)(_SectionHeader)
