import { faClipboard } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import React, { Component } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
// Packages
import withStyles, { WithStyles } from 'react-jss'
import { Divider, P, SmartLink, Username } from '../../../components'

const styles = {
  container: {
    userSelect: 'none',
  },
  rightContent: {
    float: 'right',
    display: 'flex',
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
  padding: {
    width: 40,
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
          <Username>${price?.toFixed(2)}</Username>
          <div className={classes.padding} />
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
