import { faClipboard } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { ReactNode } from 'react'
import { Component } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { P, Username } from '../../../../components'
import type { SaladTheme } from '../../../../SaladTheme'

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
  public override render(): ReactNode {
    const { code, classes } = this.props

    return (
      <div className={classes.container}>
        <P>
          This is your permanent, unique referral code to share <b>anywhere</b> you can think of.
        </P>
        <div className={classes.codeContainer}>
          <Username>{code}</Username>
          <CopyToClipboard
            text={`Join me on Salad and use code ${code} for a 2x earning rate bonus! https://salad.com` || ''}
          >
            <FontAwesomeIcon className={classes.iconButton} icon={faClipboard} size={'lg'} />
          </CopyToClipboard>
        </div>
      </div>
    )
  }
}

export const ReferralCode = withStyles(styles)(_ReferralCode)
