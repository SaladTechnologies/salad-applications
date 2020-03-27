import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Form, Field } from 'react-final-form'
import { TextField, Button, P } from '../../../../components'
import { isEmailFormat } from '../../../../utils'

const styles = ({
  container: {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: 300,
  },
  sendButton: {},
})

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
        render={({ handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit}>
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
                      dark
                      placeholder="Email Address"
                      errorText={meta.error && meta.touched && meta.error}
                    />
                    <Button
                      type="submit"
                      className={classes.sendButton}
                      dark
                      uppercase
                      loading={sending}
                      disabled={sending}
                    >
                      Send
                    </Button>
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
