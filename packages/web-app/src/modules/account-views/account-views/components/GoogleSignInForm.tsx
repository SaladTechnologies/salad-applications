import classNames from 'classnames'
import { useCallback, useEffect, useRef, type FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { GoogleHiddenSignInForm } from './GoogleHiddenSignInForm'
import GoogleSigninDarkDisabled from './assets/GoogleSigninDarkDisabled.svg'
import GoogleSigninDarkFocused from './assets/GoogleSigninDarkFocused.svg'
import GoogleSigninDarkNormal from './assets/GoogleSigninDarkNormal.svg'
import GoogleSigninDarkPressed from './assets/GoogleSigninDarkPressed.svg'

const styles = {
  googleSigninButton: {
    width: 191,
    height: 46,
    padding: 0,
    margin: 0,
    border: 'none',
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
  isGoogleSignInFormTriggered: boolean
  signInWithGoogleChallengeSudoMode: (signInWithGoogle: () => void) => void
}
export const _GoogleSignInForm: FunctionComponent<GoogleSignInFormProps> = ({
  classes,
  isTermsAndConditionsAccepted,
  isTermsAndConditionsRequired,
  isGoogleSignInFormTriggered,
  signInWithGoogleChallengeSudoMode,
}) => {
  const shouldEnableGoogleSignInButton = !isTermsAndConditionsRequired || isTermsAndConditionsAccepted
  const shouldDisableGoogleSignInButton = isTermsAndConditionsRequired && !isTermsAndConditionsAccepted

  const hiddenFormRef = useRef<HTMLFormElement>(null)

  const handleHiddenFormSubmit = useCallback(() => {
    if (hiddenFormRef.current) {
      const signInWithGoogle = hiddenFormRef.current.submit.bind(hiddenFormRef.current)
      signInWithGoogleChallengeSudoMode(signInWithGoogle)
    }
  }, [signInWithGoogleChallengeSudoMode])

  useEffect(() => {
    if (isGoogleSignInFormTriggered) {
      handleHiddenFormSubmit()
    }
  }, [isGoogleSignInFormTriggered, handleHiddenFormSubmit])

  return (
    <>
      <GoogleHiddenSignInForm
        isTermsAndConditionsAccepted={isTermsAndConditionsAccepted}
        isTermsAndConditionsRequired={isTermsAndConditionsRequired}
        ref={hiddenFormRef}
      />
      <button
        className={classNames(classes.googleSigninButton, {
          [classes.googleSigninButtonEnabled]: shouldEnableGoogleSignInButton,
          [classes.googleSigninButtonDisabled]: shouldDisableGoogleSignInButton,
        })}
        onClick={handleHiddenFormSubmit}
        disabled={shouldDisableGoogleSignInButton}
      />
    </>
  )
}

export const GoogleSignInForm = withStyles(styles)(_GoogleSignInForm)
