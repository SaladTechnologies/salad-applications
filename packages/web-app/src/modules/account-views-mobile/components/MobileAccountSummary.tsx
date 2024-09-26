import { type FC } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Button, Divider, P, StatElement } from '../../../components'
import { AccountSecurityContainer } from '../../account-views/account-views/components/AccountSecurity'
import { type Passkey } from '../../passkey-setup'

const styles = {
  container: { display: 'flex', flexDirection: 'column' },
  logoutButton: { display: 'flex', justifyContent: 'center' },
}

interface Props extends WithStyles<typeof styles> {
  passkeys: Passkey[]
  username?: string
  onLogout?: () => void
}

const _MobileAccountSummary: FC<Props> = ({ classes, username, onLogout }) => {
  const handleLogout = () => {
    onLogout?.()
  }

  return (
    <div className={classes.container}>
      <StatElement title={'Username'} values={[username || '']} />
      <P>Use the Salad App to manage your account or make purchases from the Salad Store</P>
      <Divider />
      <div className={classes.logoutButton}>
        <Button onClick={handleLogout}>Log Out</Button>
      </div>
      <Divider />
      <AccountSecurityContainer />
    </div>
  )
}

export const MobileAccountSummary = withStyles(styles)(_MobileAccountSummary)
