import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { AngledPanel, Tooltip } from '../../../components'
import classnames from 'classnames'
// @ts-ignore
import ReactHintFactory from 'react-hint'
const ReactHint = ReactHintFactory(React)

const styles = (theme: SaladTheme) => ({
  container: {
    height: '107px',
    width: '350px',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.darkBlue,
    borderColor: theme.green,
    borderWidth: '1px',
    borderTopStyle: 'solid',
    borderBottomStyle: 'solid',
    whiteSpace: 'noWrap',
    position: 'relative',
    userSelect: 'none',
  },
  button: {
    backgroundColor: theme.green,
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
    color: theme.darkBlue,
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
    color: theme.lightGreen,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 50,
  },
  infoCorner: {
    position: 'absolute',
    top: 0,
    left: 2,
    backgroundColor: '#F6931D',
    height: '25px',
    width: '29.17px',
    clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
    textAlign: 'center',
  },
  title: {
    fontFamily: 'SharpGroteskLight25',
    fontSize: theme.small,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  balanceText: {
    fontFamily: 'SharpGroteskLight09',
    color: theme.green,
    fontSize: theme.xLarge,
    marginTop: '-.25rem',
    marginBottom: '-.5rem',
  },
  rateText: {
    fontFamily: 'sharpGroteskBook25',
    fontSize: theme.small,
    letterSpacing: '1px',
  },
  disableRateText: {
    color: '#F6931D',
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
      <>
        <ReactHint
          autoPosition
          events
          onRenderContent={() => (
            <div>
              <Tooltip
                title="Incompatible Machine"
                text="Looks like you're machine doesn't like Salad.
                 Please check your GPU and Windows version to ensure they
                  are compatible with Salad."
              />
            </div>
          )}
        />
        <AngledPanel leftSide="left" className={classnames(classes.container)}>
          <AngledPanel
            leftSide="left"
            rightSide="left"
            className={classnames(classes.button, { [classes.disabledButton]: !startEnabled })}
            onClick={this.handleClick}
          >
            {!startEnabled && (
              <div className={classes.infoCorner} data-rh="tooltip 1">
                !!
              </div>
            )}
            <div className={classes.buttonText}>{isRunning ? 'Stop' : 'Start'}</div>
          </AngledPanel>
          <div className={classes.textContainer}>
            <div className={classes.title}>Current balance</div>
            <div className={classes.balanceText}>${balance ? balance.toFixed(5) : 0} USD</div>
            <div className={classnames(classes.rateText, { [classes.disableRateText]: !startEnabled })}>
              ${rate ? rate.toFixed(5) : '0.00000'}/HOUR
            </div>
          </div>
        </AngledPanel>
      </>
    )
  }
}

export const StartButton = withStyles(styles)(_StartButton)
