import { useEffect, type FC } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Button, Divider, P, StatElement } from '../../../components'
import { AccountSecurity } from '../../account-views/account-views/components/AccountSecurity'
import { isPasskeyFeatureEnabled, type Passkey } from '../../passkey-setup'

const styles = {
  container: { display: 'flex', flexDirection: 'column' },
  logoutButton: { display: 'flex', justifyContent: 'center' },
}

interface Props extends WithStyles<typeof styles> {
  passkeys: Passkey[]
  username?: string
  onAddPasskeyClick: () => void
  onDeletePasskeyClick: (passkeyId: string) => void
  onLogout?: () => void
  fetchPasskeys: () => void
}

const _MobileAccountSummary: FC<Props> = ({
  classes,
  passkeys,
  username,
  onAddPasskeyClick,
  onDeletePasskeyClick,
  onLogout,
  fetchPasskeys,
}) => {
  const handleLogout = () => {
    onLogout?.()
  }

  useEffect(() => {
    fetchPasskeys()
  }, [fetchPasskeys])

  return (
    <div className={classes.container}>
      <StatElement title={'Username'} values={[username || '']} />
      <P>Use the Salad App to manage your account or make purchases from the Salad Store</P>
      <Divider />
      <div className={classes.logoutButton}>
        <Button onClick={handleLogout}>Log Out</Button>
      </div>
      <Divider />
      {isPasskeyFeatureEnabled && (
        <AccountSecurity
          passkeys={passkeys}
          onDeletePasskeyClick={onDeletePasskeyClick}
          onAddPasskeyClick={onAddPasskeyClick}
        />
      )}
    </div>
  )
}

export const MobileAccountSummary = withStyles(styles)(_MobileAccountSummary)
