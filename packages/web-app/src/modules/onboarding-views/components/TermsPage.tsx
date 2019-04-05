import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import image from '../assets/Home - How it Works.svg'
import { OnboardingPage } from '../../../components'
import { Form, Field } from 'react-final-form'
import { Checkbox, Scrollbar } from '../../../components'
import ReactMarkdown from 'react-markdown'
import { terms } from '../assets/terms'

const styles = (theme: SaladTheme) => ({
  textContainer: {
    color: theme.lightGreen,
    fontFamily: 'sharpGroteskLight25',
    fontSize: theme.small,
    padding: '0 5rem',
  },
})

interface Props extends WithStyles<typeof styles> {
  onAgree?: () => void
  submitting?: boolean
}

interface FormFields {
  termsOfService?: boolean
  ageRequirement?: boolean
}

interface FormErrors {
  termsOfService?: string
  ageRequirement?: string
}

class _TermsPage extends Component<Props> {
  submit: any

  onSubmit = (values: {}) => {
    const { onAgree } = this.props
    let v = values as FormFields
    if (onAgree && v.ageRequirement && v.termsOfService) onAgree()
  }

  validate = (values: {}) => {
    let v = values as FormFields
    const errors: FormErrors = {}
    if (!v.ageRequirement) {
      errors.ageRequirement = 'Required'
    }
    if (!v.termsOfService) {
      errors.termsOfService = 'Required'
    }
    return errors
  }

  render() {
    const { submitting, classes } = this.props
    return (
      <OnboardingPage
        title={'A couple boxes to check'}
        subtitle={`Before you can get Salad running, we need you to confirm that you agree to some terms. Typical stuff.`}
        image={image}
        nextSubmitting={submitting}
        rightContent={
          <Scrollbar>
            <ReactMarkdown className={classes.textContainer} source={terms} />
          </Scrollbar>
        }
        nextText={'Agree'}
        onNext={() => this.submit()}
      >
        <Form
          onSubmit={this.onSubmit}
          validate={this.validate}
          render={({ handleSubmit, submitting }) => {
            this.submit = handleSubmit
            return (
              <form onSubmit={handleSubmit}>
                <Field name="ageRequirement" type="checkbox">
                  {({ input, meta }) => (
                    <Checkbox
                      {...input}
                      text="I am at least 13 years old"
                      errorText={meta.error && meta.touched && meta.error}
                    />
                  )}
                </Field>
                <Field name="termsOfService" type="checkbox">
                  {({ input, meta }) => (
                    <Checkbox
                      {...input}
                      text="I agree to the Salad Terms & Conditions"
                      errorText={meta.error && meta.touched && meta.error}
                    />
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

export const TermsPage = withStyles(styles)(_TermsPage)
