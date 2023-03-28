import { Button } from '@saladtechnologies/garden-components'
import classnames from 'classnames'
import type { ReactNode } from 'react'
import { Component } from 'react'
import { Img } from 'react-image'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import Skeleton from 'react-loading-skeleton'
import type { SaladTheme } from '../../../../SaladTheme'
import { DefaultTheme } from '../../../../SaladTheme'
import type { Reward } from '../../../reward/models'
import { RewardMissingImage } from '../RewardMissingImage'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: 180,
    cursor: 'pointer',
  },
  imageWrapper: {
    display: 'flex',
    position: 'relative',
    height: 241,
    width: '100%',
  },
  imageWrapperHovered: {
    background: 'linear-gradient(0deg, rgba(83, 166, 38, 0.2), rgba(83, 166, 38, 0.2))',
  },
  image: {
    zIndex: -1,
    height: '100%',
    width: '100%',
    boxSizing: 'border-box',
    border: '4px solid transparent',
    filter: 'drop-shadow(8px 14px 21px rgba(0, 0, 0, 0.45))',
  },
  imageHovered: {
    border: `4px solid ${theme.mediumGreen}`,
  },
  name: {
    color: theme.lightGreen,
    textAlign: 'left',
    fontFamily: theme.fontGroteskLight09,
    fontWeight: 300,
    fontSize: 48,
    lineHeight: '48px',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    marginTop: 32,
    marginBottom: 4,
  },
  nameHovered: {
    color: theme.mediumGreen,
  },
  price: {
    textAlign: 'left',
    color: theme.green,
    fontFamily: theme.fontGroteskBook25,
    fontWeight: 400,
    fontSize: 12,
    lineHeight: '18px',
    marginTop: 'auto',
  },
  buttonWrapper: {
    display: 'none',
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    margin: 'auto',
    width: 143,
  },
  buttonWrapperHovered: {
    display: 'block',
  },
})

interface Props extends WithStyles<typeof styles> {
  isSelected: boolean
  targetReward: Reward
  onSelectTargetRewardClick: (rewardId: string) => void
  onConfirmTargetRewardSelectionClick: (reward: Reward) => void
}

interface State {
  isHovered: boolean
}

class _TargetRewardItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isHovered: false,
    }
  }

  public override componentDidUpdate(prevProps: Props) {
    if (prevProps.isSelected && !this.props.isSelected) {
      this.setState({
        isHovered: false,
      })
    }
  }

  handleMouseEnter = () => {
    if (this.props.isSelected) {
      return
    }

    this.setState((state) => ({ isHovered: !state.isHovered }))
  }

  handleMouseLeave = () => {
    if (this.props.isSelected) {
      return
    }

    this.setState((state) => ({ isHovered: !state.isHovered }))
  }

  handleTargetRewardClick = () => {
    const { isSelected, targetReward, onSelectTargetRewardClick, onConfirmTargetRewardSelectionClick } = this.props

    if (isSelected) {
      return onConfirmTargetRewardSelectionClick(targetReward)
    }

    return onSelectTargetRewardClick(targetReward.id)
  }

  public override render(): ReactNode {
    const { targetReward, isSelected, classes } = this.props
    const { isHovered } = this.state

    const getButton = () => {
      if (isSelected) {
        return <Button variant="primary" label="Confirm" />
      }

      if (isHovered) {
        return <Button variant="secondary" outlineColor={DefaultTheme.mediumGreen} label="Target" />
      }

      return null
    }

    return (
      <div
        key={targetReward.id}
        onClick={this.handleTargetRewardClick}
        className={classes.container}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div
          className={classnames(classes.imageWrapper, {
            [classes.imageWrapperHovered]: this.state.isHovered,
          })}
        >
          <Img
            className={classnames(classes.image, {
              [classes.imageHovered]: this.state.isHovered,
            })}
            src={targetReward.coverImage || ''}
            draggable={false}
            alt={targetReward.name}
            loader={<Skeleton height={'100%'} />}
            unloader={<RewardMissingImage text={targetReward.name} />}
          />
          <div
            className={classnames(classes.buttonWrapper, {
              [classes.buttonWrapperHovered]: this.state.isHovered,
            })}
          >
            {getButton()}
          </div>
        </div>
        <div
          className={classnames(classes.name, {
            [classes.nameHovered]: this.state.isHovered,
          })}
        >
          {targetReward.name}
        </div>
        <div className={classes.price}>{targetReward.price.toFixed(2)}</div>
      </div>
    )
  }
}

export const TargetRewardItem = withStyles(styles)(_TargetRewardItem)
