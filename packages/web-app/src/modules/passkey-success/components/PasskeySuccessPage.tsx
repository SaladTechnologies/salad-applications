import { Button, Text, TextField } from '@saladtechnologies/garden-components'
import { Eye } from '@saladtechnologies/garden-icons'
import type CSS from 'csstype'
import { type FC } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import Referrals from '../../../assets/Referrals.svg'
import { withLogin } from '../../auth-views'

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
    maxWidth: '600px',
    color: theme.lightGreen,
  },
  descriptionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    maxWidth: '400px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '48px',
  },
  inputContainer: {
    margin: '48px 0px',
  },
  image: {
    height: '100vh',
  },
})

interface Props extends WithStyles<typeof styles> {
  isPasskeyNicknameSubmitSuccess: boolean
  isPasskeyNicknameSubmitting: boolean
  onUpdatePasskeyNickname: () => void
  viewRecoveryCodes: () => void
}

const _PasskeySuccessPage: FC<Props> = ({
  isPasskeyNicknameSubmitSuccess,
  isPasskeyNicknameSubmitting,
  onUpdatePasskeyNickname,
  viewRecoveryCodes,
  classes,
}) => (
  <Scrollbars>
    <div className={classes.container}>
      <div className={classes.textContainer}>
        <Text className={classes.header} as="h1" variant="headline">
          Success! Passkey Added
        </Text>
        <div className={classes.descriptionContainer}>
          <Text variant="baseL">From now on you can login to Salad using this passkey.</Text>
          <Text variant="baseXL">Passkey Nickname</Text>
          <Text variant="baseL">
            Depending on your passkey manager your passkey may work only on this device or on multiple ones. Add a
            nickname to it so you can identify it later. For example the name of your device or passkey manager.
          </Text>
          <div className={classes.inputContainer}>
            <TextField
              isSubmitting={isPasskeyNicknameSubmitting}
              isSubmitSuccess={isPasskeyNicknameSubmitSuccess}
              validationRegexErrorMessage="Passkey Nickname must be between 2 - 120 characters!"
              label="Passkey Nickname"
              onSubmit={onUpdatePasskeyNickname}
              validationRegex={/^.{2,120}$/}
            />
          </div>
          <Button
            leadingIcon={<Eye />}
            variant="primary-basic"
            label="View Recovery Codes"
            onClick={viewRecoveryCodes}
          />
        </div>
      </div>
      <img className={classes.image} src={Referrals} alt="Referrals Background" />
    </div>
  </Scrollbars>
)

export const PasskeySuccessPage = withLogin(withStyles(styles)(_PasskeySuccessPage))
