import { Button, Layout, Text, TextField } from '@saladtechnologies/garden-components'
import { FormValues } from '@saladtechnologies/garden-components/lib/components/TextField/TextField'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Head } from '../../../components'
import { FormSteps } from '../../auth/AuthStore'

const styles = {
  page: {
    flex: 1,
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
  },
  content: {
    maxWidth: 392,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}

interface Props extends WithStyles<typeof styles> {
  currentStep?: FormSteps
  isSubmitting?: boolean
  errorMessage?: string
  onSubmitEmail?: (email: string) => void
  onSubmitCode?: (code: string) => void
  onBackToEmail?: () => void
}

export const LoginPage = withStyles(styles)(
  class LoginPage extends Component<Props> {
    handleSubmitEmail = (data: FormValues) => {
      const { onSubmitEmail } = this.props

      onSubmitEmail?.(data.input)
    }

    handleSubmitCode = (data: FormValues) => {
      const { onSubmitCode } = this.props

      onSubmitCode?.(data.input)
    }

    handleBackToEmail = () => {
      const { onBackToEmail } = this.props

      onBackToEmail?.()
    }

    render() {
      const { currentStep, isSubmitting, errorMessage, classes } = this.props
      console.log('Submitting:' + isSubmitting)
      return (
        <div className={classes.page}>
          <Layout>
            <Head title="Login" />
            <div className={classes.content}>
              {currentStep === FormSteps.Email && (
                <>
                  <Text variant="baseL">
                    You’re plugged into the world’s easiest and most trusted way to convert your idle computer into
                    sweet rewards!
                  </Text>

                  <TextField
                    label="Email"
                    errorMessage={'Invalid email'}
                    onSubmit={this.handleSubmitEmail}
                    validationRegex={
                      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
                    }
                  />
                  <Text variant="baseXS">
                    Enter your email to create a secure account. Already have an account, enter the same email address
                    to access your account.
                  </Text>
                  {errorMessage}
                </>
              )}
              {currentStep === FormSteps.Code && (
                <>
                  <TextField
                    label="/Code"
                    errorMessage={'Invalid code format'}
                    onSubmit={this.handleSubmitCode}
                    validationRegex={/^\d{4}$/}
                  />
                  {errorMessage}
                  <Button
                    label="Back"
                    type="button"
                    variant="primary"
                    isLoading={false}
                    onClick={this.handleBackToEmail}
                  />
                </>
              )}
            </div>
          </Layout>
        </div>
      )
    }
  },
)
