import React, { Component } from 'react'
import { Field, Form } from 'react-final-form'
import withStyles, { WithStyles } from 'react-jss'
import { Button, P, TextField } from '../../../../components'
import { isEmailFormat } from '../../../../utils'

const styles = {
  container: {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  input: {
    width: 300,
    marginTop: 8,
  },
  buttonContainer: {
    display: 'flex',
    height: 47,
  },
}

interface Props extends WithStyles<typeof styles> {
  sending?: boolean
  onSend?: (email: string) => void
}

interface FormTypes {
  email?: string
}

class _SendReferral extends Component<Props> {
  onSubmit = (values: {}) => {
    const { onSend } = this.props
    let v = values as FormTypes
    if (onSend && v.email) onSend(v.email)
  }

  validate = (values: {}) => {
    let v = values as FormTypes

    const errors: FormTypes = {}
    if (v.email === undefined || v.email.length === 0) {
      errors.email = 'Required'
    } else if (!isEmailFormat(v.email)) {
      errors.email = 'Invalid email'
    }

    return errors
  }

  render() {
    const { sending, classes } = this.props

    return (
      <Form
        onSubmit={this.onSubmit}
        validate={this.validate}
        render={({ form }) => {
          return (
            <form onSubmit={form.submit}>
              <P>
                Salad will send an email to your friend that includes the referral code and a download link so they can
                join you in the kitchen.
              </P>
              <Field name="email" type="email">
                {({ input, meta }) => (
                  <div className={classes.container}>
                    <TextField
                      className={classes.input}
                      {...input}
                      placeholder="Email Address"
                      errorText={meta.error && meta.touched && meta.error}
                    />
                    <div className={classes.buttonContainer}>
                      <Button type="submit" uppercase loading={sending} disabled={sending}>
                        Send
                      </Button>
                    </div>
                  </div>
                )}
              </Field>
            </form>
          )
        }}
      />
    )
  }
}

export const SendReferral = withStyles(styles)(_SendReferral)
