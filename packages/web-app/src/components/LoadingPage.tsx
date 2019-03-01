import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'
import logo from './assets/animated-logo-lg.gif'
import classNames from 'classnames'

const styles = (theme: SaladTheme) => ({
  container: {
    backgroundColor: theme.appBackgroundColor,
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    overflow: 'hidden',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '10vw',
  },
  text: {
    padding: '1rem',
    color: theme.offWhite,
    fontSize: theme.large,
    fontFamily: 'SharpGroteskLight25',
  },
})

interface Props extends WithStyles<typeof styles> {
  text?: string
  onDidMount?: () => void
}

class _LoadingPage extends Component<Props> {
  componentDidMount() {
    const { onDidMount } = this.props

    if (onDidMount) {
      onDidMount()
    }
  }

  render() {
    const { text, classes } = this.props
    return (
      <div className={classes.container}>
        <div className={classes.logo}>
          <img src={logo} />
        </div>
        <div className={classNames(classes.text, 'has-text-centered')}>
          <p>{text === undefined ? 'Loading...' : text}</p>
        </div>
      </div>
    )
  }
}

export const LoadingPage = withStyles(styles)(_LoadingPage)
