import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Modal, ModalPage } from '../../../components'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  container: {
    color: theme.darkBlue,
    // textAlign: 'center',
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.small,
    padding: '2rem',
  },
  title: {
    fontFamily: 'SharpGroteskLight09',
    fontSize: theme.xLarge,
    marginTop: '2rem',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  description: {
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.small,
  },

  detailButton: {
    color: theme.darkBlue,
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.small,
    textDecoration: 'none',
    cursor: 'not-allowed',
    padding: '1rem 0',
  },
  lineBreak: {
    borderBottom: `solid 0.5px ${theme.darkBlue}`,
  },
  bugButton: {
    display: 'inline-block',
    padding: '.25rem 1rem',
    backgroundColor: theme.darkBlue,
    color: theme.green,
    marginLeft: '1rem',
    fontFamily: 'sharpGroteskLight25',
    fontSize: theme.small,
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  onCloseClicked?: () => void
  onSendBug?: () => void
}

class _SettingsModalPage extends Component<Props> {
  handleBugClicked = () => {
    const { onSendBug } = this.props

    if (onSendBug) onSendBug()
  }
  render() {
    const { onCloseClicked, classes } = this.props
    return (
      <ModalPage onCloseClicked={onCloseClicked}>
        <Modal onCloseClicked={onCloseClicked}>
          <div className={classes.container}>
            <div>SETTINGS (COMING SOON!)</div>
            <br />
            <div className={classnames(classes.lineBreak)}>
              <NavLink
                className={classnames(classes.detailButton)}
                onClick={onCloseClicked}
                to={'/smart-start'}
                style={{ display: 'inline-block', cursor: 'pointer' }}
              >
                <b>Smart Start: </b>
                Smartypants Salad will start chopping whenever you’re not using the computer, and automatically stop when
                you are. Open on boot up, and Salad will launch after booting up your computer.
              </NavLink>
            </div>

            {/* <div className={classnames(classes.lineBreak, classes.detailButton)} style={{ cursor: 'pointer' }} onClick={onCloseClicked}>
              <b>Smart Start: </b>
              Smartypants Salad will start chopping whenever you’re not using the computer, and automatically stop when
              you are. Open on boot up, and Salad will launch after booting up your computer.
            </div> */}
            <div className={classnames(classes.lineBreak, classes.detailButton)}>
              <b>Battery Saver: </b>Salad won’t chop if your laptop isn’t connected to a power source.
            </div>
            <div className={classes.detailButton}>
              <b>Desktop Notifications: </b>In case there’s some Salad Fixins’ we’ve got to tell you about.
            </div>
          </div>
          <div>
            <div className={classes.bugButton} onClick={this.handleBugClicked}>
              Send Bug
            </div>
          </div>
        </Modal>
      </ModalPage>
    )
  }
}

export const SettingsModalPage = withStyles(styles)(_SettingsModalPage)
