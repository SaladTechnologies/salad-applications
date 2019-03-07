import React from 'react'
import { ModalPage } from '../../components/ModalPage'
import { RewardDetailsContainer } from './RewardDetailsContainer'
import { connect, MapStoreToProps } from '../../connect'

const mapStoreToProps: MapStoreToProps = store => ({
  visible: store.rewards.currentRewardDetails !== undefined,
  content: <RewardDetailsContainer />,
  onCloseClicked: store.rewards.hideDetailModal,
})

export const RewardModal = connect(
  mapStoreToProps,
  ModalPage,
)
