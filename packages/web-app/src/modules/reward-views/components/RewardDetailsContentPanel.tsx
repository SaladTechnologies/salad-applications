import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Divider } from '../../../components'
import type { SaladTheme } from '../../../SaladTheme'

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
  children?: ReactNode
}

class _RewardDetailsContentPanel extends Component<Props> {
  public override render(): ReactNode {
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
