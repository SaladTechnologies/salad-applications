import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import image from '../assets/Referrals.svg'
import { OnboardingPage } from '../../../components'
import { Form, Field } from 'react-final-form'
import { Button } from '../../../components'
import { TextField } from '../../../components'

const styles = (theme: SaladTheme) => ({
  container: {},
})

interface Props extends WithStyles<typeof styles> {
  onNext?: () => void
  onSubmitCode?: (code: string) => void
  submitting?: boolean
}

interface FormTypes {
  code?: string
}

class _ReferralEntryPage extends Component<Props> {
  onSubmit = (values: {}) => {
    const { onSubmitCode } = this.props
    let v = values as FormTypes
    if (onSubmitCode && v.code) onSubmitCode(v.code)
  }

  validate = (values: {}) => {
    let v = values as FormTypes
    const errors: FormTypes = {}
    if (!v.code) {
      errors.code = 'Required'
    }
    //TODO: Check code length

    return errors
  }
  render() {
    const { submitting, onNext } = this.props
    return (
      <OnboardingPage
        title={'Referral Entry'}
        subtitle={'Referred by a friend? Enter your code below so you can both earn your referral bonus!'}
        image={image}
        nextText={'Skip'}
        nextSubmitting={submitting}
        onNext={onNext}
        fullHeightImg
      >
        <Form
          onSubmit={this.onSubmit}
          validate={this.validate}
          render={({ handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Field name="code">
                  {({ input, meta }) => (
                    <div style={{ display: 'inline-flex', alignItems: 'center', paddingTop: '1rem' }}>
                      <TextField
                        {...input}
                        placeholder="Referral code"
                        errorText={meta.error && meta.touched && meta.error}
                      />
                      <Button type="submit" loading={submitting} disabled={submitting}>
                        Submit
                      </Button>
                    </div>
                  )}
                </Field>
              </form>
            )
          }}
        />
      </OnboardingPage>
    )
  }
}

export const ReferralEntryPage = withStyles(styles)(_ReferralEntryPage)
