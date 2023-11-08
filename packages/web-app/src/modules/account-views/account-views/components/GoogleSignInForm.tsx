import classNames from 'classnames'
import type { FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { config } from '../../../../config'
import GoogleSigninDarkDisabled from './assets/GoogleSigninDarkDisabled.svg'
import GoogleSigninDarkFocused from './assets/GoogleSigninDarkFocused.svg'
import GoogleSigninDarkNormal from './assets/GoogleSigninDarkNormal.svg'
import GoogleSigninDarkPressed from './assets/GoogleSigninDarkPressed.svg'

const styles = {
  formContainer: {
    width: 191,
    height: 46,
  },
  googleSigninButton: {
    padding: 0,
    margin: 0,
    border: 'none',
    width: '100%',
    height: '100%',
    background: 'transparent',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    cursor: 'pointer',
  },
  googleSigninButtonEnabled: {
    backgroundImage: `url(${GoogleSigninDarkNormal})`,

    '&:hover': {
      backgroundImage: `url(${GoogleSigninDarkFocused})`,
    },
    '&:active': {
      backgroundImage: `url(${GoogleSigninDarkPressed})`,
    },

    /*Preload google button images*/
    '&::after': {
      position: 'absolute',
      width: 0,
      height: 0,
      overflow: 'hidden',
      zIndex: -1,
      content: `url(${GoogleSigninDarkNormal}) url(${GoogleSigninDarkDisabled}) url(${GoogleSigninDarkFocused}) url(${GoogleSigninDarkPressed})`,
    },
  },
  googleSigninButtonDisabled: {
    backgroundImage: `url(${GoogleSigninDarkDisabled})`,
    cursor: 'not-allowed',
  },
}

export interface GoogleSignInFormProps extends WithStyles<typeof styles> {
  isTermsAndConditionsAccepted: boolean
  isTermsAndConditionsRequired: boolean
}
export const _GoogleSignInForm: FunctionComponent<GoogleSignInFormProps> = ({
  classes,
  isTermsAndConditionsAccepted,
  isTermsAndConditionsRequired,
}) => {
  const shouldEnableGoogleSignInButton = !isTermsAndConditionsRequired || isTermsAndConditionsAccepted
  const shouldDisableGoogleSignInButton = isTermsAndConditionsRequired && !isTermsAndConditionsAccepted

  return (
    <form
      className={classes.formContainer}
      action={`${config.apiBaseUrl}/api/v2/authentication/external`}
      method="POST"
    >
      <input type="hidden" name="provider" value="google" />
      {isTermsAndConditionsRequired && (
        <input type="hidden" name="termsAccepted" value={`${isTermsAndConditionsAccepted}`} />
      )}
      <button
        className={classNames(classes.googleSigninButton, {
          [classes.googleSigninButtonEnabled]: shouldEnableGoogleSignInButton,
          [classes.googleSigninButtonDisabled]: shouldDisableGoogleSignInButton,
        })}
        type="submit"
        disabled={shouldDisableGoogleSignInButton}
      />
    </form>
  )
}

export const GoogleSignInForm = withStyles(styles)(_GoogleSignInForm)
