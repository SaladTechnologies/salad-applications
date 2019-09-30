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
    const { reward, onClickClose, openCanny } = this.props
    const { code } = this.state

    return (
      <ModalPage onCloseClicked={this.handleClose}>
        {!code && code !== '' && (
          <RewardDetailsPanel reward={reward} onClickClose={onClickClose}>
            <RedemptionDetails submitting={this.state.submitting} onSubmission={this.onSubmit} reward={reward} />
          </RewardDetailsPanel>
        )}
        {code ||
          (code === '' && (
            <RedemptionCompletePanel reward={reward} openCanny={openCanny} onClickClose={onClickClose}>

            </RedemptionCompletePanel>
          ))}
      </ModalPage>
    )
  }
}

export const RewardRedemptionModal = withStyles(styles)(_RewardRedemptionModal)
