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
    zIndex: 3001,
    position: 'fixed !important',
    right: rightPosition - 2,
    width: '8px !important',
  },
  verticalTrack: {
    backgroundColor: `rgba(219, 241, 193, 0.25)`,
    height: '100%',
    right: rightPosition,
    top: 0,
  },
})

interface Props extends WithStyles<typeof styles> {}

class _AntiVirusScrollbar extends Component<Props> {
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

export const AntiVirusScrollbar = withStyles(styles)(_AntiVirusScrollbar)
