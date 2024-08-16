import { faKey } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { useEffect, type FC } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import { Field, Form } from 'react-final-form'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import Referrals from '../../../assets/Referrals.svg'
import { TextField } from '../../../components'
import { withLogin } from '../../auth-views'
import { getDefaultPasskeyName } from './utils'

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
    boxSizing: 'border-box',
    '@media (max-width: 720px)': {
      padding: '16px',
      marginTop: '0px',
      marginLeft: '0px',
    },
  },
  header: {
    color: theme.lightGreen,
    '@media (max-width: 720px)': {
      fontSize: theme.xLarge,
    },
  },
  description: {
    maxWidth: '400px',
    marginBottom: '48px',
    boxSizing: 'border-box',
    '@media (max-width: 720px)': {
      width: '100%',
      maxWidth: '100%',
    },
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '48px',
  },
  image: {
    height: '100vh',
    '@media (max-width: 720px)': {
      display: 'none',
    },
  },
  formWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'column',
    height: '250px',
    width: '100%',
    boxSizing: 'border-box',
  },
  textField: {
    backgroundColor: theme.white,
    height: '30px',
    width: '100%',
    color: theme.darkBlue,
    fontSize: '15px',
  },
  addPasskeyIcon: {
    position: 'relative',
    top: '-3px',
  },
})

interface FormValues {
  passkeyName: string
}

const addPasskeyFailedText = 'There was an error setting up your passkey. Try again.'

interface Props extends WithStyles<typeof styles> {
  isPasskeySupported: boolean
  hasRegisterPasskeyFailed: boolean
  registerPasskey: (passkeyName: string) => void
  setHasRegisterPasskeyFailed: (updatedHasRegisterPasskeyFailed: boolean) => void
  backToProfile: () => void
}

const _PasskeySetupPage: FC<Props> = ({
  classes,
  isPasskeySupported,
  hasRegisterPasskeyFailed,
  registerPasskey,
  backToProfile,
  setHasRegisterPasskeyFailed,
}) => {
  const handleAddPasskeySubmit = (values: FormValues) => {
    registerPasskey?.(values.passkeyName)
  }

  const validate = (values: FormValues) => {
    const errors: FormValues = {
      passkeyName: '',
    }

    if (!values.passkeyName) {
      errors.passkeyName = 'Passkey Nickname cannot be empty'
      return errors
    }

    const passkeyRegExp = new RegExp(/^.{2,120}$/)
    if (!passkeyRegExp.test(values.passkeyName)) {
      errors.passkeyName = 'Passkey Nickname must be between 2 - 120 characters!'
      return errors
    }

    return undefined
  }

  useEffect(() => {
    return () => setHasRegisterPasskeyFailed(false)
  }, [setHasRegisterPasskeyFailed])

  const handlePasskeyNameChange = () => {
    setHasRegisterPasskeyFailed(false)
  }

  return (
    <Scrollbars>
      <div className={classes.container}>
        <div className={classes.textContainer}>
          <Text className={classes.header} as="h1" variant="headline">
            Passkey Setup
          </Text>
          {isPasskeySupported ? (
            <>
              <Text className={classes.description} variant="baseL">
                Your device supports passkeys. Once you click the button below please continue your device’s Passkey
                setup flow. Once done you’ll be redirected back to Salad.
              </Text>

              <Form
                onSubmit={handleAddPasskeySubmit}
                validate={validate}
                initialValues={{
                  passkeyName: getDefaultPasskeyName(),
                }}
                render={({ handleSubmit }) => {
                  return (
                    <div className={classes.formWrapper}>
                      <form onSubmit={handleSubmit} className={classes.formWrapper} onChange={handlePasskeyNameChange}>
                        <Field name="passkeyName" type="text">
                          {({ input, meta }) => {
                            const validationErrorText = meta.error && meta.touched ? meta.error : null
                            const addPasskeyFailedErrorText = hasRegisterPasskeyFailed ? addPasskeyFailedText : null
                            const errorText = validationErrorText ?? addPasskeyFailedErrorText
                            return (
                              <TextField
                                {...input}
                                label="Passkey Name"
                                inputClassName={classes.textField}
                                placeholder="Passkey Name"
                                errorText={errorText}
                              />
                            )
                          }}
                        </Field>
                        <div className={classes.buttonContainer}>
                          <Button
                            leadingIcon={<FontAwesomeIcon icon={faKey} className={classes.addPasskeyIcon} />}
                            variant="primary-basic"
                            label="Add Passkey"
                            type="submit"
                          />
                          <Button variant="outlined" label="Cancel" onClick={backToProfile} />
                        </div>
                      </form>
                    </div>
                  )
                }}
              />
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
