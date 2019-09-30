import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { default as CTC } from 'react-copy-to-clipboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard } from '@fortawesome/free-solid-svg-icons'

const styles = (theme: SaladTheme) => ({
  iconButton: {
    cursor: 'pointer',
    '&:active': {
      opacity: 0.75,
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  text?: string
}

class _CopyToClipboard extends Component<Props> {
  render() {
    const { classes, text } = this.props
    return (
      <CTC text={`${text}` || ''}>
        <FontAwesomeIcon className={classes.iconButton} icon={faClipboard} size={'lg'} />
      </CTC>
    )
  }
}

export const CopyToClipboard = withStyles(styles)(_CopyToClipboard)
