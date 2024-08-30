import type { AxiosResponse } from 'axios'
import classNames from 'classnames'
import { useCallback, useEffect, useRef, type FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { ChallengeSudoModeTrigger } from '../../../auth'
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
  challengeSudoMode: (challengeSudoModeTrigger: ChallengeSudoModeTrigger) => Promise<AxiosResponse<any> | null>
}
export const _GoogleSignInForm: FunctionComponent<GoogleSignInFormProps> = ({
  classes,
  isTermsAndConditionsAccepted,
  isTermsAndConditionsRequired,
  isGoogleSignInFormTriggered,
  challengeSudoMode,
}) => {
  const shouldEnableGoogleSignInButton = !isTermsAndConditionsRequired || isTermsAndConditionsAccepted
  const shouldDisableGoogleSignInButton = isTermsAndConditionsRequired && !isTermsAndConditionsAccepted

  const hiddenFormRef = useRef<HTMLFormElement>(null)

  const handleSignInWithGoogle = useCallback(async () => {
    try {
      const response = await challengeSudoMode(ChallengeSudoModeTrigger.GoogleSignIn)
      if (response) {
        hiddenFormRef.current?.submit()
      }
    } catch (error) {
      console.log('Please verify your credentials to proceed with this action.')
    }
  }, [challengeSudoMode])

  useEffect(() => {
    if (isGoogleSignInFormTriggered) {
      handleSignInWithGoogle()
    }
  }, [isGoogleSignInFormTriggered, handleSignInWithGoogle])

  return (
    <>
      <GoogleHiddenSignInForm
        isTermsAndConditionsAccepted={isTermsAndConditionsAccepted}
        isTermsAndConditionsRequired={isTermsAndConditionsRequired}
        hiddenFormRef={hiddenFormRef}
      />
      <button
        className={classNames(classes.googleSigninButton, {
          [classes.googleSigninButtonEnabled]: shouldEnableGoogleSignInButton,
          [classes.googleSigninButtonDisabled]: shouldDisableGoogleSignInButton,
        })}
        onClick={handleSignInWithGoogle}
        disabled={shouldDisableGoogleSignInButton}
      />
    </>
  )
}

export const GoogleSignInForm = withStyles(styles)(_GoogleSignInForm)
