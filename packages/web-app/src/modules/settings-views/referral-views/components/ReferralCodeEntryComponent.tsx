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
  submitting?: boolean
  onSubmitCode?: (code: string) => void
  errorMessage?: string
}

interface FormTypes {
  code?: string
}

class _ReferralCodeEntryComponent extends Component<Props> {
  onSubmit = (values: {}) => {
    const { onSubmitCode } = this.props
    let v = values as FormTypes
    if (onSubmitCode && v.code) onSubmitCode(v.code)
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
    const { errorMessage, submitting, classes } = this.props

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
                      dark
                      placeholder="Code"
                      errorText={meta.error && meta.touched && meta.error}
                    />
                    <Button type="submit" dark loading={submitting} disabled={submitting}>
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
