import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { Form, Field } from 'react-final-form'
import { TextField, Button, AppBody, CondensedHeader, Username } from '../../../components'
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
    
  }
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
    if (v.username === undefined || v.username.length > 32) {
      errors.username = `Username can't be more than 32 characters!`
    }

    return errors
  }

  render() {
    const { sending, classes, profile } = this.props

    return (
      <>
        <CondensedHeader>Display Name:</CondensedHeader>
        {!this.state.isEdit && profile && (
          <div className={classes.row}>
            <Username blue >{profile.username}</Username>
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
        )}
      </>
    )
  }
}
export const EditUsername = withStyles(styles)(_EditUsername)
