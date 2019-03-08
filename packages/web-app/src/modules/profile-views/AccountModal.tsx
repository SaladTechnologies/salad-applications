import React from 'react'
import { ModalPage } from '../../components'
import { AccountModalContainer } from './AccountModalContainer'
import { connect, MapStoreToProps } from '../../connect'

const mapStoreToProps: MapStoreToProps = store => ({
  visible: store.profile.isAccountModalVisible,
  content: <AccountModalContainer />,
  onCloseClicked: store.profile.hideAccountModal,
})

export const AccountModal = connect(
  mapStoreToProps,
  ModalPage,
)
