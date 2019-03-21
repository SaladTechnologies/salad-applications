import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Modal, ModalPage, Button } from '../../../components'

const styles = (theme: SaladTheme) => ({
  contentContainer: {
    padding: '.5rem',
  },
  title: {
    fontFamily: 'SharpGroteskLight09',
    fontSize: theme.xLarge,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.small,
  },
})

interface Props extends WithStyles<typeof styles> {
  onCloseClicked?: () => void
}

class _RedemptionCompleteModal extends Component<Props> {
  render() {
    const { onCloseClicked, classes } = this.props
    return (
      <ModalPage onCloseClicked={onCloseClicked}>
        <Modal onCloseClicked={onCloseClicked}>
          <div className={classes.contentContainer}>
            <div className={classes.title}>WE WILL SEND YOU AN EMAIL WITHIN 24 HOURS WITH REDEMPTION INSTRUCTIONS</div>
            <div className={classes.description}>
              Were working on automating our redemption process, so for now we''re going to send you your reward
              manually via email which could take up to 24 hours. We promise this will be a 1-click job in the future!
              If you don''t see an email in your inbox within 24 hours, please check your Spam and Trash folders. If you
              still cannot find anything, we''re very sorry! Please Contact our Support Team via our Support chat or
              Discord channel.
            </div>
            <Button dark onClick={onCloseClicked}>
              Done
            </Button>
          </div>
        </Modal>
      </ModalPage>
    )
  }
}

export const RedemptionCompleteModal = withStyles(styles)(_RedemptionCompleteModal)
