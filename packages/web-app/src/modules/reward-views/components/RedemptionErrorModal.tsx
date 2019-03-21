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

class _RedemptionErrorModal extends Component<Props> {
  render() {
    const { onCloseClicked, classes } = this.props
    return (
      <ModalPage onCloseClicked={onCloseClicked}>
        <Modal onCloseClicked={onCloseClicked}>
          <div className={classes.contentContainer}>
            <div className={classes.title}>UH OH. SOMETHING WENT WRONG</div>
            <div className={classes.description}>
              Something went wrong with the creation or delivery of this reward... Don't worry, we're on it! An email
              has been sent to our support team and someone will be in touch with you soon. If you don't hear anything
              within the next 24 hours please contact Salad Support. Or if you're really pissed, get in touch with us
              straight away!
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

export const RedemptionErrorModal = withStyles(styles)(_RedemptionErrorModal)
