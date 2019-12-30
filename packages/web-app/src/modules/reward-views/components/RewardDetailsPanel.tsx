import React, { Component, ReactNode } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { AngledPanel } from '../../../components'
import { Reward } from '../../reward/models/Reward'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    position: 'relative',
    width: '790px',
    userSelect: 'none',
  },
  lock: {
    position: 'absolute',
    right: '.5rem',
    top: '.5rem',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    },
  },
  imageContainer: {
    height: '12rem',
    display: 'inline-block',
    width: '290px',
    backgroundColor: (props: Props) => (props.reward && props.reward.color) || theme.green,
  },
  image: {
    height: '100%',
    width: 'auto',
  },
  rightContainer: {
    width: '37rem',
    padding: '.5rem',
    overflow: 'hidden',
    marginLeft: '.5rem',
    display: 'inline-flex',
    flexDirection: 'column',
    backgroundColor: (props: Props) => (props.reward && props.reward.redeemable ? theme.green : theme.darkGreen),
    color: (props: Props) => (props.reward && props.reward.redeemable ? theme.darkBlue : theme.green),
  },
  nameText: {
    fontSize: theme.xLarge,
    fontFamily: 'SharpGroteskLight09',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  details: {
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.small,
  },
  priceText: {
    fontSize: theme.medium,
    fontFamily: 'SharpGroteskLight25',
    whiteSpace: 'pre',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  outOfStock: {
    textTransform: 'uppercase',
    position: 'absolute',
    right: '35px',
    top: '9px',
    fontSize: theme.medium,
    whiteSpace: 'pre',
    fontFamily: theme.fontGroteskLight25,
    fontStyle: 'normal',
    lineHeight: '6px',
    padding: '5px',
    paddingLeft: '12.5px',
    verticalAlign: 'middle',
    textAlign: 'center',
    letterSpacing: '1.14px',
    color: theme.red,
  },
})

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
  onClickClose?: () => void
  children?: ReactNode
}

class _RewardDetailsPanel extends Component<Props> {
  timeRemainingText() {
    const { reward } = this.props

    if (reward === undefined) {
      return ''
    }

    if (reward.redeemable) {
      return '  |  Redeemable'
    }

    if (reward.remainingTimeLabel) {
      return `  |  ${reward.remainingTimeLabel}`
    }

    return ' '
  }

  handleClose = () => {
    const { onClickClose } = this.props

    if (onClickClose) {
      onClickClose()
    }
  }

  render() {
    const { reward, classes, children } = this.props

    return (
      <div className={classnames(classes.container)}>
        <AngledPanel className={classes.imageContainer} leftSide={'right'}>
          {reward && <img className={classes.image} src={reward.image} draggable={false} alt="" />}
        </AngledPanel>

        <div className={classnames(classes.rightContainer)}>
          <div style={{ flex: '1' }}>
            <div className={classes.lock} onClick={this.handleClose}>
              <FontAwesomeIcon icon={faTimes} />
            </div>

            <div className={classnames(classes.priceText)}>
              {reward && `$${reward.price.toFixed(2)} ${this.timeRemainingText()}`}
            </div>
            <div>
              <div className={classnames(classes.nameText)}>{reward ? reward.name : 'Unavailable'}</div>
              {reward && reward.quantity === 0 && <div className={classes.outOfStock}>OUT OF STOCK</div>}
              {reward && reward.quantity !== null && reward.quantity !== 0 && (
                <div className={classes.outOfStock}>{reward.quantity} REMAINING</div>
              )}
            </div>
            <div className={classnames(classes.details)}>{reward && reward.description}</div>
          </div>
          {children}
        </div>
      </div>
    )
  }
}

export const RewardDetailsPanel = withStyles(styles)(_RewardDetailsPanel)
