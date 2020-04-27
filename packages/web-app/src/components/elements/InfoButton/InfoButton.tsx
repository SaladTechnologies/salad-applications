import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import i from './assets/i.svg'

const styles = (theme: SaladTheme) => ({
  infoButton: {
    color: theme.lightGreen,
    cursor: 'help',
    height: 18,
    width: 18,
  },
})

interface Props extends WithStyles<typeof styles> {
  text?: string
}

class _InfoButton extends Component<Props> {
  render() {
    const { text, classes } = this.props
    return (
      <>
        <div className={classes.infoButton} data-rh={text}>
          <img height={'auto'} width={'100%'} src={i} alt="" />
        </div>
      </>
    )
  }
}

export const InfoButton = withStyles(styles)(_InfoButton)
