import { faKey } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Text } from '@saladtechnologies/garden-components'
import { AlertCircle } from '@saladtechnologies/garden-icons'
import type CSS from 'csstype'
import { useEffect, type FC } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import Referrals from '../../../assets/Referrals.svg'
import { withLogin } from '../../auth-views'
import type { Passkey } from '../../passkey-setup'

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
    '@media (max-width: 812px)': {
      padding: '16px',
      marginTop: '0px',
      marginLeft: '0px',
    },
  },
  header: {
    color: theme.lightGreen,
    '@media (max-width: 812px)': {
      fontSize: theme.xLarge,
      lineHeight: '48px',
    },
  },
  description: {
    maxWidth: '400px',
    marginBottom: '30px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '48px',
  },
  image: {
    height: '100vh',
    '@media (max-width: 812px)': {
      display: 'none',
    },
  },
  formWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'column',
    height: '230px',
  },
  textField: {
    backgroundColor: theme.white,
    height: '30px',
    width: '450px',
    color: theme.darkBlue,
    fontSize: '15px',
  },
  infoBanner: {
    background: 'transparent',
    color: theme.white,
    border: `1px solid ${theme.white}`,
    borderRadius: '2px',
    minHeight: '40px',
    maxWidth: '305px',
    marginBottom: '18px',
    padding: '6px 6px',
    width: 'max-content',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: '10px',
  },
  addPasskeyIcon: {
    position: 'relative',
    top: '-3px',
  },
})

interface Props extends WithStyles<typeof styles> {
  isLastPasskey: boolean
  passkey?: Passkey
  onDeletePasskeyClick: () => void
  backToProfile: () => void
}

const _PasskeyDeletePage: FC<Props> = ({ classes, passkey, isLastPasskey, onDeletePasskeyClick, backToProfile }) => {
  const passkeyNickname = passkey?.displayName
  const isPasskeyExisting = !!passkey

  const handleDeletePasskey = () => {
    onDeletePasskeyClick()
    backToProfile()
  }

  useEffect(() => {
    if (!isPasskeyExisting) {
      backToProfile()
    }
  }, [isPasskeyExisting, backToProfile])

  return (
    <Scrollbars>
      <div className={classes.container}>
        <div className={classes.textContainer}>
          <Text className={classes.header} as="h1" variant="headline">
            Delete Passkey
          </Text>
          <Text className={classes.description} variant="baseL">
            Are you sure you want to delete <strong>{passkeyNickname}</strong>?
          </Text>
          {isLastPasskey && (
            <div className={classes.infoBanner}>
              <div>
                <AlertCircle width={30} height={30} />
              </div>
              <Text variant="baseS">Deleting this passkey will disable 2FA protections on your account.</Text>
            </div>
          )}
          <div className={classes.buttonContainer}>
            <Button
              leadingIcon={<FontAwesomeIcon icon={faKey} className={classes.addPasskeyIcon} />}
              variant="primary-basic"
              label="Delete Passkey"
              onClick={handleDeletePasskey}
            />
            <Button variant="outlined" label="Cancel" onClick={backToProfile} />
          </div>
        </div>
        <img className={classes.image} src={Referrals} alt="Referrals Background" />
      </div>
    </Scrollbars>
  )
}

export const PasskeyDeletePage = withLogin(withStyles(styles)(_PasskeyDeletePage))
