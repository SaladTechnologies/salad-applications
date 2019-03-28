import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Modal, ModalPage } from '../../../components'

const styles = (theme: SaladTheme) => ({
  container: {
    textAlign: 'left',
    padding: '1rem',
  },
  subTitle: {
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.small,
  },
  title: {
    fontFamily: 'SharpGroteskLight09',
    fontSize: theme.xLarge,
  },
  description: {
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.small,
  },
})

interface Props extends WithStyles<typeof styles> {
  isOnline?: boolean
}

class _OfflineModal extends Component<Props> {
  render() {
    const { isOnline, classes } = this.props
    if (isOnline) {
      return null
    } else {
      return (
        <ModalPage>
          <Modal>
            <div className={classes.container}>
              <div className={classes.subTitle}>Uh, Oh.</div>
              <div className={classes.title}>OOPS! LOOKS LIKE YOU'RE NOT CONNECTED</div>
              <div className={classes.description}>
                Check your connection to get reconnected and start chopping again.
              </div>
            </div>
          </Modal>
        </ModalPage>
      )
    }
  }
}

export const OfflineModal = withStyles(styles)(_OfflineModal)
