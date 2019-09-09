import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../../SaladTheme'
import { Form, Field } from 'react-final-form'
import { TextField, Button, ErrorText } from '../../../../components'

const styles = (theme: SaladTheme) => ({
  container: {
    color: theme.darkBlue,
    userSelect: 'none',
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  input: {
    marginTop: 5,
    width: 300,
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

  validate = (values: {}) => {
    let v = values as FormTypes

    const errors: FormTypes = {}
    if (v.code === undefined || v.code.length === 0) {
      errors.code = 'Required'
    } else if (/\s/g.test(v.code)) {
      errors.code = 'Whitespace not allowed'
    } else if (v.code.length > 10) {
      errors.code = 'Code is too long'
    }
    return errors
  }

  render() {
    const { dark, classes } = this.props
    const { submitting, errorMessage } = this.state

    return (
      <Form
        onSubmit={this.onSubmit}
        validate={this.validate}
        render={({ handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Field name="code">
                {({ input, meta }) => (
                  <div className={classes.container}>
                    <TextField
                      className={classes.input}
                      {...input}
                      dark={dark}
                      placeholder="Code"
                      errorText={meta.error && meta.touched && meta.error}
                    />
                    <Button type="submit" dark={dark} loading={submitting} disabled={submitting}>
                      SUBMIT
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
