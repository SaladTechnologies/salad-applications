import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'
import { Field, Form } from 'react-final-form'
import withStyles, { WithStyles } from 'react-jss'
import { Button, ComputerName, P, TextField, Username } from '../../../../components'
import { styles } from './EditUsername.styles'

interface Props extends WithStyles<typeof styles> {
  username?: string
  isUpdating?: boolean
  onUpdate: (username: string) => void
}

interface FormTypes {
  username?: string
}

interface State {
  isEdit: boolean
}

class _MinecraftUsername extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isEdit: false,
    }
  }

  onSubmit = (values: {}) => {
    const { onUpdate } = this.props
    let v = values as FormTypes
    if (v.username) {
      onUpdate(v.username)
      this.setState({ isEdit: false })
    }
  }

  validate = (values: {}) => {
    let v = values as FormTypes
    const regex = /^\w{3,16}$/i

    const errors: FormTypes = {}
    if (v.username && regex.exec(v.username) === null) {
      errors.username = 'Not a valid Minecraft username!'
    }

    return errors
  }

  render() {
    const { isUpdating, classes, username } = this.props

    return (
      <div className={classes.container}>
        <Username>Minecraft Username</Username>
        <P>
          Connect your Salad account to your Minecraft account. A Minecraft username is required to purchase most
          Minecraft items
        </P>

        {username && !this.state.isEdit && (
          <div className={classes.row}>
            <P>
              <ComputerName>{username}</ComputerName>
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
        {(!username || this.state.isEdit) && (
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
                          placeholder={username}
                          errorText={meta.error && meta.touched && meta.error}
                        />
                        <div className={classes.buttonContainer}>
                          {username ? (
                            <>
                              <Button type="submit" uppercase loading={isUpdating} disabled={isUpdating}>
                                Update
                              </Button>
                              <Button
                                onClick={() => this.setState({ isEdit: false })}
                                uppercase
                                loading={isUpdating}
                                disabled={isUpdating}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Button type="submit" uppercase loading={isUpdating} disabled={isUpdating}>
                              Submit
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </Field>
                </form>
              )
            }}
          />
        )}
      </div>
    )
  }
}

export const MinecraftUsername = withStyles(styles)(_MinecraftUsername)
