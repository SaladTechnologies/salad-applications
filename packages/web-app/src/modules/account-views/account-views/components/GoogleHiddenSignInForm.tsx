import type { RefObject } from 'react'
import { type FunctionComponent } from 'react'
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
  hiddenFormRef: RefObject<HTMLFormElement>
}
export const _GoogleHiddenSignInForm: FunctionComponent<GoogleHiddenSignInFormProps> = ({
  classes,
  isTermsAndConditionsAccepted,
  isTermsAndConditionsRequired,
  hiddenFormRef,
}) => (
  <>
    <form
      className={classes.hiddenFormContainer}
      action={`${config.apiBaseUrl}/api/v2/authentication/external/account`}
      ref={hiddenFormRef}
      method="POST"
    >
      <input type="hidden" name="provider" value="google" />
      {isTermsAndConditionsRequired && (
        <input type="hidden" name="termsAccepted" value={`${isTermsAndConditionsAccepted}`} />
      )}
    </form>
  </>
)

export const GoogleHiddenSignInForm = withStyles(styles)(_GoogleHiddenSignInForm)
