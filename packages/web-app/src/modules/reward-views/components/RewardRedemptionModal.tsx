import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { ModalPage } from '../../../components'
import { Reward } from '../../reward/models/Reward'
import { observer } from 'mobx-react'
import { RewardDetailsPanel } from './RewardDetailsPanel'
import { RedemptionDetails } from './RedemptionDetails'

const styles = (theme: SaladTheme) => ({})

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
  submitting?: boolean
  onClickClose?: () => void
  onClickDone?: () => void
  onRedeem?: (rewardId: string, email?: string) => void
}

interface FormTypes {
  email?: string
  gift?: boolean
}

@observer
class _RewardRedemptionModal extends Component<Props> {
  handleClose = () => {
    const { onClickClose } = this.props

    if (onClickClose) {
      onClickClose()
    }
  }

  handleDone = () => {
    const { onClickDone } = this.props

    if (onClickDone) {
      onClickDone()
    }
  }

  onSubmit = (values: {}) => {
    const { reward, onRedeem } = this.props
    let v = values as FormTypes
    if (reward && onRedeem) onRedeem(reward.id, v.gift ? v.email : undefined)
  }

  validate = (values: {}) => {
    let v = values as FormTypes
    const errors: FormTypes = {}
    if (v.gift) {
      if (v.email === undefined || v.email.length === 0) {
        errors.email = 'Required'
      } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v.email)) {
        errors.email = 'Invalid email'
      }
    }
    return errors
  }

  render() {
    const { reward, onClickClose } = this.props

    return (
      <ModalPage onCloseClicked={this.handleClose}>
        <RewardDetailsPanel reward={reward} onClickClose={onClickClose}>
          <RedemptionDetails onSubmission={this.onSubmit} reward={reward} />
        </RewardDetailsPanel>
      </ModalPage>
    )
  }
}

export const RewardRedemptionModal = withStyles(styles)(_RewardRedemptionModal)
