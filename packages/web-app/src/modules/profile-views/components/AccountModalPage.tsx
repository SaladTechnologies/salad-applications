import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Modal } from '../../../components'
import { Profile } from '../../profile/models'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  contentContainer: {
    color: theme.darkBlue,
    textAlign: 'center',
    padding: '0 4rem',
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
  detailsContainer: {
    color: theme.lightGrey,
    textAlign: 'center',
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.small,
    padding: '2rem 0',
  },
  detailButton: {
    cursor: 'not-allowed',
  },
  lineBreak: {
    borderBottom: `solid 0.5px ${theme.lightGrey}`,
    padding: '.25rem 0',
  },
  logoutButton: {
    display: 'inline-block',
    padding: '.25rem 1rem',
    backgroundColor: theme.darkBlue,
    color: theme.lightGreen,
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
  profile?: Profile
  onCloseClicked?: () => void
  onLogout?: () => void
}

class _AccountModalPage extends Component<Props> {
  handleLogout = () => {
    const { onLogout } = this.props

    if (onLogout) onLogout()
  }
  render() {
    const { profile, onCloseClicked, classes } = this.props
    return (
      <Modal onCloseClicked={onCloseClicked}>
        <div className={classes.contentContainer}>
          <div className={classes.title}>{profile ? profile.username : 'Unknown User'}</div>
          <div className={classes.description}>
            Login with your Salad username to chop Salad on another machine under the same account. In the future you
            can use the following links to access and explore your chef account.
          </div>
        </div>
        <div className={classes.detailsContainer}>
          <div className={classnames(classes.lineBreak, classes.detailButton)}>EDIT USERNAME, AVATAR, PASSWORD</div>
          <div className={classnames(classes.lineBreak, classes.detailButton)}>
            SEE YOUR EARNING HISTORY FOR THIS MACHINE
          </div>
          <div className={classes.detailButton}>SEE YOUR REWARD PAYOUT STATUS & HISTORY</div>
        </div>
        <div>
          <div className={classes.logoutButton} onClick={this.handleLogout}>
            LOG OUT
          </div>
        </div>
      </Modal>
    )
  }
}

export const AccountModalPage = withStyles(styles)(_AccountModalPage)
