import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'
import { Field, Form } from 'react-final-form'
import withStyles, { WithStyles } from 'react-jss'
import { Button, ComputerName, P, TextField, Username } from '../../../../components'
import { Profile } from '../../../profile/models'
// Styles
import { styles } from './EditUsername.styles'

interface Props extends WithStyles<typeof styles> {
  profile?: Profile
  sending?: boolean
  onSend?: (username: string) => void
}

interface FormTypes {
  username?: string
}

interface State {
  isEdit: boolean
}

class _EditUsername extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isEdit: false,
    }
  }

  onSubmit = async (values: {}) => {
    const { onSend } = this.props
    let v = values as FormTypes
    if (onSend && v.username) await onSend(v.username)
    this.setState({ isEdit: false })
  }

  validate = (values: {}) => {
    let v = values as FormTypes

    const errors: FormTypes = {}
    if (v.username && v.username.length < 2) {
      errors.username = 'Username must be at least 2 characters!'
    }
    if (v.username === undefined || v.username.length === 0) {
      errors.username = 'Username is required!'
    }
    if (v.username && v.username.length > 32) {
      errors.username = `Username can't be more than 32 characters!`
    }
    if (v.username && v.username.includes(' ')) {
      errors.username = `Username can't contain spaces!`
    }

    return errors
  }

  render() {
    const { sending, classes, profile } = this.props

    return (
      <>
        <Username>Username</Username>
        <P>
          Spice up your Salad account with a unique, personalized username. This username is what we’ll refer to you as
          in reward emails and will be what your friends see when you refer them to Salad via email.
        </P>

        {!this.state.isEdit && profile && (
          <div className={classes.row}>
            <P>
              <ComputerName>{profile.username}</ComputerName>
            </P>
            <div
              className={classes.editIcon}
              onClick={() => {
                if (!this.state.isEdit) {
                  this.setState({ isEdit: true })
                }
              }}
            >
              <FontAwesomeIcon size="sm" className={classes.icon} icon={faEdit} />
            </div>
          </div>
        )}
        {this.state.isEdit && (
          <Form
            onSubmit={this.onSubmit}
            validate={this.validate}
            render={({ form }) => {
              return (
                <form onSubmit={form.submit}>
                  <Field name="username" type="text">
                    {({ input, meta }) => (
                      <div className={classes.textFieldContainer}>
                        <TextField
                          className={classes.input}
                          {...input}
                          placeholder={profile && profile.username}
                          errorText={meta.error && meta.touched && meta.error}
                        />
                        <div className={classes.buttonContainer}>
                          <Button type="submit" uppercase loading={sending} disabled={sending}>
                            Update
                          </Button>
                          <Button
                            onClick={() => this.setState({ isEdit: false })}
                            uppercase
                            loading={sending}
                            disabled={sending}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </Field>
                  <ul className={classes.passwordRequirements}>
                    <li>
                      <P>2-32 characters</P>
                    </li>
                    <li>
                      <P>Numbers and letters only</P>
                    </li>
                    <li>
                      <P>No whitespace</P>
                    </li>
                  </ul>
                </form>
              )
            }}
          />
        )}
      </>
    )
  }
}

export const EditUsername = withStyles(styles)(_EditUsername)
