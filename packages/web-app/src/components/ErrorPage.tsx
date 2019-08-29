import React, { Component, ReactNode } from 'react'
import { SaladTheme } from '../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Modal, ModalPage } from '.'

const styles = (theme: SaladTheme) => ({
  contentContainer: {
    color: theme.darkBlue,
    textAlign: 'center',
    padding: '0 4rem',
  },
  title: {
    fontFamily: 'SharpGroteskLight09',
    fontSize: theme.xLarge,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  description: {
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.small,
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
  title?: string
  children?: ReactNode
  onCloseClicked?: () => void
  showSendLog?: boolean
  onSendLog?: () => void
}

class _ErrorPage extends Component<Props> {
  state = {
    buttonToggle: false,
  }

  handleSendLogClicked = () => {
    const { onSendLog } = this.props

    this.setState({
      buttonToggle: !this.state.buttonToggle,
    })

    if (onSendLog) onSendLog()
  }

  render() {
    const { title, onCloseClicked, showSendLog, children, classes } = this.props

    return (
      <ModalPage onCloseClicked={onCloseClicked}>
        <Modal onCloseClicked={onCloseClicked}>
          <div className={classes.contentContainer}>
            <div className={classes.title}>{title}</div>
            <div className={classes.description}>{children}</div>

            {showSendLog && (
              <div style={{ marginTop: '1rem' }}>
                <div className={classes.bugButton} style={{ marginLeft: 0 }} onClick={this.handleSendLogClicked}>
                  {this.state.buttonToggle ? 'Logs sent' : 'Send logs'}
                </div>
              </div>
            )}
          </div>
        </Modal>
      </ModalPage>
    )
  }
}

export const ErrorPage = withStyles(styles)(_ErrorPage)
