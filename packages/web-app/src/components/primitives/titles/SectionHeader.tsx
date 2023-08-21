import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  header: {
    fontFamily: theme.fontGroteskBook25,
    textTransform: 'uppercase',
    fontSize: 10,
    letterSpacing: '1px',
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
