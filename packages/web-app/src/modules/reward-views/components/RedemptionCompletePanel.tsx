import React, { Component, ReactNode } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { AngledPanel, ExternalLink } from '../../../components'
import { Reward } from '../../reward/models/Reward'
import { CopyToClipboard } from '../../../components/elements/CopyToClipboard/Clipboard'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    position: 'relative',
    width: '790px',
    userSelect: 'none',
  },
  lock: {
    position: 'absolute',
    right: '.5rem',
    top: '.5rem',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    },
  },
  imageContainer: {
    height: '12rem',
    display: 'inline-block',
    width: '290px',
    backgroundColor: (props: Props) => (props.reward && props.reward.color) || theme.green,
  },
  image: {
    height: '100%',
    width: 'auto',
  },
  rightContainer: {
    width: '37rem',
    padding: '.5rem',
    overflow: 'hidden',
    marginLeft: '.5rem',
    display: 'inline-flex',
    flexDirection: 'column',
    backgroundColor: (props: Props) => (props.reward && props.reward.redeemable ? theme.green : theme.darkGreen),
    color: (props: Props) => (props.reward && props.reward.redeemable ? theme.darkBlue : theme.green),
  },
  nameText: {
    fontSize: theme.xLarge,
    fontFamily: 'SharpGroteskLight09',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  details: {
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.medium,
  },
  priceText: {
    fontSize: theme.medium,
    fontFamily: 'SharpGroteskLight25',
    whiteSpace: 'pre',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  centered: {
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  top: {
    paddingTop: '1rem',
  },
  bottom: {
    paddingBottom: '1rem',
  },
  verticle: {
    verticalAlign: 'middle',
  },
  left: {
    paddingLeft: '1rem',
  },
})

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
  onClickClose?: () => void
  children?: ReactNode
  code?: string
  openCanny?: () => void
}

class _RedemptionCompletePanel extends Component<Props> {
  timeRemainingText() {
    const { reward } = this.props

    if (reward === undefined) {
      return ''
    }

    if (reward.redeemable) {
      return '  |  Redeemable'
    }

    if (reward.remainingTimeLabel) {
      return `  |  ${reward.remainingTimeLabel}`
    }

    return ' '
  }

  handleClose = () => {
    const { onClickClose } = this.props

    if (onClickClose) {
      onClickClose()
    }
  }
  isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  render() {
    const { reward, classes, children, code, openCanny } = this.props

    return (
      <div className={classnames(classes.container)}>
        <AngledPanel className={classes.imageContainer} leftSide={'right'}>
          {reward && <img className={classes.image} src={reward.image} draggable={false} />}
        </AngledPanel>

        <div className={classnames(classes.rightContainer)}>
          <div style={{ flex: '1' }}>
            <div className={classes.lock} onClick={this.handleClose}>
              <FontAwesomeIcon icon={faTimes} />
            </div>
            {!code && (
              <>
                <div className={classnames(classes.nameText, classes.left)}>
                  WE WILL SEND YOU AN EMAIL WITHIN 24 HOURS
                </div>
                <div className={classnames(classes.details, classes.left)}>
                  We're working on automating our redemption process, so for now we are going to send you your reward
                  manually via email which can take up to 24 hours. If you do not receive anything within 24 hours,
                  please contact our Support team via our
                  <a href="javascript:;" onClick={openCanny}>
                    Support page{' '}
                  </a>
                  or our<ExternalLink path={"https://discordapp.com/invite/xcvmgQk"}> Discord channel</ExternalLink>.
                </div>
              </>
            )}
            {code && (
              <>
                <div className={classnames(classes.nameText, classes.centered)}>
                  {reward ? `${reward.name} Redeemed!` : null}
                </div>
                <div className={classnames(classes.details, classes.centered)}>
                  Nicely done, but how good are you at timed quests?
                  <div className={classnames(classes.centered, classes.top)}>
                    {!this.isValidUrl(code) && (
                      <div>
                        {code}{' '}
                        <span className={classnames(classes.bottom)}>
                          <CopyToClipboard text={code} />
                        </span>
                      </div>
                    )}
                    {this.isValidUrl(code) && (
                      <div>
                        <ExternalLink path={code}>{code}</ExternalLink>
                      </div>
                    )}
                    <div className={classnames(classes.bold, classes.top)}>
                      You only have 48 hours before this link expires!
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          {children}
        </div>
      </div>
    )
  }
}

export const RedemptionCompletePanel = withStyles(styles)(_RedemptionCompletePanel)
