import { faKey } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Text } from '@saladtechnologies/garden-components'
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
    gap: '48px',
    flexDirection: 'column',
    justifyContent: 'left',
    marginTop: '82px',
    marginLeft: '40px',
    boxSizing: 'border-box',
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
    },
    paddingBottom: '0px',
  },
  description: {
    maxWidth: '400px',
    boxSizing: 'border-box',
    '@media (max-width: 812px)': {
      width: '100%',
      maxWidth: '100%',
    },
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
    height: '180px',
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
  backupCode: string
}

interface Props extends WithStyles<typeof styles> {
  isPasskeySupported: boolean
  backToPreviousPage: () => void
  verifyWithBackupCode: (backupCode: string) => void
  verifyWithPasskey: () => void
}

const _ProtectedActionPage: FC<Props> = ({
  classes,
  isPasskeySupported,
  backToPreviousPage,
  verifyWithBackupCode,
  verifyWithPasskey,
}) => {
  const handleVerifyWithBackupCodeSubmit = (values: FormValues) => {
    verifyWithBackupCode?.(values.backupCode)
  }

  const validate = (values: FormValues) => {
    const errors: FormValues = {
      backupCode: '',
    }

    if (!values.backupCode) {
      errors.backupCode = 'Backup Code cannot be empty'
      return errors
    }

    const backupCodeRegExp = new RegExp(/^.{10}$/)
    if (!backupCodeRegExp.test(values.backupCode)) {
      errors.backupCode = 'Wrong Backup Code'
      return errors
    }

    return undefined
  }

  return (
    <Scrollbars>
      <div className={classes.container}>
        <div className={classes.textContainer}>
          <Text className={classes.header} as="h1" variant="headline">
            Protected Action
          </Text>
          {isPasskeySupported ? (
            <>
              <Text className={classes.description} variant="baseL">
                Please verify your credentials to proceed with this action.
              </Text>
              <Button
                leadingIcon={<FontAwesomeIcon icon={faKey} className={classes.addPasskeyIcon} />}
                variant="primary-basic"
                label="Verify with Passkey"
                onClick={verifyWithPasskey}
              />
            </>
          ) : (
            <Text className={classes.description} variant="baseL">
              This device does not support Passkeys. Please login on a device or browser that supports passkeys and try
              again.
            </Text>
          )}
          <Text className={classes.description} variant="baseL">
            Or verify with a one-time backup code:
          </Text>
          <Form
            onSubmit={handleVerifyWithBackupCodeSubmit}
            validate={validate}
            render={({ handleSubmit }) => {
              return (
                <div className={classes.formWrapper}>
                  <form onSubmit={handleSubmit} className={classes.formWrapper}>
                    <Field name="backupCode" type="text">
                      {({ input, meta }) => {
                        const validationErrorText = meta.error && meta.touched ? meta.error : null
                        return (
                          <TextField
                            {...input}
                            label="Backup Code"
                            inputClassName={classes.textField}
                            placeholder="Backup Code"
                            errorText={validationErrorText}
                          />
                        )
                      }}
                    </Field>
                    <div>
                      <Button variant="primary-basic" label="Verify with Backup Code" type="submit" />
                    </div>
                  </form>
                </div>
              )
            }}
          />
          <Button variant="outlined" label="Cancel" onClick={backToPreviousPage} />
        </div>
        <img className={classes.image} src={Referrals} alt="Referrals Background" />
      </div>
    </Scrollbars>
  )
}

export const ProtectedActionPage = withLogin(withStyles(styles)(_ProtectedActionPage))
