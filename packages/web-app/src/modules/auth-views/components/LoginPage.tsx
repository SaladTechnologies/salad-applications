import { FieldContainer, Layout, SvgIcon, Text, TextField } from '@saladtechnologies/garden-components'
import { FormValues } from '@saladtechnologies/garden-components/lib/components/TextField/TextField'
import { Key, Mail } from '@saladtechnologies/garden-icons'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Checkbox, Head } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { FormSteps } from '../../auth/AuthStore'
import SvgPrimaryLogoLockup from '../assets/SvgPrimaryLogoLockup'

const styles = (theme: SaladTheme) => ({
  page: {
    flex: 1,
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    position: 'relative',
    zIndex: 1,
  },
  content: {
    color: theme.darkBlue,
    maxWidth: 396,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  logoContainer: {
    paddingBottom: 50,
  },
  emailTextContainer: {
    paddingBottom: 57,
  },
  checkBoxContainer: {
    paddingBottom: 26,
    fontSize: 12,
    color: theme.lightGreen,
    '@media (min-width:500px)': {
      fontSize: 16,
    },
  },
  emailInputContainer: {
    paddingBottom: 40,
    textAlign: 'left',
  },
  codeContainer: {
    paddingTop: 57,
  },
  codeTextContainer: {
    paddingBottom: 14,
  },
  codeInputContainer: {
    textAlign: 'left',
    paddingBottom: 14,
  },
  link: {
    paddingBottom: 14,
    cursor: 'pointer',
  },
})

interface Props extends WithStyles<typeof styles> {
  currentStep?: FormSteps
  currentEmail?: string
  isSubmitting: boolean
  isSubmitSuccess: boolean
  acceptedTerms?: boolean
  errorMessage?: string
  onSubmitEmail?: (email: string) => void
  onSubmitCode?: (code: string) => void
  onBackToEmail?: () => void
  onCancelLogin?: () => void
  onToggleAccept?: (accepted: boolean) => void
  onResetSubmitSuccess?: () => void
  onUnmount: () => void
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

    handleResendCode = () => {
      const { currentEmail, onSubmitEmail } = this.props
      if (!currentEmail) return

      onSubmitEmail?.(currentEmail)
    }

    handleBackToEmail = () => {
      const { onBackToEmail } = this.props

      onBackToEmail?.()
    }

    handleCancelLogin = () => {
      const { onCancelLogin } = this.props

      onCancelLogin?.()
    }

    handleResetSubmitSuccess = () => {
      const { onResetSubmitSuccess, isSubmitSuccess } = this.props

      isSubmitSuccess && onResetSubmitSuccess?.()
    }

    componentWillUnmount() {
      const { onUnmount } = this.props
      onUnmount()
    }

    render() {
      const { currentStep, acceptedTerms, onToggleAccept, isSubmitting, currentEmail, errorMessage, classes } =
        this.props

      return (
        <div className={classes.page}>
          <Layout background="undefined">
            <Head title="Login" />
            <div className={classes.content}>
              {currentStep === FormSteps.Email && (
                <>
                  <div className={classes.logoContainer}>
                    <SvgPrimaryLogoLockup alt="Salad logo" width={208} height={100} />
                  </div>
                  <div className={classes.emailTextContainer}>
                    <Text variant="baseL">
                      You’re plugged into the world’s easiest and most trusted way to convert your idle computer into
                      sweet rewards!
                    </Text>
                  </div>
                  <div className={classes.checkBoxContainer}>
                    <Checkbox
                      text="I agree to the Terms of Service and Privacy Policy"
                      onClick={onToggleAccept}
                      checked={acceptedTerms}
                    />
                  </div>
                  <FieldContainer>
                    <div className={classes.emailInputContainer}>
                      <TextField
                        label="Email"
                        disabled={!acceptedTerms}
                        validationRegexErrorMessage={'Invalid email'}
                        serverSideErrorMessage={errorMessage}
                        onSubmit={this.handleSubmitEmail}
                        isSubmitting={isSubmitting}
                        isSubmitSuccess={false}
                        onFocus={this.handleResetSubmitSuccess}
                        validationRegex={
                          // the regex pattern below is the best pattern for recognizing emails(http://emailregex.com/) however, eslint's default settings flags control characters. We know for certain we want to use these control characters so we are ignoring this rule. (https://stackoverflow.com/questions/49743842/javascript-unexpected-control-characters-in-regular-expression)
                          // eslint-disable-next-line no-control-regex
                          /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
                        }
                        leadingIcon={
                          <SvgIcon size={'large'} stroke="dark">
                            <Mail />
                          </SvgIcon>
                        }
                      />
                    </div>
                  </FieldContainer>

                  <Text variant="baseXS">
                    Enter your email to create a secure account. Already have an account, enter the same email address
                    to access your account.
                  </Text>
                </>
              )}
              {currentStep === FormSteps.Code && (
                <div className={classes.codeContainer}>
                  <div className={classes.codeTextContainer}>
                    <Text variant="baseXL"> Enter the 4-Digit Code</Text>
                  </div>
                  <div className={classes.codeTextContainer}>
                    <Text variant="baseL">A verification code was sent to your email address {currentEmail}</Text>
                  </div>
                  <div className={classes.codeTextContainer}>
                    <span className={classes.link} onClick={this.handleResendCode}>
                      <Text variant="baseL">
                        <u> Send it Again?</u>
                      </Text>
                    </span>
                  </div>
                  <FieldContainer>
                    <div className={classes.codeInputContainer}>
                      <TextField
                        label="Code"
                        validationRegexErrorMessage={'Invalid code format'}
                        serverSideErrorMessage={errorMessage}
                        onSubmit={this.handleSubmitCode}
                        validationRegex={/^\d{4}$/}
                        isSubmitting={isSubmitting}
                        onFocus={this.handleResetSubmitSuccess}
                        isSubmitSuccess={false}
                        leadingIcon={
                          <SvgIcon size={'large'} stroke="dark">
                            <Key />
                          </SvgIcon>
                        }
                      />
                    </div>
                  </FieldContainer>
                  <div>
                    <span onClick={this.handleBackToEmail} className={classes.link}>
                      <Text variant="baseL">
                        <u> Enter the wrong email?</u>
                      </Text>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Layout>
        </div>
      )
    }
  },
)
