import React, { Component } from 'react'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

import { P, Divider, Username, ExternalLink } from '../../../components'
import CopyToClipboard from 'react-copy-to-clipboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard } from '@fortawesome/free-solid-svg-icons'

const styles = ({
  container: {
    userSelect: 'none',
  },
  rightContent: {
    float: 'right',
  },
  rightText: {
    paddingLeft: 20,
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
  id?: string
  name?: string
  price?: number
  timestamp?: Date
  code?: string
}

class _VaultItem extends Component<Props> {
  render() {
    const { id, name, price, timestamp, code, classes } = this.props
    return (
      <div key={id} className={classnames(classes.container)}>
        <Username blue>{name}</Username>
        <div className={classes.rightContent}>
          <Username blue className={classes.rightText}>
            ${price?.toFixed(2)}
          </Username>
          <Username blue className={classes.rightText}>
            {timestamp?.toLocaleDateString()}
          </Username>
        </div>
        {code && !code.startsWith('https') && (
          <P>
            {code}
            <CopyToClipboard text={code}>
              <FontAwesomeIcon className={classes.iconButton} icon={faClipboard} size={'lg'} />
            </CopyToClipboard>
          </P>
        )}
        {code && code.startsWith('https') && (
          <P>
            <ExternalLink path={code}>Click Here to Claim</ExternalLink>
          </P>
        )}
        <Divider />
      </div>
    )
  }
}

export const VaultItem = withStyles(styles)(_VaultItem)
