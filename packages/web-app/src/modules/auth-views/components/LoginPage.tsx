import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Button, Overlay, Portal, TextField } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    backgroundColor: theme.darkBlue,
    color: 'white',
    left: '50%',
    maxHeight: 462,
    minHeight: 100,
    padding: '5px 30px 30px 30px',
    position: 'absolute',
    top: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    width: 516,
    // TODO: Remove z-indexes!!!
    zIndex: 9999999999,
  },
})

interface LoginPageProps extends WithStyles<typeof styles> {
  onCancel: () => void
  onSubmit: () => void
}

export const LoginPage = withStyles(styles)(
  class LoginPage extends Component<LoginPageProps> {
    render() {
      // TODO: Load the Auth0 login page in an `iframe`.
      return (
        <Portal>
          <Overlay onCloseRequested={this.props.onCancel} />
          <div className={this.props.classes.container}>
            <h1>Login</h1>
            <p>Email Address:</p>
            <p>
              <TextField name="username" />
            </p>
            <p>Password:</p>
            <p>
              <TextField name="password" />
            </p>
            <Button onClick={this.props.onSubmit}>Login</Button>
          </div>
        </Portal>
      )
    }
  },
)
