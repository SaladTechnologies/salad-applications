import { Button, Text } from '@saladtechnologies/garden-components'
import { Key } from '@saladtechnologies/garden-icons'
import type CSS from 'csstype'
import { type FC } from 'react'
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
})

interface FormValues {
  passkeyName: string
}

interface Props extends WithStyles<typeof styles> {
  isPasskeySupported: boolean
  registerPasskey: (passkeyName: string) => void
  backToProfile: () => void
}

const _PasskeySetupPage: FC<Props> = ({ classes, isPasskeySupported, registerPasskey, backToProfile }) => {
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
                      <form onSubmit={handleSubmit} className={classes.formWrapper}>
                        <Field name="passkeyName" type="text">
                          {({ input, meta }) => (
                            <TextField
                              {...input}
                              label="Passkey Name"
                              className={classes.textField}
                              placeholder="Passkey Name"
                              errorText={meta.error && meta.touched && meta.error}
                            />
                          )}
                        </Field>
                        <div className={classes.buttonContainer}>
                          <Button leadingIcon={<Key />} variant="primary-basic" label="Add Passkey" type="submit" />
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
