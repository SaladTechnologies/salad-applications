import React, { Component } from 'react'
import { Reward } from '../../reward/models/Reward'
import { RewardSummary } from './RewardSummary'

interface Props {
  reward?: Reward
  onClick?: () => void
}

export class RewardListItem extends Component<Props> {
  render() {
    const { reward, onClick } = this.props

    if (reward === undefined) return null

    return (
      <RewardSummary
        name={reward.name}
        price={reward.price}
        redeemable={reward.redeemable}
        imageSrc={reward.imageSrc}
        onClick={onClick}
        timeRemaining={reward.remainingTimeLabel}
        color={reward.color}
      />
    )
  }
}
