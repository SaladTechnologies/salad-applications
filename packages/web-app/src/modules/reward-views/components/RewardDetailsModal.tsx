import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { ModalPage, Button } from '../../../components'
import { Reward } from '../../reward/models/Reward'
import { RewardDetailsPanel } from './RewardDetailsPanel'

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
})

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
  onClickClose?: () => void
  onRedeem?: (rewardId: string) => void
  onSelect?: (rewardId: string) => void
  isSelecting?: boolean
}

class _RewardDetailsModal extends Component<Props> {
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

  handleRedeem = () => {
    const { onRedeem, reward } = this.props

    if (onRedeem && reward) {
      onRedeem(reward.id)
    }
  }

  handleSelect = () => {
    const { onSelect, reward } = this.props

    if (onSelect && reward) {
      onSelect(reward.id)
    }
  }

  render() {
    const { reward, onClickClose, classes } = this.props

    return (
      <ModalPage onCloseClicked={this.handleClose}>
        <RewardDetailsPanel reward={reward} onClickClose={onClickClose}>
          <div className={classes.buttonContainer}>
            {reward && reward.redeemable && (
              <Button disabled={reward.quantity === 0} dark onClick={this.handleRedeem}>
                REDEEM
              </Button>
            )}
            <Button dark={reward && reward.redeemable} onClick={this.handleSelect}>
              SELECT AS REWARD
            </Button>
          </div>
        </RewardDetailsPanel>
      </ModalPage>
    )
  }
}

export const RewardDetailsModal = withStyles(styles)(_RewardDetailsModal)
