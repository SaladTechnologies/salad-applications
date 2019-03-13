import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import image from '../assets/Home - How it Works.svg'
import { OnboardingPage } from './OnboardingPage'
import { Form, Field } from 'react-final-form'
import { Checkbox, Scrollbar } from '../../../components'
import ReactMarkdown from 'react-markdown'

const termsContent = require('../assets/terms.md')

const styles = (theme: SaladTheme) => ({
  textContainer: {
    color: theme.offWhite,
  },
})

interface Props extends WithStyles<typeof styles> {
  onAgree?: () => void
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
    const { classes } = this.props
    return (
      <OnboardingPage
        title={'Legal time!'}
        subtitle={'By agreeing to these terms you sign away your first born & 10% of all future income.'}
        image={image}
        rightContent={
          <Scrollbar>
            <ReactMarkdown className={classes.textContainer} source={termsContent} />
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
                      text="I am at least 18 years old"
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
