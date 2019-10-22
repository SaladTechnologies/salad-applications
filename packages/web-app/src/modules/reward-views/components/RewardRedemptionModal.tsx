import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { ModalPage } from '../../../components'
import { Reward } from '../../reward/models/Reward'
import { observer } from 'mobx-react'
import { RewardDetailsPanel } from './RewardDetailsPanel'
import { RedemptionDetails } from './RedemptionDetails'
import { ActionState, submitAction } from '../../../ActionHandler'
import { RedemptionCompletePanel } from './RedemptionCompletePanel'

const styles = (theme: SaladTheme) => ({})

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
  onClickClose?: () => void
  onClickDone?: () => void
  onRedeem?: (rewardId: string, email?: string) => any
  openCanny?: () => void
}

interface FormTypes {
  email?: string
  gift?: boolean
}

interface State extends ActionState {
  code?: string
}

@observer
class _RewardRedemptionModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      code: undefined,
      submitting: false,
    }
  }

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
    if (reward && onRedeem)
      submitAction(this, async () => {
        var _code = await onRedeem(reward.id, v.gift ? v.email : undefined)
        this.setState({ code: _code })
      })
  }

  render() {
    const { reward, onClickClose, openCanny } = this.props
    const { code, errorMessage, submitting } = this.state

    return (
      <ModalPage onCloseClicked={this.handleClose}>
        {!code && (
          <RewardDetailsPanel reward={reward} onClickClose={onClickClose}>
            <RedemptionDetails error={errorMessage} submitting={submitting} onSubmission={this.onSubmit} reward={reward} />
          </RewardDetailsPanel>
        )}
        {code ||
          (code === '' && (
            <RedemptionCompletePanel reward={reward} openCanny={openCanny} onClickClose={onClickClose} />
          ))}
      </ModalPage>
    )
  }
}

export const RewardRedemptionModal = withStyles(styles)(_RewardRedemptionModal)
