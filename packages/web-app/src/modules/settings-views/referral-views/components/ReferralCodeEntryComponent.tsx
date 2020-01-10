import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../../SaladTheme'
import { Form, Field } from 'react-final-form'
import { TextField, Button, ErrorText } from '../../../../components'

const styles = (theme: SaladTheme) => ({
  container: {
    userSelect: 'none',
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  input: {
    marginTop: 5,
    width: 300,
  },

  submitButton: {
    margin: '5px 0 0 5px',
    padding: 6,
  },
})

interface Props extends WithStyles<typeof styles> {
  onSubmitCode?: (code: string) => Promise<void>
  dark?: boolean
}

interface State {
  submitting: boolean
  errorMessage?: string
}

interface FormTypes {
  code?: string
}

class _ReferralCodeEntryComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      submitting: false,
    }
  }

  onSubmit = async (values: {}) => {
    const { onSubmitCode } = this.props
    let v = values as FormTypes
    this.setState({errorMessage:undefined})
    this.validate(v.code)
      if (this.state.errorMessage) return
    if (onSubmitCode && v.code) {
      this.setState({ submitting: true, errorMessage: undefined })
      try {
        await onSubmitCode(v.code)
        this.setState({ submitting: false })
      } catch (e) {
        if (e instanceof Error) {
          this.setState({ submitting: false, errorMessage: e.message })
        }
      }
    }
  }

  validate = (code: string|undefined) => {
    if (code === undefined || code.length === 0) {
      this.setState({errorMessage:'Required'})
    } else if (/\s/g.test(code)) {
      this.setState({errorMessage:'Whitespace not allowed'})
    } else if (code.length > 10) {
      this.setState({errorMessage:'Code is too long'})
    }
  }

  render() {
    const { classes, dark } = this.props
    const { submitting, errorMessage } = this.state

    return (
      <Form
        onSubmit={this.onSubmit}
        render={({ handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Field name="code">
                {({ input, meta }) => (
                  <div className={classes.container}>
                    <TextField
                      className={classes.input}
                      {...input}
                      dark= {dark}
                      placeholder="Code"
                      errorText={meta.error && meta.touched && meta.error}
                    />
                    <Button
                      type="submit"
                      uppercase
                      dark= {dark}
                      loading={submitting}
                      disabled={submitting}
                      className={classes.submitButton}
                    >
                      Submit
                    </Button>
                  </div>
                )}
              </Field>
              {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
            </form>
          )
        }}
      />
    )
  }
}

export const ReferralCodeEntryComponent = withStyles(styles)(_ReferralCodeEntryComponent)
