import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'

const styles = (theme: SaladTheme) => ({
  header: {
    fontFamily: theme.fontGroteskBook25,
    textTransform: 'uppercase',
    fontSize: 10,
    letterSpacing: '1px',
  },
})

interface Props extends WithStyles<typeof styles> {}

class _SectionHeader extends Component<Props> {
  render() {
    const { children, classes } = this.props

    return <div className={classes.header}>{children}</div>
  }
}

export const SectionHeader = withStyles(styles)(_SectionHeader)
