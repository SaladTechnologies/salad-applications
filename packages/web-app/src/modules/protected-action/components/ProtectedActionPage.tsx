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

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  pageWrapper: {
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2000,
  },
  pageContent: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  leftSideWrapper: {
    position: 'relative',
    display: 'flex',
    gap: '48px',
    flexDirection: 'column',
    justifyContent: 'left',
    marginTop: '82px',
    marginLeft: '40px',
    boxSizing: 'border-box',
    width: '50%',
    '@media (max-width: 812px)': {
      padding: '16px',
      marginTop: '0px',
      marginLeft: '0px',
      width: '100%',
    },
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
  errorText: {
    maxWidth: '400px',
    boxSizing: 'border-box',
    '@media (max-width: 812px)': {
      width: '100%',
      maxWidth: '100%',
    },
    color: theme.white,
    backgroundColor: theme.red,
    boxShadow: `0px 0px 30px ${theme.red}`,
    padding: '12px',
    margin: '4px 0px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    position: 'relative',
    width: '50%',
    height: '100%',
    backgroundImage: `url(${Referrals})`,
    backgroundRepeat: 'no-repeat',
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

const verifyBackupCodeFailedText = 'Backup code verification failure, please try again'

interface FormValues {
  backupCode: string
}

interface Props extends WithStyles<typeof styles> {
  isPasskeySupported: boolean
  withPendingProtectedAction: boolean
  hasVerifyWithBackupCodeFailed: boolean
  hasVerifyWithPasskeyFailed: boolean
  backToAccount: () => void
  setHasVerifyWithBackupCodeFailed: (updatedHasVerifyWithBackupCodeFailed: boolean) => void
  setHasVerifyWithPasskeyFailed: (updatedHasVerifyWithPasskeyFailed: boolean) => void
  verifyWithPasskey: () => void
  verifyWithBackupCode: (backupCode: string) => void
}

const _ProtectedActionPage: FC<Props> = ({
  classes,
  isPasskeySupported,
  withPendingProtectedAction,
  hasVerifyWithBackupCodeFailed,
  hasVerifyWithPasskeyFailed,
  backToAccount,
  setHasVerifyWithBackupCodeFailed,
  setHasVerifyWithPasskeyFailed,
  verifyWithPasskey,
  verifyWithBackupCode,
}) => {
  useEffect(() => {
    if (!withPendingProtectedAction) {
      backToAccount()
    }
  }, [withPendingProtectedAction, backToAccount])

  useEffect(() => {
    return () => {
      setHasVerifyWithBackupCodeFailed(false)
      setHasVerifyWithPasskeyFailed(false)
    }
  }, [setHasVerifyWithBackupCodeFailed, setHasVerifyWithPasskeyFailed])

  const handleVerifyWithBackupCodeSubmit = (values: FormValues) => {
    setHasVerifyWithBackupCodeFailed(false)
    setHasVerifyWithPasskeyFailed(false)
    verifyWithBackupCode?.(values.backupCode)
  }

  const handleVerifyWithPasskeyClick = () => {
    setHasVerifyWithBackupCodeFailed(false)
    setHasVerifyWithPasskeyFailed(false)
    verifyWithPasskey()
  }

  const handleBackupCodeChange = () => {
    setHasVerifyWithPasskeyFailed(false)
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
    <div className={classes.pageWrapper}>
      <Scrollbars>
        <div className={classes.pageContent}>
          <div className={classes.leftSideWrapper}>
            <Text className={classes.header} as="h1" variant="headline">
              Protected Action
            </Text>
            {isPasskeySupported ? (
              <>
                <Text className={classes.description} variant="baseL">
                  Please verify your credentials to proceed with this action.
                </Text>
                <div className={classes.buttonContainer}>
                  <Button
                    leadingIcon={<FontAwesomeIcon icon={faKey} className={classes.addPasskeyIcon} />}
                    variant="primary-basic"
                    label="Verify with Passkey"
                    onClick={handleVerifyWithPasskeyClick}
                  />
                  {hasVerifyWithPasskeyFailed && (
                    <Text className={classes.errorText} variant="baseS">
                      Passkey verification failure, please try again
                    </Text>
                  )}
                </div>
              </>
            ) : (
              <Text className={classes.description} variant="baseL">
                This device does not support Passkeys. Please login on a device or browser that supports passkeys and
                try again.
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
                    <form onSubmit={handleSubmit} className={classes.formWrapper} onChange={handleBackupCodeChange}>
                      <Field name="backupCode" type="text">
                        {({ input, meta }) => {
                          const validationErrorText = meta.error && meta.touched ? meta.error : null
                          const addPasskeyFailedErrorText = hasVerifyWithBackupCodeFailed
                            ? verifyBackupCodeFailedText
                            : null
                          const errorText = validationErrorText ?? addPasskeyFailedErrorText
                          return (
                            <TextField
                              {...input}
                              label="Backup Code"
                              inputClassName={classes.textField}
                              placeholder="Backup Code"
                              errorText={errorText}
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
            <div>
              <Button variant="outlined" label="Cancel" onClick={backToAccount} />
            </div>
          </div>
          <div className={classes.image} />
        </div>
      </Scrollbars>
    </div>
  )
}

export const ProtectedActionPage = withLogin(withStyles(styles)(_ProtectedActionPage))
