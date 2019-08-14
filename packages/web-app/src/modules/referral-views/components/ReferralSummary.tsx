import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { StatElement, Tooltip } from '../../../components'
import CopyToClipboard from 'react-copy-to-clipboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard, faEnvelope } from '@fortawesome/free-solid-svg-icons'

const styles = (theme: SaladTheme) => ({
  subText: {
    paddingTop: '1rem',
  },
  referralCode: {
    padding: '1rem 0',
    fontSize: 12,
    color: theme.darkBlue,
    fontFamily: theme.fontGroteskBook25,
    pointerEvents: 'auto',
    cursor: 'pointer',
    userSelect: 'none',
  },
  iconButton: {
    paddingLeft: '.5rem',
    cursor: 'pointer',
    pointerEvents: 'auto',
  },
})

interface Props extends WithStyles<typeof styles> {
  referralCode?: string
  pendingCount?: number
  completedCount?: number
  onOpenDetails?: () => void
}

class _ReferralSummary extends Component<Props> {
  handleOpenDetails = () => {
    const { onOpenDetails } = this.props

    if (onOpenDetails) onOpenDetails()
  }

  render() {
    const { referralCode, pendingCount, completedCount, classes } = this.props
    return (
      <>
        <StatElement
          title={'Referrals'}
          values={[`${pendingCount || 0} pending`, `${completedCount || 0} Completed`]}
          // showInfo
          infoTooltip={
            <Tooltip
              width={'212px'}
              text={'Get a bonus when your friend runs salad, they get a bonus earning rate too!'}
            >
              <div className={classes.subText}>Use this custom referral link</div>
              <CopyToClipboard text={referralCode || ''}>
                <div className={classes.referralCode}>
                  {referralCode}
                  <FontAwesomeIcon className={classes.iconButton} icon={faClipboard} size={'lg'} />
                </div>
              </CopyToClipboard>
              <div onClick={this.handleOpenDetails}>
                Send:
                <FontAwesomeIcon className={classes.iconButton} icon={faEnvelope} size={'lg'} />
              </div>
            </Tooltip>
          }
        />
      </>
    )
  }
}

export const ReferralSummary = withStyles(styles)(_ReferralSummary)
