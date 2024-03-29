import classNames from 'classnames'
import type { ReactNode } from 'react'
import { Component } from 'react'
import { Img } from 'react-image'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import animatedLogo from '../assets/animated-logo-lg.gif'

const styles = (theme: SaladTheme) => ({
  button: {
    fontFamily: theme.fontGroteskBook25,
    fontSize: 12,
    border: `2px solid ${theme.mediumGreen}`,
    color: theme.darkBlue,
    textTransform: 'uppercase',
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 218,
    height: 70,
  },
  enabledButton: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.green,
    },
  },
  disabledButton: {
    cursor: 'not-allowed',
    color: 'darkGrey',
    borderColor: 'darkGrey',
  },
  loadingButton: {
    cursor: 'not-allowed',
  },
  animatedImage: {
    height: '60%',
  },
})

interface Props extends WithStyles<typeof styles> {
  enabled?: boolean
  loading?: boolean
  onClick?: () => void
}

class _SaladPayCheckoutButton extends Component<Props> {
  handleClick = () => {
    const { onClick, enabled, loading } = this.props

    if (onClick && enabled && !loading) {
      onClick()
    }
  }

  public override render(): ReactNode {
    const { classes, enabled, loading } = this.props

    return (
      <div
        className={classNames(classes.button, {
          [classes.enabledButton]: enabled && !loading,
          [classes.disabledButton]: !enabled,
          [classes.loadingButton]: loading,
        })}
        onClick={this.handleClick}
      >
        {!loading && <div>Pay With Salad</div>}
        {loading && <Img className={classes.animatedImage} src={animatedLogo} />}
      </div>
    )
  }
}

export const SaladPayCheckoutButton = withStyles(styles)(_SaladPayCheckoutButton)
