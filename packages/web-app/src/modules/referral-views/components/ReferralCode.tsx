import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Username, AppBody } from '../../../components'
import CopyToClipboard from 'react-copy-to-clipboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard } from '@fortawesome/free-solid-svg-icons'

const styles = (theme: SaladTheme) => ({
  container: {
    color: theme.darkBlue,
    userSelect: 'none',
    display: 'inline-flex',
    flexDirection: 'column',
    paddingTop: '1rem',
  },
  codeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    cursor: 'pointer',
    marginLeft: '1rem',
    '&:active': {
      opacity: 0.75,
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  code?: string
}

class _ReferralCode extends Component<Props> {
  render() {
    const { code, classes } = this.props

    return (
      <div className={classes.container}>
        <div className={classes.codeContainer}>
          <Username blue>{code}</Username>
          <CopyToClipboard
            text={`Join me on Salad and use code ${code} for a 2x earning rate bonus! https://www.salad.io` || ''}
          >
            <FontAwesomeIcon className={classes.iconButton} icon={faClipboard} size={'lg'} />
          </CopyToClipboard>
        </div>
        <AppBody>
          This is your permanent, unique referral code to share <b>anywhere</b> you can think of.
        </AppBody>
      </div>
    )
  }
}

export const ReferralCode = withStyles(styles)(_ReferralCode)
