import React, { Component } from 'react'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

import { P, Divider, Username, SmartLink } from '../../../components'
import CopyToClipboard from 'react-copy-to-clipboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard } from '@fortawesome/free-solid-svg-icons'

const styles = {
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
}

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
        <Username>{name}</Username>
        <div className={classes.rightContent}>
          {/* TODO: Add custom classname */}
          <Username>${price?.toFixed(2)}</Username>
          {/* TODO: Add custom classname */}
          <Username>{timestamp?.toLocaleDateString()}</Username>
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
            <SmartLink to={code}>Click here to claim</SmartLink>
          </P>
        )}
        <Divider />
      </div>
    )
  }
}

export const VaultItem = withStyles(styles)(_VaultItem)
