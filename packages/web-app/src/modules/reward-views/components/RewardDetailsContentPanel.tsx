import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { Divider } from '../../../components'

const styles = (theme: SaladTheme) => ({
  container: {
    color: theme.lightGreen,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 990,
    padding: '20px 60px',
    boxSizing: 'border-box',
  },
})

interface Props extends WithStyles<typeof styles> {
  hideDivider?: boolean
}

class _RewardDetailsContentPanel extends Component<Props> {
  render() {
    const { hideDivider, children, classes } = this.props
    return (
      <div className={classes.container}>
        <div className={classes.content}>{children}</div>
        {!hideDivider && <Divider />}
      </div>
    )
  }
}

export const RewardDetailsContentPanel = withStyles(styles)(_RewardDetailsContentPanel)
