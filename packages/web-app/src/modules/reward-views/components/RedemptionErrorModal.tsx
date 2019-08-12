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
              Something went wrong with the redeeming the reward... Don't worry, we're on it! Please try again, if the
              issue persists please reach out to Salad Support.
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
