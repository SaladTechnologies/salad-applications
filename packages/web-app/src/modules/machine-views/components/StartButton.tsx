import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { AngledPanel } from '../../../components'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  container: {
    height: '107px',
    width: '350px',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.appBackgroundColor,
    borderColor: theme.lightGreen,
    borderWidth: '1px',
    borderTopStyle: 'solid',
    borderBottomStyle: 'solid',
    whiteSpace: 'noWrap',
    position: 'relative',
    userSelect: 'none',
  },
  button: {
    backgroundColor: theme.lightGreen,
    height: '107px',
    width: '147px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 100,
    '&:hover': {
      opacity: 0.9,
    },
  },
  disabledButton: {
    cursor: 'not-allowed',
  },
  buttonText: {
    color: theme.appBackgroundColor,
    textAlign: 'center',
    fontSize: theme.small,
    fontFamily: 'sharpGroteskMedium25',
    textTransform: 'uppercase',
  },
  textContainer: {
    display: 'flex',
    textAlign: 'right',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: '.5rem 1rem',
    whiteSpace: 'noWrap',
    color: theme.offWhite,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 50,
  },
  title: {
    fontFamily: 'SharpGroteskLight25',
    fontSize: theme.small,
    textTransform: 'uppercase',
  },
  balanceText: {
    fontFamily: 'SharpGroteskLight09',
    color: theme.lightGreen,
    fontSize: theme.xLarge,
    marginTop: '-.25rem',
    marginBottom: '-.5rem',
  },
  rateText: {
    fontFamily: 'sharpGroteskBook25',
    fontSize: theme.small,
  },
})

interface Props extends WithStyles<typeof styles> {
  balance?: number
  rate?: number
  isRunning?: boolean
  onClick?: () => void
  startEnabled?: boolean
}

class _StartButton extends Component<Props> {
  handleClick = () => {
    const { onClick, startEnabled } = this.props

    if (onClick && startEnabled) onClick()
  }
  render() {
    const { balance, rate, isRunning, startEnabled, classes } = this.props
    return (
      <AngledPanel leftSide="left" className={classnames(classes.container)}>
        <AngledPanel
          leftSide="left"
          rightSide="left"
          className={classnames(classes.button, { [classes.disabledButton]: !startEnabled })}
          onClick={this.handleClick}
        >
          <div className={classes.buttonText}>{isRunning ? 'Stop' : 'Start'}</div>
        </AngledPanel>
        <div className={classes.textContainer}>
          <div className={classes.title}>Current balance</div>
          <div className={classes.balanceText}>${balance ? balance.toFixed(5) : 0} USD</div>
          <div className={classes.rateText}>${rate ? rate.toFixed(5) : 0}/HOUR</div>
        </div>
      </AngledPanel>
    )
  }
}

export const StartButton = withStyles(styles)(_StartButton)
