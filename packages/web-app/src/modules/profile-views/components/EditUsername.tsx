import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { Form, Field } from 'react-final-form'
import { TextField, Button, CondensedHeader, Username, AppBody, Divider } from '../../../components'
import { Profile } from '../../profile/models'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

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
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 0',
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
})

interface Props extends WithStyles<typeof styles> {
  profile?: Profile
  sending?: boolean
  onSend?: (username: string) => void
  onLogout?: () => void
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
  handleLogout = () => {
    const { onLogout } = this.props

    if (onLogout) onLogout()
  }

  render() {
    const { sending, classes, profile } = this.props

    return (
      <>
        <CondensedHeader>Account</CondensedHeader>
        <Divider />
        <Username blue>Display Name:</Username>
        {!this.state.isEdit && profile && (
          <div className={classes.row}>
            <p>
              <Username blue>{profile.username}</Username>
            </p>
            <div
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
          <>
            <p>
              <Form
                onSubmit={this.onSubmit}
                validate={this.validate}
                render={({ handleSubmit }) => {
                  return (
                    <form onSubmit={handleSubmit}>
                      <Field name="username" type="text">
                        {({ input, meta }) => (
                          <div className={classes.container}>
                            <TextField
                              className={classes.input}
                              {...input}
                              dark
                              placeholder={profile && profile.username}
                              errorText={meta.error && meta.touched && meta.error}
                            />
                            <Button type="submit" dark loading={sending} disabled={sending}>
                              UPDATE
                            </Button>
                          </div>
                        )}
                      </Field>
                    </form>
                  )
                }}
              />
            </p>
            <ul>
              <li>
                <AppBody>2-32 characters</AppBody>
              </li>
              <li>
                <AppBody>Numbers and letters only</AppBody>
              </li>
              <li>
                <AppBody>No whitespace</AppBody>
              </li>
            </ul>
          </>
        )}
        <div className={classes.logoutButton} onClick={this.handleLogout}>
          LOG OUT
        </div>
      </>
    )
  }
}
export const EditUsername = withStyles(styles)(_EditUsername)
