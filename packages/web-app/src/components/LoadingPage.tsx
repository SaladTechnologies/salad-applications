import classNames from 'classnames'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../SaladTheme'
import logo from './assets/animated-logo-lg.gif'

const styles = (theme: SaladTheme) => ({
  container: {
    backgroundColor: theme.darkBlue,
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
    textAlign: 'center',
    color: theme.lightGreen,
    fontSize: theme.large,
    fontFamily: theme.fontGroteskLight25,
  },
})

interface Props extends WithStyles<typeof styles> {
  text?: string
  onDidMount?: Promise<void>
  children?: ReactNode
}

class _LoadingPage extends Component<Props> {
  public override async componentDidMount() {
    const { onDidMount } = this.props

    if (onDidMount) {
      return onDidMount
    }
  }

  public override render(): ReactNode {
    const { text, classes, children } = this.props
    return (
      <div className={classes.container}>
        <img className={classes.logo} src={logo} alt="" />
        <div className={classNames(classes.text)}>
          <p>{text === undefined ? 'Loading...' : text}</p>
          {children}
        </div>
      </div>
    )
  }
}

export const LoadingPage = withStyles(styles)(_LoadingPage)
