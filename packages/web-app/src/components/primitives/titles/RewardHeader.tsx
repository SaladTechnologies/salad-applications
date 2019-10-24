import React, { Component } from 'react'

// Theme
import { SaladTheme } from '../../../SaladTheme'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  rewardHeader: {
    color: theme.lightGreen,
    fontFamily: theme.fontGroteskBook25,
    fontSize: theme.small,
    lineHeight: theme.small,
    letterSpacing: '1.5px'
  },
})

interface Props extends WithStyles<typeof styles> {
}

class _RewardHeader extends Component<Props> {
  render() {
    const { children, classes } = this.props

    return <label className={classnames(classes.rewardHeader)}>{children}</label>
  }
}

export const RewardHeader = withStyles(styles)(_RewardHeader)
