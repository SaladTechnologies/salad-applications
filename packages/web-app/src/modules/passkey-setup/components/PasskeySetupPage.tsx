import { Button, Text } from '@saladtechnologies/garden-components'
import { Key } from '@saladtechnologies/garden-icons'
import type CSS from 'csstype'
import { type FC } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import { withLogin } from '../../auth-views'
import Referrals from './assets/Referrals.svg'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  container: {
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2000,
    display: 'flex',
    justifyContent: 'space-around',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'left',
    marginTop: '82px',
    marginLeft: '40px',
  },
  header: {
    color: theme.lightGreen,
  },
  description: {
    maxWidth: '400px',
    marginBottom: '48px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '48px',
  },
  image: {
    height: '100vh',
  },
})

interface Props extends WithStyles<typeof styles> {
  backToProfile: () => void
  registerPasskey: () => void
}

const _PasskeySetupPage: FC<Props> = ({ backToProfile, registerPasskey, classes }) => {
  const isDeviceSupportPasskey = false
  return (
    <Scrollbars>
      <div className={classes.container}>
        <div className={classes.textContainer}>
          <Text className={classes.header} as="h1" variant="headline">
            Passkey Setup
          </Text>
          {isDeviceSupportPasskey ? (
            <>
              <Text className={classes.description} variant="baseL">
                Your device supports passkeys. Once you click the button below please continue your device’s Passkey
                setup flow. Once done you’ll be redirected back to Salad.
              </Text>
              <div className={classes.buttonContainer}>
                <Button leadingIcon={<Key />} variant="primary-basic" label="Add Passkey" onClick={registerPasskey} />
                <Button variant="outlined" label="Cancel" onClick={backToProfile} />
              </div>
            </>
          ) : (
            <>
              <Text className={classes.description} variant="baseL">
                This device does not support Passkeys. Please login on a device or browser that supports passkeys and
                try again.
              </Text>
              <Button variant="primary-basic" label="Back to Profile" onClick={backToProfile} />
            </>
          )}
        </div>
        <img className={classes.image} src={Referrals} alt="Referrals Background" />
      </div>
    </Scrollbars>
  )
}

export const PasskeySetupPage = withLogin(withStyles(styles)(_PasskeySetupPage))
