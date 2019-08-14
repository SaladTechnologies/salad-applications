import React, { Component, ReactNode } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { Tooltip } from '../../Tooltip'
import i from './assets/i.svg'

// @ts-ignore
import ReactHintFactory from 'react-hint'
const ReactHint = ReactHintFactory(React)

const styles = (theme: SaladTheme) => ({
  infoButton: {
    color: theme.lightGreen,
    cursor: 'help',
  },
})

interface Props extends WithStyles<typeof styles> {
  text?: string
  tooltip?: ReactNode
}

class _InfoButton extends Component<Props> {
  render() {
    const { text, tooltip, classes } = this.props
    return (
      <>
        <span className={classes.infoButton} data-rh="machine-sync-tooltip">
          <img height={25} width={'auto'} src={i} />
        </span>
        <ReactHint
          delay={{ hide: 250 }}
          events={{ click: true }}
          autoPosition
          onRenderContent={() => tooltip || (text && <Tooltip width={'14rem'} text={text} />)}
        />
      </>
    )
  }
}

export const InfoButton = withStyles(styles)(_InfoButton)
