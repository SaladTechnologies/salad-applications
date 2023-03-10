import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  header: {
    fontFamily: theme.fontGroteskLight25,
    textTransform: 'capitalize',
    lineHeight: '150%',
    fontSize: 36,
    paddingBottom: 20,
  },
})

interface Props extends WithStyles<typeof styles> {
  children?: ReactNode
}

class _HeroTitle extends Component<Props> {
  public override render(): ReactNode {
    const { children, classes } = this.props

    return <div className={classes.header}>{children}</div>
  }
}

export const HeroTitle = withStyles(styles)(_HeroTitle)
