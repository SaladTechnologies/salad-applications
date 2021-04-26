import { Component } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'

const rightPosition = 250

const styles = (theme: SaladTheme) => ({
  scrollThumb: {
    backgroundColor: `${theme.lightGreen}`,
    border: `solid 1px ${theme.lightGreen}`,
    cursor: 'pointer',
    borderRadius: 3,
    position: 'fixed !important',
    right: rightPosition - 2.4,
    width: '3px !important',
  },
  verticalTrack: {
    backgroundColor: `${theme.lightGreen}`,
    height: '100%',
    width: '1px !important',
    right: rightPosition,
    top: 0,
  },
})

interface Props extends WithStyles<typeof styles> {}

class _AntiVirusFirewallScrollbar extends Component<Props> {
  render() {
    const { classes, children } = this.props
    const renderThumb = (props: any) => <div {...props} className={classes.scrollThumb} />
    const renderTrackVertical = (props: any) => <div {...props} className={classes.verticalTrack} />

    return (
      <Scrollbars renderThumbVertical={renderThumb} renderTrackVertical={renderTrackVertical}>
        {children}
      </Scrollbars>
    )
  }
}

export const AntiVirusFirewallScrollbar = withStyles(styles)(_AntiVirusFirewallScrollbar)
