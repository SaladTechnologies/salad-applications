import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ToolTip } from './Tooltip'
import { faInfo } from '@fortawesome/free-solid-svg-icons'
// @ts-ignore
import ReactHintFactory from 'react-hint'
const ReactHint = ReactHintFactory(React)

const styles = (theme: SaladTheme) => ({
  infoButton: {
    color: theme.mediumGreen,
    padding: '.5rem',
    cursor: 'help',
  },
})

interface Props extends WithStyles<typeof styles> {
  text?: string
}

class _InfoButton extends Component<Props> {
  render() {
    const { text, classes } = this.props
    return (
      <span>
        <span className={classes.infoButton} data-rh="machine-sync-tooltip">
          <FontAwesomeIcon icon={faInfo} />
        </span>
        <ReactHint autoPosition events onRenderContent={() => <ToolTip width={'14rem'} text={text} />} />
      </span>
    )
  }
}

export const InfoButton = withStyles(styles)(_InfoButton)
