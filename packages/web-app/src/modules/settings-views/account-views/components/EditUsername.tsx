import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../../SaladTheme'
import { Form, Field } from 'react-final-form'
import { TextField, Button, Username, ComputerName, P } from '../../../../components'
import { Profile } from '../../../profile/models'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

const styles = (theme: SaladTheme) => ({
  input: {
    marginTop: 5,
    width: 300,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    // padding: '10px 0',
  },
  icon: {
    cursor: 'pointer',
    paddingLeft: 10,
  },
  logoutButton: {
    display: 'inline-block',
    padding: '.25rem 1rem',
    backgroundColor: theme.darkBlue,
    color: theme.green,
    marginLeft: '60rem',
    fontFamily: 'sharpGroteskLight25',
    fontSize: theme.small,
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
    },
    position: 'absolute',
    bottom: '25px',
  },
  editIcon: {
    marginTop: '-5px',
  },
  textFieldContainer: {
    position: 'relative',
    height: 60,
  },
  updateButton: {
    top: '-3px',
    padding: 6,
  },
})

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
      errors.username = 'Must be at least 2 characters!'
    }
    if (v.username === undefined || v.username.length === 0) {
      errors.username = 'Required!'
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
        <Username blue>Username</Username>
        <P>
          Spice up your Salad account with a unique, personalized username. This username is what we’ll refer to you as
          in reward emails and will be what your friends see when you refer them to Salad via email.
        </P>

        {!this.state.isEdit && profile && (
          <div className={classes.row}>
            <P>
              <ComputerName blue>{profile.username}</ComputerName>
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
            render={({ handleSubmit }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <Field name="username" type="text">
                    {({ input, meta }) => (
                      <div className={classes.textFieldContainer}>
                        <TextField
                          className={classes.input}
                          {...input}
                          dark
                          placeholder={profile && profile.username}
                          errorText={meta.error && meta.touched && meta.error}
                        />
                        <Button
                          type="submit"
                          className={classes.updateButton}
                          dark
                          uppercase
                          loading={sending}
                          disabled={sending}
                        >
                          Update
                        </Button>
                        <Button
                          onClick={() => this.setState({ isEdit: false })}
                          className={classes.updateButton}
                          dark
                          uppercase
                          loading={sending}
                          disabled={sending}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </Field>
                  <ul>
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
