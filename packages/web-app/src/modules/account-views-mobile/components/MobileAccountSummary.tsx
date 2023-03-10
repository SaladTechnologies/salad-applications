import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Button, Divider, P, StatElement } from '../../../components'

const styles = {
  container: { display: 'flex', flexDirection: 'column' },
  logoutButton: { display: 'flex', justifyContent: 'center' },
}

interface Props extends WithStyles<typeof styles> {
  username?: string
  onLogout?: () => void
}

class _MobileAccountSummary extends Component<Props> {
  handleLogout = () => {
    const { onLogout } = this.props

    onLogout?.()
  }

  public override render(): ReactNode {
    const { username, classes } = this.props

    return (
      <div className={classes.container}>
        <StatElement title={'Username'} values={[username || '']} />
        <P>Use the Salad App to manage your account or make purchases from the Salad Store</P>
        <Divider />
        <div className={classes.logoutButton}>
          <Button onClick={this.handleLogout}>Log Out</Button>
        </div>
        <Divider />
      </div>
    )
  }
}

export const MobileAccountSummary = withStyles(styles)(_MobileAccountSummary)
