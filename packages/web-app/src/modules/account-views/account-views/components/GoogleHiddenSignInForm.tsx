import { forwardRef } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { config } from '../../../../config'

const styles = {
  hiddenFormContainer: {
    width: 0,
    height: 0,
    visibility: 'hidden',
  },
}

export interface GoogleHiddenSignInFormProps extends WithStyles<typeof styles> {
  isTermsAndConditionsAccepted: boolean
  isTermsAndConditionsRequired: boolean
}

const _GoogleHiddenSignInForm = forwardRef<HTMLFormElement, GoogleHiddenSignInFormProps>(
  ({ classes, isTermsAndConditionsAccepted, isTermsAndConditionsRequired }, ref) => (
    <>
      <form
        className={classes.hiddenFormContainer}
        action={`${config.apiBaseUrl}/api/v2/authentication/external/account`}
        ref={ref}
        method="POST"
      >
        <input type="hidden" name="provider" value="google" />
        {isTermsAndConditionsRequired && (
          <input type="hidden" name="termsAccepted" value={`${isTermsAndConditionsAccepted}`} />
        )}
      </form>
    </>
  ),
)

export const GoogleHiddenSignInForm = withStyles(styles)(_GoogleHiddenSignInForm)
