import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'
import Scrollbars from 'react-custom-scrollbars'

const styles = (theme: SaladTheme) => ({
  container: {},
  scrollThumb: {
    backgroundColor: theme.lightGreen,
    cursor: 'pointer',
    zIndex: 3001,
  },
  scrollTrack: {
    margin: '.25rem',
    right: 0,
    bottom: (props: Props) => props.scrollBottom || 0,
    top: (props: Props) => props.scrollTop || 0,
    width: '.5rem !important',
    padding: '-5px',
    zIndex: 3000,
    background: `linear-gradient(to right, 
      transparent 0%, 
      transparent calc(50% - 0.81px), 
      ${theme.lightGreen} calc(50% - 0.8px), 
      ${theme.lightGreen} calc(50% + 0.8px), 
      transparent calc(50% + 0.81px), 
      transparent 100%)`,
  },
})

interface Props extends WithStyles<typeof styles> {
  /** Extra padding for the top of the scroll bar */
  scrollTop?: number
  /** Extra padding for the top of the scroll bar */
  scrollBottom?: number
}

class _Scrollbar extends Component<Props> {
  render() {
    const { classes, children } = this.props
    const renderTrack = (props: any) => <div {...props} className={classes.scrollTrack} />
    const renderThumb = (props: any) => <div {...props} className={classes.scrollThumb} />

    return (
      <Scrollbars
        renderTrackHorizontal={renderTrack}
        renderTrackVertical={renderTrack}
        renderThumbHorizontal={renderThumb}
        renderThumbVertical={renderThumb}
        hideTracksWhenNotNeeded
      >
        <div className={classes.container}>{children}</div>
      </Scrollbars>
    )
  }
}

export const Scrollbar = withStyles(styles)(_Scrollbar)
