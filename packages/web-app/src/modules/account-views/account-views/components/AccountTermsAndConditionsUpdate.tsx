import { FC } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Button, Checkbox, GlassBox, Text } from '@saladtechnologies/garden-components'
import { SaladTheme } from '../../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  link: {
    textDecoration: 'underline',
    color: theme.darkBlue,
    cursor: 'pointer',
  },
  mb48: {
    marginBottom: 25,
  },
  my48: {
    margin: '48px 0',
  },
})

interface Props extends WithStyles<typeof styles> {
  isSubmitting: boolean
  acceptedTermsAndConditions: boolean
  onToggleAcceptTermsAndConditions: (accepted: boolean) => void
  onSubmitTermsAndConditions: () => void
}

const _AccountTermsAndConditionsUpdate: FC<Props> = ({
  classes,
  isSubmitting,
  acceptedTermsAndConditions,
  onSubmitTermsAndConditions,
  onToggleAcceptTermsAndConditions,
}) => (
  <div className={classes.mb48}>
    <GlassBox removeMaxWidth>
      <Text variant="baseL">
        We’ve updated our{' '}
        <a
          className={classes.link}
          href="https://salad.com/terms-and-conditions"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms and Conditions,
        </a>{' '}
        please review them and then accept them below.
      </Text>

      <div className={classes.my48}>
        <Checkbox onChange={onToggleAcceptTermsAndConditions} checked={acceptedTermsAndConditions}>
          <Text variant="baseM">I agree to the Terms of Service and Privacy Policy</Text>
        </Checkbox>
      </div>
      <Button
        variant="primary-basic"
        label="Continue"
        onClick={onSubmitTermsAndConditions}
        disabled={!acceptedTermsAndConditions}
        isLoading={isSubmitting}
      />
    </GlassBox>
  </div>
)

export const AccountTermsAndConditionsUpdate = withStyles(styles)(_AccountTermsAndConditionsUpdate)
