import React, { Component } from 'react'
import { SaladTheme } from '../../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Username, P } from '../../../../components'
import CopyToClipboard from 'react-copy-to-clipboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard } from '@fortawesome/free-solid-svg-icons'

const styles = (theme: SaladTheme) => ({
  container: {
    color: 'inherit',
    userSelect: 'none',
    display: 'inline-flex',
    flexDirection: 'column',
    paddingBottom: '1rem',
  },
  codeContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.green,
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
        <P>
          This is your permanent, unique referral code to share <b>anywhere</b> you can think of.
        </P>
        <div className={classes.codeContainer}>
          <Username>{code}</Username>
          <CopyToClipboard
            text={`Join me on Salad and use code ${code} for a 2x earning rate bonus! https://www.salad.io` || ''}
          >
            <FontAwesomeIcon className={classes.iconButton} icon={faClipboard} size={'lg'} />
          </CopyToClipboard>
        </div>
      </div>
    )
  }
}

export const ReferralCode = withStyles(styles)(_ReferralCode)
